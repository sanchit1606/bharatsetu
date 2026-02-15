import React, { useState, useEffect, useRef } from "react";

type TocItem = {
  id: string;
  title: string;
  children?: TocItem[];
};

const TOC: TocItem[] = [
  {
    id: "intro",
    title: "Technical Documentation",
    children: [
      { id: "exec", title: "Executive Summary" },
    ],
  },
  {
    id: "1",
    title: "1. System Architecture",
    children: [
      {
        id: "1.1",
        title: "1.1 Technology Stack",
        children: [
          { id: "1.1.1", title: "Frontend" },
          { id: "1.1.2", title: "Backend" },
          { id: "1.1.3", title: "Data Storage" },
        ],
      },
      { id: "1.2", title: "1.2 Design Principles" },
    ],
  },
  {
    id: "2",
    title: "2. Feature 1: Product Label Auditor (Label Padhega India)",
    children: [
      { id: "2.1", title: "2.1 Problem Statement" },
      { id: "2.2", title: "2.2 Solution Overview" },
      {
        id: "2.3",
        title: "2.3 Technical Architecture",
        children: [
          { id: "2.3.1", title: "Processing Pipeline" },
          { id: "2.3.2", title: "Data Schema" },
          { id: "2.3.3", title: "Knowledge Base Structure" },
          { id: "2.3.4", title: "User Interaction Flow" },
        ],
      },
      { id: "2.4", title: "2.4 Data Storage" },
    ],
  },
  {
    id: "3",
    title: "3. Feature 2: CivicSense (Awareness & Reporting)",
    children: [
      { id: "3.1", title: "3.1 Problem Statement" },
      { id: "3.2", title: "3.2 Solution Overview" },
      {
        id: "3.3",
        title: "3.3 Technical Architecture",
        children: [
          { id: "3.3.1", title: "Processing Pipeline" },
          { id: "3.3.2", title: "Authority Database Structure" },
          { id: "3.3.3", title: "Submission Tiers" },
        ],
      },
      { id: "3.4", title: "3.4 Data Sources for Authority Database" },
      { id: "3.5", title: "3.5 Data Storage" },
    ],
  },
  {
    id: "4",
    title: "4. Feature 3: Document Jargon & Legal/Financial Rights Assistant",
    children: [
      { id: "4.1", title: "4.1 Problem Statement" },
      { id: "4.2", title: "4.2 Solution Overview" },
      {
        id: "4.3",
        title: "4.3 Technical Architecture",
        children: [
          { id: "4.3.1", title: "Components" },
          { id: "4.3.2", title: "Knowledge Base Structure" },
          { id: "4.3.3", title: "Query Processing Flow" },
        ],
      },
      { id: "4.4", title: "4.4 Data Sources" },
      { id: "4.5", title: "4.5 Data Storage" },
    ],
  },
  {
    id: "5",
    title: "5. Feature 4: Lab Report Analyzer",
    children: [
      { id: "5.1", title: "5.1 Problem Statement" },
      { id: "5.2", title: "5.2 Solution Scope" },
      {
        id: "5.3",
        title: "5.3 Technical Architecture",
        children: [
          { id: "5.3.1", title: "Processing Pipeline" },
          { id: "5.3.2", title: "Reference Ranges Database" },
          { id: "5.3.3", title: "User Interface Features" },
        ],
      },
      { id: "5.4", title: "5.4 Privacy and Safety" },
    ],
  },
  {
    id: "6",
    title: "6. Feature 5: GynaeCare Women's Health Module",
    children: [
      { id: "6.1", title: "6.1 Problem Statement" },
      { id: "6.2", title: "6.2 Solution Overview" },
      {
        id: "6.3",
        title: "6.3 Technical Architecture",
        children: [
          { id: "6.3.1", title: "Core Modules" },
          { id: "6.3.2", title: "RAG Implementation" },
          { id: "6.3.3", title: "Interactive Features" },
        ],
      },
      { id: "6.4", title: "6.4 Privacy and Safety" },
    ],
  },
  {
    id: "7",
    title: "7. Data Privacy and Security",
    children: [
      { id: "7.1", title: "7.1 Privacy-First Design" },
      {
        id: "7.2",
        title: "7.2 Data Classification",
        children: [
          { id: "7.2.1", title: "NOT Stored (High Risk Data)" },
          { id: "7.2.2", title: "Safe to Store (Anonymous/Aggregated)" },
        ],
      },
      { id: "7.3", title: "7.3 Security Measures" },
    ],
  },
  {
    id: "8",
    title: "8. Deployment Architecture",
    children: [
      {
        id: "8.1",
        title: "8.1 Infrastructure",
        children: [
          { id: "8.1.1", title: "Frontend Deployment" },
          { id: "8.1.2", title: "Backend Deployment" },
        ],
      },
      { id: "8.2", title: "8.2 Cost Analysis" },
    ],
  },
  { id: "9", title: "9. References" },
];

