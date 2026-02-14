import { useEffect, useMemo, useRef, useState } from 'react';
import { HeroSection, Section, Grid, PlaceholderPanel } from '@/components/ui/section';
import { Card, CardBody, CardHeader } from '@/components/ui/card-custom';
import { Button } from '@/components/ui/button-custom';
import { Input } from '@/components/ui/input-custom';
import { Upload, Camera, AlertTriangle, Leaf, Info } from 'lucide-react';
import { createWorker, type RecognizeResult } from 'tesseract.js';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

type BBox = { x0: number; y0: number; x1: number; y1: number };
type OverlayBox = { text?: string; confidence?: number; bbox: BBox };

type OcrResponse = {
  text: string;
  confidence: number;
  word_count: number;
  languages: string;
  filename?: string;
  file_size?: number;
  image_dimensions?: { width: number; height: number };
  language_names?: string[];
  // Optional: keep boxes so we can render overlays later / pass to AI
  words?: OverlayBox[];
  lines?: OverlayBox[];
};

type NutrientNum = { value: number; unit?: string };

interface AuroraBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  showRadialGradient?: boolean;
}

const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-zinc-50 text-slate-950',
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn(
            `
            [--white-gradient:repeating-linear-gradient(100deg,rgba(255,255,255,0.85)_0%,rgba(255,255,255,0.85)_7%,rgba(255,255,255,0)_10%,rgba(255,255,255,0)_12%,rgba(255,255,255,0.85)_16%)]
            [--aurora:repeating-linear-gradient(100deg,#3b82f6_10%,#a5b4fc_15%,#93c5fd_20%,#ddd6fe_25%,#60a5fa_30%)]
            [background-image:var(--white-gradient),var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            filter blur-[10px]
            after:content-[""] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] 
            after:[background-size:200%,_100%] 
            after:animate-aurora after:[background-attachment:fixed]
            pointer-events-none
            absolute -inset-[10px] opacity-60 will-change-transform
            `,
            showRadialGradient &&
              `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]`
          )}
        />
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default function ProductLabelAuditor() {
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState<OcrResponse | null>(null);
  const [understandRequested, setUnderstandRequested] = useState(false);
  const [understandLoading, setUnderstandLoading] = useState(false);
  const [understandError, setUnderstandError] = useState<string | null>(null);
  const [understandResult, setUnderstandResult] = useState<any>(null);
  const [understandGoal, setUnderstandGoal] = useState<
    'ingredients' | 'nutrition' | 'allergens' | 'warnings' | 'summary'
  >('nutrition');
  const [selectedLangs, setSelectedLangs] = useState<string[]>(['eng']);
  const [preprocess, setPreprocess] = useState(true);
  const [progress, setProgress] = useState<number>(0);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [showBoxes, setShowBoxes] = useState(true);
  const [boxMode, setBoxMode] = useState<'lines' | 'words'>('lines');
  const [overlayZoom, setOverlayZoom] = useState(1);
  const [overlayPan, setOverlayPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const workerRef = useRef<Awaited<ReturnType<typeof createWorker>> | null>(null);
  const workerLangRef = useRef<string | null>(null);
  const overlayImgRef = useRef<HTMLImageElement | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayViewportRef = useRef<HTMLDivElement | null>(null);
  const panStartRef = useRef<{ mx: number; my: number; x: number; y: number } | null>(null);

  const languagesValue = useMemo(() => {
    const deduped = Array.from(new Set(selectedLangs)).filter(Boolean);
    return deduped.length ? deduped.join('+') : 'eng';
  }, [selectedLangs]);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0] ?? null;
    setError(null);
    setOcrResult(null);
    setHasAnalyzed(false);
    setFile(picked);
    setProgress(0);
    setProgressStatus('');
    setShowBoxes(true);
    setBoxMode('lines');
    setOverlayZoom(1);
    setOverlayPan({ x: 0, y: 0 });
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(picked ? URL.createObjectURL(picked) : null);
  };

  const toggleLang = (lang: string) => {
    setSelectedLangs((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please upload a label image first.');
      return;
    }
    setLoading(true);
    setError(null);
    setOcrResult(null);
    setUnderstandRequested(false);
    setProgress(0);
    setProgressStatus('Starting OCR…');
    try {
      // Create (or reuse) a single worker for performance.
      // If language changes, re-create worker.
      if (!workerRef.current || workerLangRef.current !== languagesValue) {
        if (workerRef.current) {
          await workerRef.current.terminate();
          workerRef.current = null;
          workerLangRef.current = null;
        }

        const worker = await createWorker(languagesValue, 1, {
          logger: (m) => {
            if (m.status) setProgressStatus(m.status);
            if (typeof m.progress === 'number') setProgress(Math.round(m.progress * 100));
          },
        });
        workerRef.current = worker;
        workerLangRef.current = languagesValue;
      }

      const worker = workerRef.current!;

      // Note: preprocess toggle is kept for parity; tesseract.js does its own internal processing.
      // We can add custom preprocessing later if needed.
      const ret: RecognizeResult = await worker.recognize(file);

      const text = (ret.data.text || '').trim();
      const confidence = typeof ret.data.confidence === 'number' ? ret.data.confidence : 0;
      const word_count =
        ret.data.words?.filter((w) => (w.text || '').trim().length > 0).length ??
        (text ? text.split(/\s+/).filter(Boolean).length : 0);

      const words: OverlayBox[] =
        ret.data.words?.map((w) => ({
          text: w.text,
          confidence: w.confidence,
          bbox: { x0: w.bbox.x0, y0: w.bbox.y0, x1: w.bbox.x1, y1: w.bbox.y1 },
        })) ?? [];

      const lines: OverlayBox[] =
        // @ts-expect-error: lines exists on runtime data; types may vary by tesseract.js version
        (ret.data.lines?.map((l: any) => ({
          text: l.text,
          confidence: l.confidence,
          bbox: { x0: l.bbox.x0, y0: l.bbox.y0, x1: l.bbox.x1, y1: l.bbox.y1 },
        })) ?? []);

      const data: OcrResponse = {
        text,
        confidence: Math.round(confidence * 100) / 100,
        word_count,
        languages: languagesValue,
        filename: file.name,
        file_size: file.size,
        words: words.slice(0, 400),
        lines: lines.slice(0, 200),
      };

      setOcrResult(data);
    setHasAnalyzed(true);
      setProgress(100);
      setProgressStatus('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OCR failed');
    } finally {
      setLoading(false);
    }
  };

  const redrawOverlay = () => {
    const img = overlayImgRef.current;
    const canvas = overlayCanvasRef.current;
    if (!img || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ensure canvas matches rendered image size
    const displayW = img.clientWidth;
    const displayH = img.clientHeight;
    if (displayW === 0 || displayH === 0) return;

    // Resize canvas only if needed (resizing clears it)
    if (canvas.width !== displayW || canvas.height !== displayH) {
      canvas.width = displayW;
      canvas.height = displayH;
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    if (!showBoxes || !ocrResult) return;

    const naturalW = img.naturalWidth || displayW;
    const naturalH = img.naturalHeight || displayH;
    const sx = displayW / naturalW;
    const sy = displayH / naturalH;

    const boxes = (boxMode === 'words' ? ocrResult.words : ocrResult.lines) ?? [];

    // Styling similar to your screenshot: red boxes
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.9)';
    ctx.fillStyle = 'rgba(255, 0, 0, 0.06)';

    for (const b of boxes) {
      const x = b.bbox.x0 * sx;
      const y = b.bbox.y0 * sy;
      const w = (b.bbox.x1 - b.bbox.x0) * sx;
      const h = (b.bbox.y1 - b.bbox.y0) * sy;
      ctx.fillRect(x, y, w, h);
      ctx.strokeRect(x, y, w, h);
    }
  };

  // Redraw overlay when result/toggles change
  useEffect(() => {
    // Wait a tick for layout so img sizes are correct
    const id = window.requestAnimationFrame(() => redrawOverlay());
    return () => window.cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ocrResult, showBoxes, boxMode, previewUrl]);

  // Redraw overlay on window resize
  useEffect(() => {
    const onResize = () => redrawOverlay();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ocrResult, showBoxes, boxMode]);

  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

  const fitToView = () => {
    const img = overlayImgRef.current;
    const viewport = overlayViewportRef.current;
    if (!img || !viewport) return;
    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    const iw = img.naturalWidth || img.clientWidth || 1;
    const ih = img.naturalHeight || img.clientHeight || 1;
    if (vw <= 0 || vh <= 0 || iw <= 0 || ih <= 0) return;

    const z = clamp(Math.min(vw / iw, vh / ih, 1), 0.25, 3);
    setOverlayZoom(z);
    setOverlayPan({
      x: Math.round((vw - iw * z) / 2),
      y: Math.round((vh - ih * z) / 2),
    });
  };

  const handleOverlayWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    // Zoom in/out with mouse wheel
    e.preventDefault();
    const viewport = overlayViewportRef.current;
    if (!viewport) return;

    const rect = viewport.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const delta = e.deltaY;
    const factor = delta > 0 ? 0.9 : 1.1;
    const nextZoom = clamp(overlayZoom * factor, 0.5, 3);

    // Zoom around cursor point
    // world = (mouse - pan) / zoom
    const worldX = (mx - overlayPan.x) / overlayZoom;
    const worldY = (my - overlayPan.y) / overlayZoom;
    const nextPan = {
      x: mx - worldX * nextZoom,
      y: my - worldY * nextZoom,
    };

    setOverlayZoom(nextZoom);
    setOverlayPan(nextPan);
  };

  const handleOverlayMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    setIsPanning(true);
    panStartRef.current = { mx: e.clientX, my: e.clientY, x: overlayPan.x, y: overlayPan.y };
  };

  const handleOverlayMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanning || !panStartRef.current) return;
    const dx = e.clientX - panStartRef.current.mx;
    const dy = e.clientY - panStartRef.current.my;
    setOverlayPan({ x: panStartRef.current.x + dx, y: panStartRef.current.y + dy });
  };

  const endPan = () => {
    setIsPanning(false);
    panStartRef.current = null;
  };

  const zoomIn = () => setOverlayZoom((z) => clamp(z * 1.15, 0.5, 3));
  const zoomOut = () => setOverlayZoom((z) => clamp(z / 1.15, 0.5, 3));
  const resetView = () => fitToView();

  const handleUnderstandLabel = () => {
    if (!ocrResult) return;
    setUnderstandRequested(true);
    setUnderstandLoading(true);
    setUnderstandError(null);
    setUnderstandResult(null);

    // Send a compact payload (avoid heavy bbox arrays)
    const payload = {
      intent: understandGoal,
      ocr: {
        text: ocrResult.text,
        confidence: ocrResult.confidence,
        word_count: ocrResult.word_count,
        languages: ocrResult.languages,
        filename: ocrResult.filename,
      },
    };

    fetch("/api/label/understand", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (r) => {
        const data = await r.json().catch(() => null);
        if (!r.ok) {
          const retry = data?.retryAfterSeconds ? ` Retry after ${data.retryAfterSeconds}s.` : "";
          const msg =
            data?.message ||
            data?.detail ||
            data?.error ||
            `Request failed (${r.status}).`;
          const hint = data?.hint ? ` ${data.hint}` : "";
          throw new Error(`${msg}${retry}${hint}`.trim());
        }
        return data;
      })
      .then((data) => {
        setUnderstandResult(data);
      })
      .catch((err) => {
        setUnderstandError(err instanceof Error ? err.message : "Failed to understand label");
      })
      .finally(() => {
        setUnderstandLoading(false);
      });
  };

  const parsedGemini = useMemo(() => {
    const raw = understandResult?.result ?? understandResult;
    if (!raw) return null;
    if (typeof raw === "object") return raw;
    if (typeof raw !== "string") return null;
    const strip = (s: string) =>
      s
        .trim()
        .replace(/^```[a-zA-Z]*\s*/m, "")
        .replace(/```$/m, "")
        .trim();
    try {
      return JSON.parse(strip(raw));
    } catch {
      return null;
    }
  }, [understandResult]);

  const parseNutrientNumber = (raw: unknown): NutrientNum | null => {
    if (raw == null) return null;
    const s = String(raw).trim();
    if (!s) return null;
    const cleaned = s.replace(',', '.');
    const m = cleaned.match(/-?\d+(\.\d+)?/);
    if (!m) return null;
    const value = Number(m[0]);
    if (!Number.isFinite(value)) return null;
    const unit = cleaned.replace(m[0], '').trim().slice(0, 8) || undefined;
    return { value, unit };
  };

  const normKey = (k: string) => k.toLowerCase().replace(/[^a-z0-9]/g, '');

  const per100g = useMemo(() => {
    const obj = parsedGemini?.nutrition?.per_100g;
    return obj && typeof obj === 'object' ? obj : null;
  }, [parsedGemini]);

  const per100gNums = useMemo(() => {
    if (!per100g) return null;
    const get = (...keys: string[]) => {
      for (const k of keys) {
        const v = (per100g as any)[k];
        const parsed = parseNutrientNumber(v);
        if (parsed) return parsed;
      }
      const entries = Object.entries(per100g as any) as Array<[string, any]>;
      for (const [k, v] of entries) {
        const nk = normKey(k);
        for (const needle of keys.map(normKey)) {
          if (nk === needle) {
            const parsed = parseNutrientNumber(v);
            if (parsed) return parsed;
          }
        }
      }
      return null;
    };

    return {
      sugar_g: get('ofwhichSugars', 'Sugars', 'Sugar', 'Added Sugars')?.value ?? null,
      sodium_mg: get('Sodium (mg)', 'Sodium')?.value ?? null,
      fat_g: get('Total Fat (g)', 'Total Fat', 'Fat')?.value ?? null,
      sat_fat_g: get('Saturated Fat (g)', 'Saturated Fat')?.value ?? null,
      trans_fat_g: get('Trans Fat (g)', 'Trans Fat')?.value ?? null,
      carbs_g: get('Carbohydrate (g)', 'Carbohydrates (g)', 'Carbohydrate', 'Carbs')?.value ?? null,
      protein_g: get('Protein (g)', 'Protein')?.value ?? null,
      fiber_g: get('Dietary Fibre (g)', 'Dietary Fiber (g)', 'Fiber (g)', 'Fibre (g)', 'Fiber', 'Fibre')?.value ?? null,
      energy_kcal: get('Energy (kcal)', 'Energy', 'Calories')?.value ?? null,
    };
  }, [per100g]);

  const nutritionFlags = useMemo(() => {
    if (!per100gNums) return [];
    const flags: Array<{ title: string; detail: string; level: 'red' | 'amber' | 'green' }> = [];

    if (typeof per100gNums.sugar_g === 'number') {
      const v = per100gNums.sugar_g;
      flags.push({
        title: v > 22.5 ? 'High Sugar' : 'Sugar',
        detail: `${v} g / 100g`,
        level: v > 22.5 ? 'red' : v > 10 ? 'amber' : 'green',
      });
    }

    if (typeof per100gNums.sodium_mg === 'number') {
      const v = per100gNums.sodium_mg;
      flags.push({
        title: v > 600 ? 'High Sodium' : 'Sodium',
        detail: `${v} mg / 100g`,
        level: v > 600 ? 'red' : v > 120 ? 'amber' : 'green',
      });
    }

    if (typeof per100gNums.fat_g === 'number') {
      const v = per100gNums.fat_g;
      flags.push({
        title: v > 17.5 ? 'High Fat' : 'Fat',
        detail: `${v} g / 100g`,
        level: v > 17.5 ? 'red' : v > 3 ? 'amber' : 'green',
      });
    }

    if (typeof per100gNums.sat_fat_g === 'number') {
      const v = per100gNums.sat_fat_g;
      flags.push({
        title: v > 5 ? 'High Saturated Fat' : 'Saturated Fat',
        detail: `${v} g / 100g`,
        level: v > 5 ? 'red' : v > 1.5 ? 'amber' : 'green',
      });
    }

    return flags;
  }, [per100gNums]);

  const pieData = useMemo(() => {
    if (!per100gNums) return [];
    const items: Array<{ name: string; value: number; color: string }> = [];
    const add = (name: string, value: number | null, color: string) => {
      if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
        items.push({ name, value, color });
      }
    };
    add('Carbs', per100gNums.carbs_g, '#60a5fa');
    add('Protein', per100gNums.protein_g, '#34d399');
    add('Fat', per100gNums.fat_g, '#f59e0b');
    add('Fiber', per100gNums.fiber_g, '#a78bfa');
    add('Sugars', per100gNums.sugar_g, '#fb7185');
    return items;
  }, [per100gNums]);

  const perServing = useMemo(() => {
    const obj = parsedGemini?.nutrition?.per_serving;
    return obj && typeof obj === 'object' ? obj : null;
  }, [parsedGemini]);

  const isClearlyCorrupted = (raw: unknown) => {
    if (raw == null) return true;
    const s = String(raw).trim();
    if (!s) return true;
    // Too many letters and no digits → likely OCR garbage for numeric fields
    const hasDigit = /\d/.test(s);
    const letterCount = (s.match(/[A-Za-z]/g) || []).length;
    if (!hasDigit && letterCount >= 3) return true;
    // Common OCR garbage tokens seen in examples
    if (/^(taka|toke|bmg|z?bmg)$/i.test(s.replace(/\s+/g, ''))) return true;
    return false;
  };

  const pickVal = (obj: any, keys: string[]) => {
    if (!obj) return null;
    for (const k of keys) {
      const v = obj[k];
      if (v != null && String(v).trim()) return v;
    }
    const entries = Object.entries(obj) as Array<[string, any]>;
    for (const [k, v] of entries) {
      const nk = normKey(k);
      for (const kk of keys.map(normKey)) {
        if (nk === kk && v != null && String(v).trim()) return v;
      }
    }
    return null;
  };

  const nutritionRows = useMemo(() => {
    const rows = [
      { label: 'Energy', keys: ['Energy (kcal)', 'Energy', 'Calories'], unitHint: 'kcal' },
      { label: 'Carbohydrate', keys: ['Carbohydrate (g)', 'Carbohydrates (g)', 'Carbohydrate', 'Carbs'], unitHint: 'g' },
      { label: 'Sugars', keys: ['ofwhichSugars', 'Sugars', 'Sugar', 'Added Sugars'], unitHint: 'g' },
      { label: 'Protein', keys: ['Protein (g)', 'Protein'], unitHint: 'g' },
      { label: 'Total Fat', keys: ['Total Fat (g)', 'Total Fat', 'Fat'], unitHint: 'g' },
      { label: 'Saturated Fat', keys: ['Saturated Fat (g)', 'Saturated Fat'], unitHint: 'g' },
      { label: 'Trans Fat', keys: ['Trans Fat (g)', 'Trans Fat'], unitHint: 'g' },
      { label: 'Sodium', keys: ['Sodium (mg)', 'Sodium'], unitHint: 'mg' },
      { label: 'Fiber', keys: ['Dietary Fibre (g)', 'Dietary Fiber (g)', 'Fiber (g)', 'Fibre (g)', 'Fiber', 'Fibre'], unitHint: 'g' },
    ];

    return rows.map((r) => {
      const ps = pickVal(perServing as any, r.keys);
      const p100 = pickVal(per100g as any, r.keys);
      return {
        ...r,
        perServing: ps,
        per100g: p100,
      };
    });
  }, [perServing, per100g]);

  const additiveMap = useMemo(
    () =>
      ({
        E211: { name: 'Sodium Benzoate', type: 'Preservative' },
        E260: { name: 'Acetic Acid', type: 'Acidity regulator' },
        E415: { name: 'Xanthan Gum', type: 'Stabilizer / Thickener' },
        E1422: { name: 'Modified Starch', type: 'Stabilizer / Thickener' },
        E150D: { name: 'Caramel Colour (Class IV)', type: 'Colour' },
      }) as Record<string, { name: string; type: string }>,
    []
  );

  const detectedAdditives = useMemo(() => {
    const codes: string[] = [];
    const fromModel = Array.isArray(parsedGemini?.additives_e_numbers) ? parsedGemini.additives_e_numbers : [];
    for (const c of fromModel) codes.push(String(c));

    const sourceText = String(parsedGemini?.human_summary ?? '') + '\n' + String(ocrResult?.text ?? '');
    const re = /\b(?:E|INS)\s*[-:]?\s*(\d{3,4}[a-zA-Z]?)\b/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(sourceText))) {
      const raw = m[1].toUpperCase();
      codes.push(`E${raw}`);
    }

    const norm = (c: string) =>
      c
        .toUpperCase()
        .replace(/\s+/g, '')
        .replace(/^INS/, 'E')
        .replace(/^E-?/, 'E');
    const uniq = Array.from(new Set(codes.map(norm)));
    return uniq.filter((c) => /^E\d{3,4}[A-Z]?$/.test(c));
  }, [parsedGemini, ocrResult]);

  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <AuroraBackground>
      <HeroSection
        title="Product Label Auditor"
          subtitle="Ab Label Padhega aur Samjhega India"
        description="Upload a product label image or PDF to extract ingredients, analyze warnings, and verify compliance information."
          className="bg-none bg-transparent"
      />
      </AuroraBackground>

      {/* Main Content */}
      <Section>
        {/* Top row: Upload (left) + Processed Text (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left: Upload + OCR controls */}
          <div>
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-foreground">Upload Label</h3>
              </CardHeader>
              <CardBody className="flex flex-col gap-6">
                {/* File Upload Area */}
                <div
                  className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
                  onClick={openFilePicker}
                >
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                  <p className="font-semibold text-foreground mb-1">Upload Label Image</p>
                  <p className="text-sm text-foreground/60">
                    Drag and drop or click to select
                  </p>
                </div>

                {/* Camera Button for Mobile */}
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={openFilePicker}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Take Photo
                </Button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {previewUrl && (
                  <div className="rounded-lg overflow-hidden border border-border">
                    <img
                      src={previewUrl}
                      alt="Uploaded label preview"
                      className="w-full h-auto object-contain bg-muted/20"
                    />
                  </div>
                )}

                {/* OCR options */}
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-2">Languages</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { code: 'eng', label: 'English' },
                        { code: 'hin', label: 'Hindi' },
                        { code: 'mar', label: 'Marathi' },
                        { code: 'tel', label: 'Telugu' },
                        { code: 'tam', label: 'Tamil' },
                      ].map((l) => (
                        <button
                          key={l.code}
                          type="button"
                          onClick={() => toggleLang(l.code)}
                          className={[
                            'px-3 py-1 rounded-full text-xs font-semibold border transition-colors',
                            selectedLangs.includes(l.code)
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-muted/30 text-foreground/70 border-border hover:bg-muted/50',
                          ].join(' ')}
                        >
                          {l.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-foreground/60 mt-2">Selected: {languagesValue}</p>
                  </div>

                  <label className="flex items-center gap-2 text-sm text-foreground/80">
                    <input
                      type="checkbox"
                      checked={preprocess}
                      onChange={(e) => setPreprocess(e.target.checked)}
                    />
                    Improve accuracy (preprocess image)
                  </label>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-1">Tips for best results:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Ensure label is clearly visible</li>
                        <li>Good lighting is important</li>
                        <li>Include nutrition and ingredient information</li>
                        <li>Supports JPG, PNG, JPEG, and WEBP formats</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                    {error}
                  </div>
                )}

                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={handleAnalyze}
                  disabled={!file || loading}
                  >
                  {loading ? 'Extracting text…' : 'Extract Text (OCR)'}
                  </Button>

                {loading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-foreground/60">
                      <span>{progressStatus || 'working…'}</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted/40 overflow-hidden border border-border">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Right: Processed plain text */}
          <div className="space-y-6">
              <Card>
              <CardHeader>
                <h3 className="font-semibold text-foreground">Processed Text</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <div>
                  <p className="text-xs text-foreground/60 mb-2">
                    OCR output (plain text) — this will be sent to Gemini for understanding.
                  </p>
                  <textarea
                    className="w-full min-h-[380px] rounded-lg border border-border bg-background p-3 text-sm text-foreground/90 focus:outline-none focus:ring-2 focus:ring-primary/40"
                    value={ocrResult?.text ?? ''}
                    placeholder="Run OCR to see extracted text here…"
                    readOnly
                  />
                </div>
                </CardBody>
              </Card>
          </div>
        </div>

        {/* Below top row: OCR boxes + extracted text + Gemini understanding */}
        <div className="mt-8 space-y-6">
          {/* OCR output section */}
                <Card>
                  <CardHeader>
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <Leaf className="w-5 h-5 text-accent" />
                Extracted Text (OCR) + Boxes
                    </h3>
                  </CardHeader>
                  <CardBody className="space-y-4">
              {!hasAnalyzed ? (
                <div className="text-sm text-foreground/70 bg-muted/20 border border-border rounded-lg p-4">
                  Upload a label and click <strong>Extract Text (OCR)</strong> to see detected boxes and extracted text here.
                </div>
              ) : (
                <>
                  {/* Image + Boxes */}
                  {previewUrl && (
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                        <label className="flex items-center gap-2 text-sm text-foreground/80">
                          <input
                            type="checkbox"
                            checked={showBoxes}
                            onChange={(e) => setShowBoxes(e.target.checked)}
                          />
                          Show detected text boxes
                        </label>

                        <div className="flex items-center gap-2 text-xs text-foreground/60">
                          <span>Boxes:</span>
                          <button
                            type="button"
                            onClick={() => setBoxMode('lines')}
                            className={[
                              'px-2 py-1 rounded-md border',
                              boxMode === 'lines'
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-muted/20 text-foreground/70 border-border hover:bg-muted/40',
                            ].join(' ')}
                          >
                            Lines
                          </button>
                          <button
                            type="button"
                            onClick={() => setBoxMode('words')}
                            className={[
                              'px-2 py-1 rounded-md border',
                              boxMode === 'words'
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-muted/20 text-foreground/70 border-border hover:bg-muted/40',
                            ].join(' ')}
                          >
                            Words
                          </button>
                        </div>
                      </div>

                      <div className="rounded-lg overflow-hidden border border-border bg-muted/10">
                        <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-background/70">
                          <div className="text-xs text-foreground/60">
                            Drag to move • Scroll to zoom • Zoom: {Math.round(overlayZoom * 100)}%
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={zoomOut}
                              className="px-2 py-1 rounded-md border bg-muted/20 text-foreground/70 border-border hover:bg-muted/40 text-xs"
                            >
                              −
                            </button>
                            <button
                              type="button"
                              onClick={zoomIn}
                              className="px-2 py-1 rounded-md border bg-muted/20 text-foreground/70 border-border hover:bg-muted/40 text-xs"
                            >
                              +
                            </button>
                            <button
                              type="button"
                              onClick={resetView}
                              className="px-2 py-1 rounded-md border bg-muted/20 text-foreground/70 border-border hover:bg-muted/40 text-xs"
                            >
                              Reset
                            </button>
                          </div>
                        </div>

                        <div
                          ref={overlayViewportRef}
                          className="h-[520px] overflow-hidden p-3 bg-background select-none"
                          onWheel={handleOverlayWheel}
                          onMouseDown={handleOverlayMouseDown}
                          onMouseMove={handleOverlayMouseMove}
                          onMouseUp={endPan}
                          onMouseLeave={endPan}
                          style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
                        >
                          <div
                            className="relative inline-block will-change-transform"
                            style={{ transform: `translate(${overlayPan.x}px, ${overlayPan.y}px)` }}
                          >
                            <div
                              className="relative inline-block will-change-transform"
                              style={{ transform: `scale(${overlayZoom})`, transformOrigin: '0 0' }}
                            >
                            <img
                              ref={overlayImgRef}
                              src={previewUrl}
                              alt="OCR overlay preview"
                              className="block max-w-none h-auto"
                              onLoad={() => {
                                // Draw boxes then fit view to avoid "too enlarged" display
                                redrawOverlay();
                                // Fit after layout settles
                                window.requestAnimationFrame(() => fitToView());
                              }}
                            />
                            <canvas
                              ref={overlayCanvasRef}
                              className="absolute inset-0 pointer-events-none"
                            />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-muted/20 border border-border rounded-lg p-3">
                      <p className="text-xs text-foreground/60 mb-1">Confidence</p>
                      <p className="font-semibold text-foreground">{ocrResult?.confidence ?? '—'}</p>
                    </div>
                    <div className="bg-muted/20 border border-border rounded-lg p-3">
                      <p className="text-xs text-foreground/60 mb-1">Words</p>
                      <p className="font-semibold text-foreground">{ocrResult?.word_count ?? '—'}</p>
                    </div>
                    <div className="bg-muted/20 border border-border rounded-lg p-3">
                      <p className="text-xs text-foreground/60 mb-1">Languages</p>
                      <p className="font-semibold text-foreground">{ocrResult?.languages ?? languagesValue}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-foreground/60 mb-2">Extracted text</p>
                    <textarea
                      className="w-full min-h-[220px] rounded-lg border border-border bg-background p-3 text-sm text-foreground/90 focus:outline-none focus:ring-2 focus:ring-primary/40"
                      value={ocrResult?.text ?? ''}
                      readOnly
                    />
                  </div>
                </>
              )}
                  </CardBody>
                </Card>

          {/* Gemini understanding section */}
                <Card>
                  <CardHeader>
              <h3 className="font-semibold text-foreground">Understand Label (Gemini)</h3>
                  </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'nutrition', label: 'Nutrition' },
                  { key: 'ingredients', label: 'Ingredients' },
                  { key: 'allergens', label: 'Allergens' },
                  { key: 'warnings', label: 'Warnings' },
                  { key: 'summary', label: 'Summary' },
                ].map((g) => (
                  <button
                    key={g.key}
                    type="button"
                    onClick={() => setUnderstandGoal(g.key as any)}
                    className={[
                      'px-3 py-1 rounded-full text-xs font-semibold border transition-colors',
                      understandGoal === (g.key as any)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted/30 text-foreground/70 border-border hover:bg-muted/50',
                    ].join(' ')}
                  >
                    {g.label}
                  </button>
                ))}
              </div>

              <Button
                variant="primary"
                className="w-full"
                onClick={handleUnderstandLabel}
                disabled={!ocrResult || understandLoading}
              >
                {understandLoading ? "Understanding…" : "Understand Label"}
              </Button>

              {understandError && (
                <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                  {understandError}
                </div>
              )}

              {understandResult && (
                    <div className="space-y-4">
                  <div className="bg-muted/20 border border-border rounded-lg p-4">
                    <p className="text-sm font-semibold text-foreground mb-2">Label Summary</p>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {parsedGemini?.human_summary ||
                        "Summary not available (showing raw output below)."}
                    </p>
                  </div>

                  {parsedGemini && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-muted/10 border border-border rounded-lg p-4">
                        <p className="text-xs text-foreground/60 mb-2">Basic info</p>
                        <div className="text-sm text-foreground/80 space-y-1">
                          <div><span className="font-semibold">Brand:</span> {parsedGemini.brand ?? "—"}</div>
                          <div><span className="font-semibold">Product:</span> {parsedGemini.product_name ?? "—"}</div>
                          <div><span className="font-semibold">Category:</span> {parsedGemini.category ?? "—"}</div>
                          <div><span className="font-semibold">FSSAI:</span> {parsedGemini.fssai_license ?? "—"}</div>
                          <div><span className="font-semibold">Net qty:</span> {parsedGemini.net_quantity ?? "—"}</div>
                        </div>
                      </div>

                      <div className="bg-muted/10 border border-border rounded-lg p-4">
                        <p className="text-xs text-foreground/60 mb-2">Warnings / Allergens</p>
                        <div className="text-sm text-foreground/80 space-y-2">
                          <div>
                            <span className="font-semibold">Allergens:</span>{" "}
                            {Array.isArray(parsedGemini.allergens)
                              ? parsedGemini.allergens.join(", ")
                              : "—"}
                          </div>
                          <div>
                            <span className="font-semibold">Warnings:</span>{" "}
                            {Array.isArray(parsedGemini.warnings)
                              ? parsedGemini.warnings.join("; ")
                              : "—"}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {Array.isArray(parsedGemini?.red_flags) && parsedGemini.red_flags.length > 0 && (
                    <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                      <p className="text-sm font-semibold text-destructive mb-2">Red Flags (Potentially Misleading)</p>
                      <ul className="space-y-2 text-sm text-foreground/80">
                        {parsedGemini.red_flags.slice(0, 8).map((rf: any, idx: number) => (
                          <li key={idx} className="bg-background/60 border border-border rounded-md p-3">
                            <p className="font-mono text-xs text-foreground/70 whitespace-pre-wrap">
                              “{String(rf?.text ?? "").trim()}”
                            </p>
                            <p className="mt-2 text-xs text-foreground/70">
                              <span className="font-semibold">Why flagged:</span> {String(rf?.reason ?? "—")}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {parsedGemini?.nutrition && (
                    <div className="bg-muted/10 border border-border rounded-lg p-4">
                      <p className="text-sm font-semibold text-foreground mb-2">Nutrition</p>
                      <p className="text-xs text-foreground/60 mb-3">
                        Serving size: {parsedGemini.nutrition?.serving_size ?? "—"}
                      </p>
                      {nutritionFlags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {nutritionFlags.map((f, idx) => (
                            <div
                              key={idx}
                              className={[
                                'px-3 py-1 rounded-full text-xs font-semibold border',
                                f.level === 'red'
                                  ? 'bg-destructive/10 text-destructive border-destructive/20'
                                  : f.level === 'amber'
                                    ? 'bg-amber-500/10 text-amber-700 border-amber-500/20'
                                    : 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
                              ].join(' ')}
                              title="Per 100g quick flag"
                            >
                              {f.title}: {f.detail}
                            </div>
                          ))}
                        </div>
                      )}

                      {pieData.length > 0 && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center mb-4">
                          <div className="lg:col-span-1 h-[220px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80}>
                                  {pieData.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip formatter={(value: any, name: any) => [`${value} g`, String(name)]} />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="lg:col-span-2 text-sm text-foreground/80">
                            <p className="font-semibold text-foreground mb-2">Per 100g macro split</p>
                            <ul className="space-y-1">
                              {pieData.map((p) => (
                                <li key={p.name} className="flex items-center justify-between gap-4">
                                  <span className="flex items-center gap-2">
                                    <span
                                      className="inline-block w-3 h-3 rounded-sm"
                                      style={{ backgroundColor: p.color }}
                                    />
                                    {p.name}
                                  </span>
                                  <span className="font-semibold">{p.value} g</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                        <div className="bg-background border border-border rounded-lg p-3">
                          <p className="text-xs text-foreground/60 mb-1">Sugar (per 100g)</p>
                          <p className="text-sm font-semibold text-foreground">
                            {per100gNums?.sugar_g ?? '—'} {per100gNums?.sugar_g != null ? 'g' : ''}
                          </p>
                        </div>
                        <div className="bg-background border border-border rounded-lg p-3">
                          <p className="text-xs text-foreground/60 mb-1">Sodium (per 100g)</p>
                          <p className="text-sm font-semibold text-foreground">
                            {per100gNums?.sodium_mg ?? '—'} {per100gNums?.sodium_mg != null ? 'mg' : ''}
                          </p>
                        </div>
                        <div className="bg-background border border-border rounded-lg p-3">
                          <p className="text-xs text-foreground/60 mb-1">Fat (per 100g)</p>
                          <p className="text-sm font-semibold text-foreground">
                            {per100gNums?.fat_g ?? '—'} {per100gNums?.fat_g != null ? 'g' : ''}
                          </p>
                        </div>
                      </div>

                      <div className="bg-background border border-border rounded-lg overflow-hidden">
                        <div className="px-4 py-3 border-b border-border">
                          <p className="text-sm font-semibold text-foreground">Nutrition Table</p>
                          <p className="text-xs text-foreground/60">
                            Values are OCR-derived; some fields may be unreliable if the label image is unclear.
                          </p>
                        </div>
                        <div className="overflow-auto">
                          <table className="w-full text-sm">
                            <thead className="text-xs text-foreground/60">
                              <tr className="border-b border-border">
                                <th className="text-left px-4 py-2 font-semibold">Nutrient</th>
                                <th className="text-left px-4 py-2 font-semibold">Per serving</th>
                                <th className="text-left px-4 py-2 font-semibold">Per 100g</th>
                              </tr>
                            </thead>
                            <tbody>
                              {nutritionRows.map((r) => {
                                const psBad = isClearlyCorrupted(r.perServing);
                                const p100Bad = isClearlyCorrupted(r.per100g);
                                return (
                                  <tr key={r.label} className="border-b border-border/60 last:border-0">
                                    <td className="px-4 py-2 font-semibold text-foreground">{r.label}</td>
                                    <td className="px-4 py-2">
                                      <span className={psBad ? 'text-foreground/40' : 'text-foreground/80'}>
                                        {psBad ? '—' : String(r.perServing)}
                                      </span>
                                    </td>
                                    <td className="px-4 py-2">
                                      <span className={p100Bad ? 'text-foreground/40' : 'text-foreground/80'}>
                                        {p100Bad ? '—' : String(r.per100g)}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Micronutrients (collapsed) */}
                      <details className="mt-4 bg-background border border-border rounded-lg p-4">
                        <summary className="cursor-pointer text-sm font-semibold text-foreground">
                          Show vitamins/minerals (if detected)
                        </summary>
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs font-semibold text-foreground/70 mb-2">Per serving</p>
                            <pre className="text-xs bg-muted/20 border border-border rounded-lg p-3 overflow-auto max-h-48">
{JSON.stringify(parsedGemini.nutrition?.per_serving ?? null, null, 2)}
                            </pre>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-foreground/70 mb-2">Per 100g</p>
                            <pre className="text-xs bg-muted/20 border border-border rounded-lg p-3 overflow-auto max-h-48">
{JSON.stringify(parsedGemini.nutrition?.per_100g ?? null, null, 2)}
                            </pre>
          </div>
        </div>
                      </details>
                    </div>
                  )}

                  {(Array.isArray(parsedGemini?.ingredients) || detectedAdditives.length > 0) && (
                    <div className="bg-muted/10 border border-border rounded-lg p-4">
                      <p className="text-sm font-semibold text-foreground mb-2">Ingredients & Additives</p>

                      {Array.isArray(parsedGemini?.ingredients) && parsedGemini.ingredients.length > 0 ? (
                        <div className="mb-4">
                          <p className="text-xs text-foreground/60 mb-2">Ingredients (parsed)</p>
                          <div className="flex flex-wrap gap-2">
                            {parsedGemini.ingredients.slice(0, 40).map((ing: string, idx: number) => (
                              <span
                                key={idx}
                                className="px-2 py-1 rounded-md bg-background border border-border text-xs text-foreground/80"
                              >
                                {ing}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-foreground/70 mb-3">Ingredients not detected reliably from OCR.</p>
                      )}

                      {detectedAdditives.length > 0 && (
                        <div>
                          <p className="text-xs text-foreground/60 mb-2">Detected additives (E/INS codes)</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {detectedAdditives.slice(0, 20).map((code) => {
                              const meta = additiveMap[code.toUpperCase()];
                              return (
                                <div
                                  key={code}
                                  className="flex items-start justify-between gap-3 bg-background border border-border rounded-lg p-3"
                                >
                                  <div>
                                    <p className="text-sm font-semibold text-foreground">{code}</p>
                                    <p className="text-xs text-foreground/70">
                                      {meta ? `${meta.name} • ${meta.type}` : 'Unknown (add mapping)'}
                                    </p>
                                  </div>
              </div>
                              );
                            })}
              </div>
            </div>
                      )}
                    </div>
                  )}

                  {(Array.isArray(parsedGemini?.claims) || Array.isArray(parsedGemini?.red_flags)) && (
                    <div className="bg-muted/10 border border-border rounded-lg p-4">
                      <p className="text-sm font-semibold text-foreground mb-2">Marketing Claim Check</p>
                      {Array.isArray(parsedGemini?.claims) && parsedGemini.claims.length > 0 ? (
                        <div className="mb-3">
                          <p className="text-xs text-foreground/60 mb-2">Detected claims</p>
                          <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1">
                            {parsedGemini.claims.slice(0, 10).map((c: string, idx: number) => (
                              <li key={idx}>{c}</li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <p className="text-sm text-foreground/70 mb-3">No explicit claims detected.</p>
                      )}

                      {Array.isArray(parsedGemini?.red_flags) && parsedGemini.red_flags.length > 0 && (
                        <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3">
                          <p className="text-sm font-semibold text-destructive mb-2">Highlighted disclaimers / red flags</p>
                          <ul className="space-y-2 text-sm text-foreground/80">
                            {parsedGemini.red_flags.slice(0, 6).map((rf: any, idx: number) => (
                              <li key={idx} className="bg-background/60 border border-border rounded-md p-3">
                                <p className="font-mono text-xs text-foreground/70 whitespace-pre-wrap">
                                  “{String(rf?.text ?? "").trim()}”
                                </p>
                                <p className="mt-2 text-xs text-foreground/70">
                                  <span className="font-semibold">Why flagged:</span> {String(rf?.reason ?? "—")}
                                </p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Raw JSON intentionally hidden from end-users */}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </Section>
    </div>
  );
}