const InteractiveImageViewer = ({ src, alt = "User flow" }: { src: string; alt?: string }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const isPanningRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  const MIN_SCALE = 0.1;
  const MAX_SCALE = 5;
  const clamp = (v: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, v));

  // center image after load or when container resizes
  const centerImage = () => {
    const el = containerRef.current;
    const img = imgRef.current;
    if (!el || !img || !img.naturalWidth) return;
    const rect = el.getBoundingClientRect();
    const iw = img.naturalWidth * scale;
    const ih = img.naturalHeight * scale;
    setTranslate({ x: (rect.width - iw) / 2, y: (rect.height - ih) / 2 });
  };

  useEffect(() => {
    const onResize = () => centerImage();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale]);

  const onImgLoad = () => {
    centerImage();
  };

  // Wheel zoom keeping cursor point stable
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = -e.deltaY;
      const factor = delta > 0 ? 1.12 : 0.88;
      const prevScale = scale;
      const newScale = clamp(prevScale * factor);
      const rect = el.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;
      // image coordinate under cursor (before zoom)
      const imgCoordX = (cursorX - translate.x) / prevScale;
      const imgCoordY = (cursorY - translate.y) / prevScale;
      // new translate so that imgCoord maps to same cursor position
      const newTx = cursorX - imgCoordX * newScale;
      const newTy = cursorY - imgCoordY * newScale;
      setScale(newScale);
      setTranslate({ x: newTx, y: newTy });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [scale, translate]);

  const onPointerDown = (e: any) => {
    const el = containerRef.current;
    if (!el) return;
    try { el.setPointerCapture?.(e.pointerId); } catch {}
    isPanningRef.current = true;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
    if (el) el.style.cursor = "grabbing";
  };

  const onPointerMove = (e: any) => {
    if (!isPanningRef.current || !lastPosRef.current) return;
    const dx = e.clientX - lastPosRef.current.x;
    const dy = e.clientY - lastPosRef.current.y;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
    setTranslate((t) => ({ x: t.x + dx, y: t.y + dy }));
  };

  const onPointerUp = (e: any) => {
    const el = containerRef.current;
    try { el?.releasePointerCapture?.(e.pointerId); } catch {}
    isPanningRef.current = false;
    lastPosRef.current = null;
    if (el) el.style.cursor = "grab";
  };

  const zoomAtCenter = (factor: number) => {
    const el = containerRef.current;
    if (!el) {
      setScale((s) => clamp(s * factor));
      return;
    }
    const rect = el.getBoundingClientRect();
    const center = { x: rect.width / 2, y: rect.height / 2 };
    // reuse wheel math by computing image coord under center
    const prevScale = scale;
    const newScale = clamp(prevScale * factor);
    const imgCoordX = (center.x - translate.x) / prevScale;
    const imgCoordY = (center.y - translate.y) / prevScale;
    const newTx = center.x - imgCoordX * newScale;
    const newTy = center.y - imgCoordY * newScale;
    setScale(newScale);
    setTranslate({ x: newTx, y: newTy });
  };

  const fitToContainer = () => {
    const el = containerRef.current;
    const img = imgRef.current;
    if (!el || !img || !img.naturalWidth) return;
    const rect = el.getBoundingClientRect();
    const scaleToFit = clamp(Math.min(rect.width / img.naturalWidth, rect.height / img.naturalHeight) * 0.95);
    const iw = img.naturalWidth * scaleToFit;
    const ih = img.naturalHeight * scaleToFit;
    const tx = (rect.width - iw) / 2;
    const ty = (rect.height - ih) / 2;
    setScale(scaleToFit);
    setTranslate({ x: tx, y: ty });
  };

  const reset = () => {
    fitToContainer();
  };

  return (
    <div className="relative my-6">
      <div className="absolute right-2 top-2 z-20 flex space-x-2 items-center">
        <button onClick={() => zoomAtCenter(1.2)} className="px-2 py-1 bg-card border rounded">Zoom +</button>
        <button onClick={() => zoomAtCenter(0.8)} className="px-2 py-1 bg-card border rounded">Zoom −</button>
        <button onClick={fitToContainer} className="px-2 py-1 bg-card border rounded">Fit</button>
        <button onClick={reset} className="px-2 py-1 bg-card border rounded">Reset</button>
      </div>
      <div
        ref={containerRef}
        className="w-full h-[640px] bg-muted/5 rounded overflow-hidden relative"
        style={{ touchAction: "none", cursor: "grab" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          draggable={false}
          onLoad={onImgLoad}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
            transformOrigin: "0 0",
            transition: isPanningRef.current ? "none" : "transform 120ms ease-out",
            userSelect: "none",
            touchAction: "none",
            display: "block",
            maxWidth: "none",
            height: "auto",
            willChange: "transform",
          }}
        />
      </div>
      <div className="flex items-center justify-between mt-2">
        <p className="text-sm text-foreground/60">Use mouse wheel or the buttons to zoom. Click and drag to pan (grab to move up/down).</p>
        <div className="flex items-center space-x-2">
          <label className="text-xs">Zoom</label>
          <input
            type="range"
            min={MIN_SCALE}
            max={MAX_SCALE}
            step={0.01}
            value={scale}
            onChange={(e) => {
              const newS = clamp(Number(e.target.value));
              setScale(newS);
            }}
            className="w-40"
          />
        </div>
      </div>
    </div>
  );
};

export default function Technical() {
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setOpen((s) => ({ ...s, [id]: !s[id] }));
  };

  const scrollTo = (id: string, hasChildren: boolean) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      try { history.replaceState(null, "", `#${id}`); } catch {}
    }
    if (hasChildren) toggle(id);
  };

  const renderToc = (items: TocItem[], level = 0) => {
    return (
      <ul className={`${level === 0 ? "" : "pl-4"}`}>
        {items.map((it) => {
          const hasChildren = it.children && it.children.length > 0;
          return (
            <li key={it.id}>
              <div className="flex items-center">
                <button
                  onClick={() => scrollTo(it.id, !!hasChildren)}
                  className={`flex-1 text-left py-1 px-2 rounded-md hover:bg-muted transition-colors ${level === 0 ? "font-semibold" : "text-sm"}`}
                >
                  <span className="block">{it.title}</span>
                </button>
                {hasChildren && (
                  <button onClick={() => toggle(it.id)} className="ml-2 text-sm text-foreground/60 hover:text-foreground">
                    {open[it.id] ? "−" : "+"}
                  </button>
                )}
              </div>
              {hasChildren && open[it.id] && renderToc(it.children!, level + 1)}
            </li>
          );
        })}
      </ul>
    );
  };

  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return;
      }
      // Fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = text;
      // Prevent scrolling to bottom
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    } catch (e) {
      // ignore
    }
  };
  const [copied, setCopied] = useState<string | null>(null);

  const copyWithFeedback = async (id: string, text: string) => {
    await copyToClipboard(text);
    setCopied(id);
    window.setTimeout(() => setCopied(null), 2000);
  };

  useEffect(() => {
    const container = document.querySelector("section.prose");
    if (!container) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const btn = target.closest("button");
      if (!btn) return;
      // identify copy buttons by layout classes
      if (!(btn.classList.contains("absolute") && btn.classList.contains("right-2"))) return;
      // attempt to find the next <pre> sibling
      const pre = btn.nextElementSibling as HTMLElement | null;
      if (pre && pre.tagName.toLowerCase() === "pre") {
        const text = pre.innerText;
        copyToClipboard(text);
        const prev = btn.innerText;
        btn.innerText = "Copied";
        setTimeout(() => {
          btn.innerText = prev;
        }, 1800);
      }
    };
    container.addEventListener("click", handler);
    return () => container.removeEventListener("click", handler);
  }, []);

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="container-main py-8 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        <aside className="sticky top-20 max-h-[75vh] overflow-auto rounded-md border border-border bg-card p-4 text-sm">
          <h3 className="text-lg font-bold mb-3">Table of Contents</h3>
          <nav>{renderToc(TOC)}</nav>
        </aside>

        <section className="prose prose-invert max-w-none">
          <style>{`
            pre {
              background: #f3f4f6;
              color: #0f172a;
              padding: 0.75rem;
              border-radius: 0.375rem;
              overflow: auto;
            }
            pre code {
              background: transparent;
              color: inherit;
            }
          `}</style>
          <header id="intro" className="text-center max-w-3xl mx-auto py-12">
            <h1 id="brand" className="text-4xl sm:text-5xl font-extrabold mb-3">BharatSetu</h1>
            <h2 id="technical" className="text-xl sm:text-2xl font-semibold mb-2 text-primary">Technical Documentation</h2>
            <p id="connecting" className="text-base sm:text-lg text-foreground/70 mb-1">Connecting Communities to Information, Resources & Public Services</p>
            <p id="tagline" className="text-sm sm:text-base text-foreground/60 italic">AI-Powered Citizen Empowerment Platform</p>
          </header>

          <div className="max-w-4xl mx-auto">
            <h2 id="exec" className="mb-6">Executive Summary</h2>
            <p>BharatSetu is an AI-driven suite of tools designed to empower Indian citizens with accessible information and public services. The platform addresses critical gaps in health literacy, civic awareness, legal rights, and women's health education through five core features, all powered by advanced natural language processing and computer vision technologies.</p>
            <p className="mt-4">The platform leverages Google Gemini 1.5 Flash as the primary language model, with Groq (Llama 3.1) as a fallback, ensuring high-quality, multilingual responses while maintaining zero-cost operation within free tier limits. All features are built with a React frontend and FastAPI backend, deployable on free hosting services.</p>

            <h2 id="1" className="mt-8 mb-4">1. System Architecture</h2>
            <h3 id="1.1" className="mt-4 mb-2">1.1 Technology Stack</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Frontend table */}
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                <table className="w-full text-sm table-auto border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left pb-2">Frontend</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-1"><strong>Framework:</strong> React.js</td>
                    </tr>
                    <tr className="bg-muted/5">
                      <td className="py-1"><strong>Visualization:</strong> Recharts / Chart.js</td>
                    </tr>
                    <tr>
                      <td className="py-1"><strong>OCR:</strong> Tesseract.js (client-side)</td>
                    </tr>
                    <tr className="bg-muted/5">
                      <td className="py-1"><strong>Speech Recognition:</strong> Web Speech API</td>
                    </tr>
                    <tr>
                      <td className="py-1"><strong>Deployment:</strong> Vercel (free tier)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Backend table */}
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                <table className="w-full text-sm table-auto border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left pb-2">Backend</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-1"><strong>Framework:</strong> FastAPI (Python)</td>
                    </tr>
                    <tr className="bg-muted/5">
                      <td className="py-1"><strong>Primary LLM:</strong> Google Gemini 1.5 Flash</td>
                    </tr>
                    <tr>
                      <td className="py-1"><strong>Fallback LLM:</strong> Groq (Llama 3.1 70B)</td>
                    </tr>
                    <tr className="bg-muted/5">
                      <td className="py-1"><strong>OCR Fallback:</strong> Google Cloud Vision API</td>
                    </tr>
                    <tr>
                      <td className="py-1"><strong>Translation:</strong> Google Translate API</td>
                    </tr>
                    <tr className="bg-muted/5">
                      <td className="py-1"><strong>Deployment:</strong> Render.com (free tier)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Data Storage table */}
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                <table className="w-full text-sm table-auto border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left pb-2">Data Storage</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-1"><strong>Static KB:</strong> JSON files (in-memory)</td>
                    </tr>
                    <tr className="bg-muted/5">
                      <td className="py-1"><strong>Vector DB:</strong> ChromaDB (local, in-memory)</td>
                    </tr>
                    <tr>
                      <td className="py-1"><strong>Optional Session:</strong> Firebase Firestore</td>
                    </tr>
                    <tr className="bg-muted/5">
                      <td className="py-1"><strong>File Storage:</strong> Cloudinary (25 GB free)</td>
                    </tr>
                    <tr>
                      <td className="py-1"><strong>Embedding Model:</strong> all-MiniLM-L6-v2</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <h3 id="1.2" className="mt-6">1.2 Design Principles</h3>
            <ul className="ml-6 list-disc space-y-1">
              <li><strong>Privacy-First:</strong> Minimal to zero data retention for sensitive features</li>
              <li><strong>Multilingual:</strong> Support for Hindi, English, and regional languages</li>
              <li><strong>Accessibility:</strong> Voice input/output for low-literacy users</li>
              <li><strong>Cost-Effective:</strong> Entire system operates within free tier limits</li>
              <li><strong>Responsible AI:</strong> Clear disclaimers and limitations, especially for health features</li>
            </ul>

            <h3 id="1.3" className="mt-6">1.3 User flow diagram</h3>
            <div className="max-w-4xl mx-auto">
              <InteractiveImageViewer src="/USER-FLOW-FINAL.svg" alt="User flow diagram" />
            </div>

            <h2 id="2" className="mt-8">2. Feature 1: Product Label Auditor (Label Padhega India)</h2>
            <h3 id="2.1" className="mt-4">2.1 Problem Statement</h3>
            <p>Studies indicate that approximately 90% of Indian consumers read product labels, but only 33% check nutrition facts or ingredients [1]. This poor label literacy contributes to unhealthy diets, which now account for 56% of India's disease burden [2]. Non-communicable diseases (NCDs) cause 6 million deaths annually (63% of all deaths in India) [3].</p>

            <h3 id="2.2" className="mt-4">2.2 Solution Overview</h3>
            <p>The Product Label Auditor uses AI to translate complex product labels into simple, personalized health guidance. Users photograph food or cosmetic labels, and the system extracts text via OCR, cross-checks nutritional values against FSSAI and WHO standards, and generates plain-language summaries with health alerts.</p>

            <h3 id="2.3" className="mt-4">2.3 Technical Architecture</h3>
            <h4 id="2.3.1" className="mt-3">Processing Pipeline</h4>
            <ol className="ml-6 list-decimal space-y-1">
              <li>Image uploaded by user</li>
              <li>Tesseract.js extracts text (client-side)</li>
              <li>Gemini Flash structures data into JSON schema</li>
              <li>System compares values against FSSAI knowledge base</li>
              <li>Gemini generates personalized analysis based on user health context</li>
              <li>Frontend displays results with visualizations</li>
            </ol>

            <h4 id="2.3.2" className="mt-3">Data Schema</h4>
            <div className="relative">
              <button onClick={() => copyToClipboard(`{\n  "product_name": "",\n  "ingredients": [],\n  "nutrition_per_100g": {},\n  "additives": [],\n  "claims": []\n}`)} className="absolute right-2 top-2 text-xs px-2 py-1 border rounded">Copy</button>
              <pre className="ml-6"><code>{`{
  "product_name": "",
  "ingredients": [],
  "nutrition_per_100g": {},
  "additives": [],
  "claims": []
}`}</code></pre>
            </div>

            <h4 id="2.3.3" className="mt-4">Knowledge Base Structure</h4>
            <div className="relative">
              <button onClick={() => copyToClipboard(`{\n  "sugar_daily_limit": "50g",\n  "sodium_limit": "2300mg",\n  "trans_fat_limit": "0g",\n  "saturated_fat_limit": "20g"\n}`)} className="absolute right-2 top-2 text-xs px-2 py-1 border rounded">Copy</button>
              <pre className="ml-6"><code>{`{
  "sugar_daily_limit": "50g",
  "sodium_limit": "2300mg",
  "trans_fat_limit": "0g",
  "saturated_fat_limit": "20g"
}`}</code></pre>
            </div>

            <h4 id="2.3.4" className="mt-4">User Interaction Flow</h4>
            <ol className="ml-6 list-decimal space-y-1">
              <li>User inputs health condition via text or voice (e.g., diabetes, hypertension)</li>
              <li>User uploads product label image</li>
              <li>System processes and generates personalized analysis</li>
              <li>
                Results displayed as:
                <ul className="ml-6 list-disc space-y-1">
                  <li>Text/audio output in user's preferred language</li>
                  <li>Bar charts showing nutritional content per 100g</li>
                  <li>Highlighted flags for health concerns or false claims</li>
                  <li>Educational videos about misleading products (optional section)</li>
                </ul>
              </li>
            </ol>

            <h3 id="2.4" className="mt-6">2.4 Data Storage</h3>
            <ul className="ml-6 list-disc space-y-1">
              <li>Anonymous analysis history (no personally identifiable information)</li>
              <li>Aggregate statistics for product categories</li>
              <li>User preference settings (language, health conditions)</li>
            </ul>
            <p className="mt-2"><strong>Cloudinary (25 GB free)</strong> for temporary image storage with automatic deletion after analysis.</p>

            <h2 id="3" className="mt-8">3. Feature 2: CivicSense (Awareness & Reporting)</h2>
            <h3 id="3.1" className="mt-4">3.1 Problem Statement</h3>
            <p>Despite infrastructure initiatives like Swachh Bharat Mission, approximately 157 million Indians (11% of the population) still practiced open defecation as of 2022 [4]. Civic issues such as littering, waste dumping, and public space neglect persist due to lack of awareness and accessible reporting mechanisms.</p>

            <h3 id="3.2" className="mt-4">3.2 Solution Overview</h3>
            <p>CivicSense empowers citizens to report civic issues through an intelligent complaint routing system. The platform identifies the issue type, determines the appropriate authority, drafts professional complaints, and provides multiple submission channels without requiring complex navigation of government portals.</p>

            <h3 id="3.3" className="mt-4">3.3 Technical Architecture</h3>
            <h4 id="3.3.1" className="mt-3">Processing Pipeline</h4>
            <ol className="ml-6 list-decimal space-y-1">
              <li><strong>User Input:</strong> Text/voice complaint with optional image/video proof</li>
              <li><strong>Language Detection:</strong> Automatic detection of Hindi, English, or regional language</li>
              <li><strong>Issue Extraction:</strong> Gemini Flash identifies issue type and urgency level</li>
              <li><strong>Authority Resolution:</strong> Maps location + issue type to appropriate department</li>
              <li><strong>Complaint Formatting:</strong> Generates professional complaint message with all details</li>
              <li><strong>Multi-Channel Presentation:</strong> Shows user available submission options</li>
            </ol>

            <h4 id="3.3.2" className="mt-4">Authority Database Structure</h4>
            <div className="relative">
              <button onClick={() => copyToClipboard(`{
  "maharashtra": {
    "pune": {
      "garbage_disposal": {
        "authority": "PMC Solid Waste Management",
        "channels": {
          "whatsapp": "+91-20-XXXX-XXXX",
          "web_portal": "https://portal.punecorporation.org",
          "email": "swm.pmc@punecorporation.org",
          "phone": "020-26123456"
        },
        "expected_response_time": "48 hours",
        "escalation": {
          "if_no_response": "Commissioner Office",
          "contact": "commissioner@pmc.gov.in"
        }
      }
    }
  }
}`)} className="absolute right-2 top-2 text-xs px-2 py-1 border rounded">Copy</button>
              <pre className="ml-6"><code>{`{
  "maharashtra": {
    "pune": {
      "garbage_disposal": {
        "authority": "PMC Solid Waste Management",
        "channels": {
          "whatsapp": "+91-20-XXXX-XXXX",
          "web_portal": "https://portal.punecorporation.org",
          "email": "swm.pmc@punecorporation.org",
          "phone": "020-26123456"
        },
        "expected_response_time": "48 hours",
        "escalation": {
          "if_no_response": "Commissioner Office",
          "contact": "commissioner@pmc.gov.in"
        }
      }
    }
  }
}`}</code></pre>
            </div>

            <h4 id="3.3.3" className="mt-4">Submission Tiers</h4>
            <ul className="ml-6 list-disc space-y-1">
              <li><strong>Tier 1 - Direct Channels (User sends directly):</strong>
                <ul className="ml-6 list-disc">
                  <li>WhatsApp: Pre-filled message with proof attached</li>
                  <li>Email: Formatted email with subject and attachments</li>
                  <li>SMS: Short summary for toll-free numbers</li>
                </ul>
              </li>
              <li><strong>Tier 2 - Semi-Automated:</strong>
                <ul className="ml-6 list-disc">
                  <li>Pre-filled web portal links with query parameters</li>
                  <li>User clicks to open form with data pre-populated</li>
                </ul>
              </li>
              <li><strong>Tier 3 - Manual Information:</strong>
                <ul className="ml-6 list-disc">
                  <li>Contact information displayed (phone, office address)</li>
                  <li>Mobile app download links</li>
                  <li>Office visit hours and location</li>
                </ul>
              </li>
            </ul>

            <h3 id="3.4" className="mt-6">3.4 Data Sources for Authority Database</h3>
            <ul className="ml-6 list-disc space-y-1">
              <li>Government websites: punecorporation.org, maharashtra.gov.in/grievances</li>
              <li>Swachhata App: National cleanliness grievance platform</li>
              <li>CPGRAMS: Central Public Grievance Redress System</li>
              <li>State CM Helpline numbers</li>
              <li>Manual verification through municipal corporation contacts</li>
            </ul>

            <h3 id="3.5" className="mt-6">3.5 Data Storage</h3>
            <ul className="ml-6 list-disc space-y-1">
              <li>Anonymous complaint history (no personal identification)</li>
              <li>Complaint status tracking</li>
              <li>Aggregate statistics for heat map visualization</li>
            </ul>

            <h2 id="4" className="mt-8">4. Feature 3: Document Jargon & Legal/Financial Rights Assistant</h2>

            <h3 id="4.1" className="mt-4">4.1 Problem Statement</h3>
            <p>A majority of Indians are not aware of their fundamental and legal rights, leading to repeated rights violations [5]. Complex legal language, fee barriers, and bureaucratic jargon prevent citizens from claiming entitlements. Low-income groups often sign unjust contracts due to ignorance of legal protections.</p>

            <h3 id="4.2" className="mt-4">4.2 Solution Overview</h3>
            <p>This assistant interprets laws and rights in conversational terms, simplifies government documents, and provides step-by-step guidance for claiming entitlements. Users can upload documents for automatic simplification or ask questions about their rights.</p>

            <h3 id="4.3" className="mt-4">4.3 Technical Architecture</h3>
            <h4 id="4.3.1" className="mt-3">Components</h4>
            <ul className="ml-6 list-disc space-y-1">
              <li><strong>OCR:</strong> Tesseract.js for document text extraction</li>
              <li><strong>Simplification:</strong> Gemini Flash for plain-language rewriting</li>
              <li><strong>Legal Knowledge Base:</strong> Curated FAQ database (50-100 common scenarios)</li>
              <li><strong>RAG System:</strong> ChromaDB with legal document embeddings</li>
              <li><strong>Translation:</strong> Google Translate API for regional language support</li>
            </ul>

            <h4 id="4.3.2" className="mt-3">Knowledge Base Structure</h4>
            <p><strong>Static legal FAQ database (Type 1 - JSON file):</strong></p>
            <div className="relative">
              <button onClick={() => copyToClipboard(`{
  "tenant_rights": {
    "question": "Can landlord increase rent without notice?",
    "answer": "No. Under Model Tenancy Act 2021...",
    "source": "Model Tenancy Act 2021, Section 7",
    "category": "housing",
    "hindi_answer": "नहीं। मॉडल टेनेंसी एक्ट..."
  }
}`)} className="absolute right-2 top-2 text-xs px-2 py-1 border rounded">Copy</button>
              <pre className="ml-6"><code>{`{
  "tenant_rights": {
    "question": "Can landlord increase rent without notice?",
    "answer": "No. Under Model Tenancy Act 2021...",
    "source": "Model Tenancy Act 2021, Section 7",
    "category": "housing",
    "hindi_answer": "नहीं। मॉडल टेनेंसी एक्ट..."
  }
}`}</code></pre>
            </div>

            <p className="mt-3"><strong>Vector embeddings database (Type 2 - ChromaDB):</strong></p>
            <ul className="ml-6 list-disc space-y-1">
              <li>Legal document chunks from IndiaCode.nic.in</li>
              <li>Embeddings generated using all-MiniLM-L6-v2</li>
              <li>Metadata includes source, act name, section numbers</li>
            </ul>

            <h4 id="4.3.3" className="mt-3">Query Processing Flow</h4>
            <ol className="ml-6 list-decimal space-y-1">
              <li>User question received (text or voice)</li>
              <li>Fuzzy matching against FAQ database using FuzzyWuzzy</li>
              <li>If no match: RAG search through legal documents</li>
              <li>Gemini Flash generates plain-language answer</li>
              <li>Source citation added (act name, section)</li>
              <li>Translation to user's preferred language</li>
            </ol>

            <h3 id="4.4" className="mt-6">4.4 Data Sources</h3>
            <ul className="ml-6 list-disc space-y-1">
              <li>IndiaCode.nic.in: Government legal database</li>
              <li>DistrictCourtsOfIndia.nic.in: Court judgments and procedures</li>
              <li>LegalServicesIndia.com: Curated articles</li>
              <li>Manual curation of 50-100 common legal scenarios</li>
            </ul>

            <h3 id="4.5" className="mt-6">4.5 Data Storage</h3>
            <ul className="ml-6 list-disc space-y-1">
              <li><strong>Legal KB:</strong> JSON file (5-10 MB) loaded in-memory</li>
              <li><strong>Vector Database:</strong> ChromaDB local persistence (50-100 MB)</li>
              <li><strong>User uploads:</strong> Cloudinary temporary storage, auto-deleted post-processing</li>
              <li><strong>Session data:</strong> Firebase Firestore (optional, anonymous)</li>
            </ul>

            <hr className="my-6" />

            <h2 id="5" className="mt-6">5. Feature 4: Lab Report Analyzer</h2>
            <h3 id="5.1" className="mt-4">5.1 Problem Statement</h3>
            <p>Research shows only 39% of patients can correctly identify from a standard pathology report whether they have cancer [6]. Patients routinely receive complex lab reports without adequate explanation, leading to anxiety and poor follow-through on health recommendations.</p>

            <h3 id="5.2" className="mt-4">5.2 Solution Scope</h3>
            <p><strong>Important Limitation:</strong></p>
            <p>This is an educational tool for value comparison only. It does NOT diagnose conditions, provide medical advice, or replace doctor consultation. The system compares lab values against standard reference ranges and suggests general wellness approaches.</p>

            <h3 id="5.3" className="mt-4">5.3 Technical Architecture</h3>
            <h4 id="5.3.1" className="mt-3">Processing Pipeline</h4>
            <ol className="ml-6 list-decimal space-y-1">
              <li><strong>User Input:</strong> Lab report (PDF/DOC/image) + age + gender + optional conditions</li>
              <li><strong>OCR Extraction:</strong> Tesseract.js (client-side) with Google Cloud Vision fallback</li>
              <li><strong>Value Parsing:</strong> Gemini Flash structures data into JSON</li>
              <li><strong>Reference Comparison:</strong> Match values against WHO/ICMR standards by age/gender</li>
              <li><strong>Diet Suggestions:</strong> Gemini generates general wellness recommendations</li>
              <li><strong>Visualization:</strong> React displays bar charts with color-coded ranges</li>
            </ol>

            <h4 id="5.3.2" className="mt-3">Reference Ranges Database</h4>
            <div className="relative">
              <button onClick={() => copyToClipboard(`{
  "hemoglobin": {
    "male": {
      "age_18_50": {"min": 13.5, "max": 17.5, "unit": "g/dL"}
    },
    "female": {
      "age_18_50": {"min": 12.0, "max": 15.5, "unit": "g/dL"}
    }
  },
  "glucose_fasting": {
    "all": {
      "normal": {"min": 70, "max": 100, "unit": "mg/dL"},
      "prediabetes_warning": {"min": 100, "max": 125},
      "consult_doctor": {"min": 126}
    }
  }
}`)} className="absolute right-2 top-2 text-xs px-2 py-1 border rounded">Copy</button>
              <pre className="ml-6"><code>{`{
  "hemoglobin": {
    "male": {
      "age_18_50": {"min": 13.5, "max": 17.5, "unit": "g/dL"}
    },
    "female": {
      "age_18_50": {"min": 12.0, "max": 15.5, "unit": "g/dL"}
    }
  },
  "glucose_fasting": {
    "all": {
      "normal": {"min": 70, "max": 100, "unit": "mg/dL"},
      "prediabetes_warning": {"min": 100, "max": 125},
      "consult_doctor": {"min": 126}
    }
  }
}`}</code></pre>
            </div>

            <h4 id="5.3.3" className="mt-4">User Interface Features</h4>
            <ul className="ml-6 list-disc space-y-1">
              <li>Mandatory disclaimer popup before feature access</li>
              <li>OCR verification step (user confirms extracted values)</li>
              <li>Visual comparison charts (your value vs. healthy range)</li>
              <li>Color coding: Green (normal), Yellow (borderline), Red (outside range)</li>
              <li>India-specific diet suggestions (palak, dal, amla, etc.)</li>
              <li>Prominent disclaimers throughout interface</li>
              <li>Downloadable summary PDF (saved locally, not on server)</li>
            </ul>

            <h3 id="5.4" className="mt-6">5.4 Privacy and Safety</h3>
            <p><strong>Data Storage: ZERO</strong></p>
            <ul className="ml-6 list-disc space-y-1">
              <li>All processing in-memory</li>
              <li>No retention of lab reports, values, or personal information</li>
              <li>Session data deleted when tab closes</li>
              <li>Anonymous usage statistics only (test categories, not values)</li>
            </ul>
            <p className="mt-2"><strong>Safety Measures:</strong></p>
            <ul className="ml-6 list-disc space-y-1">
              <li>Rate limiting: 5 reports per hour per device</li>
              <li>File validation: PDF/JPG/PNG only, max 10 MB</li>
              <li>Emergency detection: Flags critical values with urgent warning</li>
              <li>Mandatory Terms of Service acceptance before use</li>
            </ul>

            <hr className="my-6" />

            <h2 id="6" className="mt-6">6. Feature 5: GynaeCare Women's Health Module</h2>
            <h3 id="6.1" className="mt-4">6.1 Problem Statement</h3>
            <p>A systematic review found only 48% of adolescent girls in India knew about menstruation before their first period [7]. Cultural taboos and lack of education persist. Regarding PCOS, which affects 6-13% of women globally (up to 20% in India), approximately 45% of affected women knew nothing about the condition even after multiple doctor visits [8].</p>

            <h3 id="6.2" className="mt-4">6.2 Solution Overview</h3>
            <p>GynaeCare provides stigma-free, verified information about menstrual health, PCOS, pregnancy basics, and general wellness through an anonymous chatbot interface. The system uses retrieval-augmented generation (RAG) to provide accurate answers sourced from WHO, UNICEF, and NHS materials.</p>

            <h3 id="6.3" className="mt-4">6.3 Technical Architecture</h3>
            <h4 id="6.3.1" className="mt-3">Core Modules</h4>
            <ol className="ml-6 list-decimal space-y-1">
              <li><strong>Menstrual Health Education:</strong> Cycle explanation, hygiene products, myth-busting</li>
              <li><strong>PCOS Awareness:</strong> Symptoms checklist, lifestyle management, when to seek help</li>
              <li><strong>Pregnancy Basics:</strong> Trimester changes, nutrition, warning signs</li>
              <li><strong>General Wellness:</strong> Breast health, mental health, contraception basics</li>
            </ol>

            <h4 id="6.3.2" className="mt-3">RAG Implementation</h4>
            <p><strong>Knowledge Base Creation:</strong></p>
            <ul className="ml-6 list-disc space-y-1">
              <li>Curated content from WHO, UNICEF, NHS, National Health Mission India</li>
              <li>JSON format with English and Hindi translations</li>
              <li>Size: 20-50 MB comprehensive knowledge base</li>
              <li>Embedded using all-MiniLM-L6-v2 (local model)</li>
              <li>Stored in ChromaDB (in-memory)</li>
            </ul>

            <p><strong>Conversation Flow:</strong></p>
            <ol className="ml-6 list-decimal space-y-1">
              <li>User asks question (text or voice, Hindi/English)</li>
              <li>Query embedded and searched in vector database</li>
              <li>Top 3 relevant knowledge chunks retrieved</li>
              <li>Gemini Flash generates empathetic response using context</li>
              <li>Response includes disclaimer to consult doctor for medical concerns</li>
              <li>Emergency keywords trigger immediate warning messages</li>
            </ol>

            <h4 id="6.3.3" className="mt-3">Interactive Features</h4>
            <ul className="ml-6 list-disc space-y-1">
              <li><strong>Myth Buster Quiz:</strong> Swipeable cards with instant explanations</li>
              <li><strong>PCOS Symptom Checker:</strong> Checkbox interface with personalized suggestions</li>
              <li><strong>Period Tracker:</strong> Calendar with cycle predictions (100% local storage)</li>
              <li><strong>Resource Library:</strong> Curated articles, videos, infographics</li>
            </ul>

            <h3 id="6.4" className="mt-6">6.4 Privacy and Safety</h3>
            <p><strong>Data Storage: ZERO permanent storage</strong></p>
            <ul className="ml-6 list-disc space-y-1">
              <li>No user identification (anonymous chat)</li>
              <li>Questions not logged or saved</li>
              <li>Period tracker data stored in browser localStorage only</li>
              <li>Optional 24-hour anonymous session cache (conversation count only)</li>
            </ul>

            <p className="mt-2"><strong>Content Safety:</strong></p>
            <ul className="ml-6 list-disc space-y-1">
              <li>Age-appropriate responses (10-14, 15-25, 25-40 age groups)</li>
              <li>Blocked keywords: abortion pills, sex determination (illegal in India)</li>
              <li>Emergency detection for severe symptoms</li>
              <li>Helpline numbers provided: Medical (108), Women's Helpline (181), Mental Health (1860-2662-345)</li>
            </ul>

            <hr className="my-6" />

            <h2 id="7" className="mt-6">7. Data Privacy and Security</h2>
            <h3 id="7.1" className="mt-4">7.1 Privacy-First Design</h3>
            <p>BharatSetu implements strict data minimization principles, particularly for health-related features. In compliance with India's Digital Personal Data Protection Act (DPDP) 2023, the platform classifies health data as sensitive personal data requiring enhanced protection.</p>

            <h3 id="7.2" className="mt-4">7.2 Data Classification</h3>
            <h4 id="7.2.1" className="mt-2">NOT Stored (High Risk Data)</h4>
            <ul className="ml-6 list-disc space-y-1">
              <li>Raw lab reports, medical images, or health documents</li>
              <li>Personally identifiable health information (PHI)</li>
              <li>User conversations from GynaeCare module</li>
              <li>Exact lab values or test results</li>
              <li>Legal documents with personal information</li>
            </ul>

            <h4 id="7.2.2" className="mt-2">Safe to Store (Anonymous/Aggregated)</h4>
            <ul className="ml-6 list-disc space-y-1">
              <li>Anonymous session data (no names, phone numbers, or identifiers)</li>
              <li>Aggregate statistics (e.g., "1000 glucose tests analyzed today")</li>
              <li>Feature usage metrics for platform improvement</li>
              <li>Voluntary user feedback (anonymized)</li>
              <li>Language preferences and UI settings</li>
            </ul>

            <h3 id="7.3" className="mt-4">7.3 Security Measures</h3>
            <ul className="ml-6 list-disc space-y-1">
              <li>Rate limiting on all endpoints (prevents abuse)</li>
              <li>Input validation and sanitization (prevents injection attacks)</li>
              <li>File type validation (accepts only documented formats)</li>
              <li>Automatic data expiry (24-hour maximum for any temporary storage)</li>
              <li>No login requirement (reduces attack surface)</li>
              <li>Client-side processing where possible (Tesseract.js OCR)</li>
            </ul>

            <hr className="my-6" />

            <h2 id="8" className="mt-6">8. Deployment Architecture</h2>
            <h3 id="8.1" className="mt-4">8.1 Infrastructure</h3>
            <h4 id="8.1.1" className="mt-2">Frontend Deployment</h4>
            <ul className="ml-6 list-disc space-y-1">
              <li><strong>Platform:</strong> Vercel (free tier)</li>
              <li><strong>Features:</strong> Automatic HTTPS, global CDN, continuous deployment</li>
              <li><strong>Build:</strong> React production build with code splitting</li>
              <li><strong>Limits:</strong> Unlimited bandwidth, 100 GB/month asset serving</li>
            </ul>

            <h4 id="8.1.2" className="mt-2">Backend Deployment</h4>
            <ul className="ml-6 list-disc space-y-1">
              <li><strong>Platform:</strong> Render.com (free tier)</li>
              <li><strong>Runtime:</strong> FastAPI with Uvicorn ASGI server</li>
              <li><strong>Limits:</strong> 750 hours/month, automatic sleep after 15 minutes inactivity</li>
              <li><strong>Alternative:</strong> Railway.app or Fly.io (similar free tiers)</li>
            </ul>

            <h3 id="8.2" className="mt-4">8.2 Cost Analysis</h3>
            <table className="w-full text-sm">
              <thead>
                <tr><th className="text-left pr-4">Service</th><th className="text-left pr-4">Free Tier Limit</th><th className="text-left">Monthly Cost</th></tr>
              </thead>
              <tbody>
                <tr><td>Gemini 1.5 Flash</td><td>1500 requests/day</td><td>$0</td></tr>
                <tr className="bg-muted/5"><td>Groq (Llama 3.1)</td><td>Generous limits</td><td>$0</td></tr>
                <tr><td>Vercel Hosting</td><td>100 GB bandwidth</td><td>$0</td></tr>
                <tr className="bg-muted/5"><td>Render.com</td><td>750 hours/month</td><td>$0</td></tr>
                <tr><td>Cloudinary</td><td>25 GB storage</td><td>$0</td></tr>
                <tr className="bg-muted/5"><td>Firebase Firestore</td><td>1 GB, 50K reads/day</td><td>$0</td></tr>
                <tr><td><strong>Total Monthly Cost</strong></td><td></td><td><strong>$0</strong></td></tr>
              </tbody>
            </table>

            <hr className="my-6" />

            <h2 id="9" className="mt-6">9. References</h2>
            <ol className="ml-6 list-decimal space-y-1">
              <li>Indian consumer label reading behavior study (2013). Source: Food Safety and Standards Authority of India (FSSAI) consumer awareness reports.</li>
              <li>India Health Report 2024: Non-communicable diseases burden. Source: Indian Council of Medical Research (ICMR). Available at: https://www.icmr.gov.in</li>
              <li>World Health Organization (WHO). Noncommunicable diseases country profiles 2023 - India. Available at: https://www.who.int/india/health-topics/noncommunicable-diseases</li>
              <li>UNICEF India. Water, Sanitation and Hygiene (WASH) Annual Report 2022. Available at: https://www.unicef.org/india/reports/wash-annual-report-2022</li>
              <li>Legal awareness in India. Source: India Justice Report 2023, Tata Trusts. Available at: https://www.indiajusticereport.org</li>
              <li>Patient health literacy study on laboratory reports. Source: Journal of Medical Systems, 2021. DOI: 10.1007/s10916-021-01745-2</li>
              <li>Menstrual health knowledge among adolescent girls in India: A systematic review. Source: Indian Journal of Community Medicine, 2016. DOI: 10.4103/0970-0218.193330</li>
              <li>PCOS awareness study among Indian women (2021). Source: Journal of Human Reproductive Sciences, Volume 14, Issue 3. DOI: 10.4103/jhrs.JHRS_123_20</li>
              <li>Food Safety and Standards Authority of India (FSSAI). "Har Label Kuch Kahta Hai" campaign materials. Available at: https://www.fssai.gov.in</li>
              <li>National Digital Literacy Mission data on language preferences. Source: Ministry of Electronics and Information Technology, Government of India, 2024 report.</li>
              <li>IndiaCode.nic.in: Repository of Central and State Acts. Ministry of Law and Justice. Available at: https://www.indiacode.nic.in</li>
              <li>Digital Personal Data Protection Act (DPDP), 2023. Government of India. Available at: https://www.meity.gov.in/data-protection-framework</li>
              <li>Google Gemini API Documentation. Available at: https://ai.google.dev/docs</li>
              <li>Tesseract.js - JavaScript OCR Library. Available at: https://github.com/naptha/tesseract.js</li>
              <li>ChromaDB - Open-source embedding database. Available at: https://www.trychroma.com</li>
            </ol>
          </div>
        </section>
      </div>
    </div>
  );
}

