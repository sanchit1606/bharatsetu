import type { RequestHandler } from "express";
import { z } from "zod";

const IntentSchema = z.enum([
  "ingredients",
  "nutrition",
  "allergens",
  "warnings",
  "summary",
]);

const GeminiRequestSchema = z.object({
  intent: IntentSchema,
  ocr: z.object({
    text: z.string().max(200_000),
    confidence: z.number().optional(),
    word_count: z.number().optional(),
    languages: z.string().optional(),
    filename: z.string().optional(),
  }),
});

function detectRedFlags(text: string) {
  const flags: { text: string; reason: string }[] = [];
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const pushIfMatches = (pattern: RegExp, reason: string) => {
    for (const l of lines) {
      if (pattern.test(l)) {
        flags.push({ text: l, reason });
      }
    }
  };

  pushIfMatches(
    /does\s+not\s+represent\s+its\s+true\s+nature/i,
    "Marketing disclaimer: the label explicitly says the claim/wording may not reflect the product's true nature."
  );
  pushIfMatches(
    /\bnature\s+identical\b|\bartificial\b|\bimitation\b/i,
    "Possible marketing/ingredient claim that could mislead (e.g., 'nature identical', 'artificial', or 'imitation')."
  );
  pushIfMatches(
    /\bflavour(?:ing)?\b|\bflavouring\s+substances?\b/i,
    "Contains flavor/flavouring statements; users may interpret these as 'natural' unless clarified."
  );

  // Deduplicate by exact line text
  const seen = new Set<string>();
  return flags.filter((f) => {
    if (seen.has(f.text)) return false;
    seen.add(f.text);
    return true;
  });
}

// Very cheap heuristic gatekeeping: block obvious non-label text before spending tokens.
function labelLikelihoodScore(text: string) {
  const t = text.toLowerCase();
  const keywords = [
    "ingredients",
    "nutrition",
    "nutritional",
    "per serve",
    "per serving",
    "per 100g",
    "serving size",
    "contains",
    "allergen",
    "may contain",
    "best before",
    "expiry",
    "exp:",
    "mfg",
    "batch",
    "mrp",
    "net wt",
    "net weight",
    "net quantity",
    "fssai",
    "lic",
    "manufactured",
    "packed",
    "customer care",
    "toll free",
    "sodium",
    "sugar",
    "protein",
    "carbohydrate",
    "fat",
    "calories",
    "kcal",
    "energy",
  ];

  let hit = 0;
  const hitKeys: string[] = [];
  for (const k of keywords) {
    if (t.includes(k)) {
      hit++;
      hitKeys.push(k);
    }
  }

  // Strong label cues (free): units, E/INS codes, percentages, typical compliance markers.
  const hasUnits = /\b(\d+(\.\d+)?\s?(mg|g|kcal|kj|mcg|µg))\b/i.test(text);
  const hasPercents = /\b\d{1,3}\s?%\b/.test(text);
  const hasECodes = /\b(?:E|INS)\s*[-:]?\s*\d{3,4}[a-zA-Z]?\b/i.test(text);
  const hasComplianceMarkers = /\b(fssai|mrp|best before|use by|batch|lic\.?\s*no)\b/i.test(text);

  // "Looks like news/article" cues — keep very conservative to avoid false rejects.
  // Require multiple cues to count as "newsy".
  const newsCues = [
    /\b(breaking|reporter|editorial|headline)\b/i,
    /\b(subscribe|subscription|newspaper|press)\b/i,
    /\bpublished\s+on\b/i,
    /\bcopyright\b/i,
  ].filter((re) => re.test(text)).length;
  const newsy = newsCues >= 2;

  return {
    hit,
    hitKeys,
    newsy,
    hasUnits,
    hasPercents,
    hasECodes,
    hasComplianceMarkers,
  };
}

function intentKeywordsOk(intent: z.infer<typeof IntentSchema>, text: string) {
  const t = text.toLowerCase();
  const hasAny = (arr: string[]) => arr.some((k) => t.includes(k));
  switch (intent) {
    case "ingredients":
      return hasAny(["ingredients", "contains"]);
    case "nutrition":
      return hasAny(["nutrition", "nutritional", "kcal", "calories", "per 100g", "per serving"]);
    case "allergens":
      return hasAny(["allergen", "may contain", "contains"]);
    case "warnings":
      return hasAny(["warning", "caution", "keep out", "avoid", "do not", "not suitable"]);
    case "summary":
    default:
      return true;
  }
}

// Simple in-memory rate limit (per IP). Good enough for a prototype.
const rl = new Map<string, { count: number; resetAt: number }>();
function rateLimit(ip: string, limit: number, windowMs: number) {
  const now = Date.now();
  const cur = rl.get(ip);
  if (!cur || now > cur.resetAt) {
    rl.set(ip, { count: 1, resetAt: now + windowMs });
    return { ok: true as const, remaining: limit - 1, resetAt: now + windowMs };
  }
  if (cur.count >= limit) {
    return { ok: false as const, remaining: 0, resetAt: cur.resetAt };
  }
  cur.count += 1;
  rl.set(ip, cur);
  return { ok: true as const, remaining: limit - cur.count, resetAt: cur.resetAt };
}

function buildPrompt(ocr: z.infer<typeof GeminiRequestSchema>["ocr"]) {
  return [
    "You are a product label understanding assistant for Indian packaged food/cosmetic/pharma labels.",
    "Task: Extract and summarize label information from OCR text.",
    "Return ONLY valid JSON (no markdown, no code fences).",
    "",
    "Output JSON schema (strict):",
    "{",
    '  "human_summary": string,',
    '  "product_name": string|null,',
    '  "brand": string|null,',
    '  "category": string|null,',
    '  "ingredients": string[]|null,',
    '  "allergens": string[]|null,',
    '  "additives_e_numbers": string[]|null,',
    '  "nutrition": { "serving_size": string|null, "per_serving": Record<string,string>|null, "per_100g": Record<string,string>|null }|null,',
    '  "claims": string[]|null,',
    '  "warnings": string[]|null,',
    '  "red_flags": { "text": string, "reason": string }[]|null,',
    '  "manufacturer": string|null,',
    '  "address": string|null,',
    '  "fssai_license": string|null,',
    '  "mrp": string|null,',
    '  "net_quantity": string|null,',
    '  "batch_no": string|null,',
    '  "mfg_date": string|null,',
    '  "exp_date": string|null,',
    '  "customer_care": string[]|null,',
    '  "barcode": string|null,',
    '  "notes": string|null',
    "}",
    "",
    "Rules:",
    "- If a field is not present, use null (not empty string).",
    "- For ingredients, split on commas/semicolons where reasonable and trim.",
    "- Preserve units as strings (e.g. '423 mg').",
    "- If OCR text looks corrupted for a value, prefer null rather than guessing.",
    "- human_summary must be short, user-friendly, and not JSON-escaped.",
    "- red_flags: include any disclaimers or statements that might mislead users, e.g. phrases like 'does not represent its true nature', 'imitation', 'nature identical', or anything that tries to legally disclaim a marketing claim.",
    "- For red_flags, quote the exact text snippet and give a simple reason in plain English.",
    "- additives_e_numbers: extract codes like E211/E260/E415/INS 211 from ingredients/nutrition text; output standardized codes (e.g. 'E211', 'E150d').",
    "",
    "OCR metadata:",
    JSON.stringify(
      {
        filename: ocr.filename ?? null,
        languages: ocr.languages ?? null,
        confidence: ocr.confidence ?? null,
        word_count: ocr.word_count ?? null,
      },
      null,
      2
    ),
    "",
    "OCR TEXT:",
    ocr.text,
  ].join("\n");
}

export const handleLabelUnderstand: RequestHandler = async (req, res) => {
  try {
    const ip = req.ip || "unknown";
    const limit = rateLimit(ip, 20, 24 * 60 * 60 * 1000); // 20/day per IP
    if (!limit.ok) {
      const retryAfterSeconds = Math.max(1, Math.ceil((limit.resetAt - Date.now()) / 1000));
      res.setHeader("Retry-After", String(retryAfterSeconds));
      return res.status(429).json({
        error: "Rate limited",
        message: "Too many Understand Label requests. Please try again later.",
        retryAfterSeconds,
      });
    }

    const parsed = GeminiRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid request", detail: parsed.error.flatten() });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "Server is not configured",
        detail: "Missing GEMINI_API_KEY in environment",
      });
    }

    const prompt = buildPrompt(parsed.data.ocr);

    // Gatekeeping BEFORE calling Gemini
    const ocrText = parsed.data.ocr.text || "";
    const ll = labelLikelihoodScore(ocrText);
    // Only reject when we have *very low* label evidence.
    // OCR is noisy; genuine labels often still contain units/%/E-codes even if keywords are mangled.
    const strongLabelEvidence =
      ll.hit >= 1 || ll.hasUnits || ll.hasPercents || ll.hasECodes || ll.hasComplianceMarkers;

    if (ll.newsy || !strongLabelEvidence) {
      return res.status(400).json({
        error: "Not a product label",
        message:
          "This doesn’t look like a product label (ingredients/nutrition/etc.). Gemini was not called.",
        detail: {
          score: ll.hit,
          hits: ll.hitKeys.slice(0, 10),
          newsy: ll.newsy,
          hasUnits: ll.hasUnits,
          hasPercents: ll.hasPercents,
          hasECodes: ll.hasECodes,
          hasComplianceMarkers: ll.hasComplianceMarkers,
        },
      });
    }

    // If intent doesn't match well, downgrade to summary rather than blocking.
    const effectiveIntent = intentKeywordsOk(parsed.data.intent, ocrText)
      ? parsed.data.intent
      : "summary";

    // Model names change over time; prefer configurable + default to an actually-available model.
    // Valid examples (from ListModels): "models/gemini-2.0-flash", "models/gemini-2.5-flash"
    const modelEnv = process.env.GEMINI_MODEL || "models/gemini-2.0-flash";
    const model = modelEnv.startsWith("models/") ? modelEnv : `models/${modelEnv}`;

    // Use the stable v1 endpoint.
    const url =
      `https://generativelanguage.googleapis.com/v1/${model}:generateContent` +
      `?key=${encodeURIComponent(apiKey)}`;

    const upstream = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text:
                  prompt +
                  `\n\nUser intent: ${effectiveIntent}\n(If intent is 'summary', provide the best overall extraction without assuming missing nutrition.)`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
        },
      }),
    });

    const text = await upstream.text();
    if (!upstream.ok) {
      const upstreamJson = (() => {
        try {
          return JSON.parse(text);
        } catch {
          return null;
        }
      })();

      const message: string | undefined =
        upstreamJson?.error?.message ??
        upstreamJson?.message ??
        (text ? String(text) : undefined);

      // Extract retry delay like "43s" if present
      const retryDelayStr: string | undefined =
        upstreamJson?.error?.details?.find((d: any) => d?.["@type"]?.includes("RetryInfo"))?.retryDelay;

      const retryAfterSeconds =
        retryDelayStr && typeof retryDelayStr === "string" && retryDelayStr.endsWith("s")
          ? Number.parseInt(retryDelayStr.slice(0, -1), 10)
          : undefined;

      if (retryAfterSeconds && Number.isFinite(retryAfterSeconds)) {
        res.setHeader("Retry-After", String(retryAfterSeconds));
      }

      return res.status(upstream.status).json({
        error: "Gemini API error",
        status: upstreamJson?.error?.status ?? undefined,
        message,
        retryAfterSeconds: Number.isFinite(retryAfterSeconds) ? retryAfterSeconds : undefined,
        // Helpful hint for this common case
        hint:
          upstream.status === 429
            ? "Your Gemini API quota appears to be 0 (or exceeded). Enable billing / adjust limits in Google AI Studio, or try again after the Retry-After window."
            : undefined,
        raw: upstreamJson ?? text,
      });
    }

    const payload = (() => {
      try {
        return JSON.parse(text);
      } catch {
        return null;
      }
    })();

    // Gemini usually returns: candidates[0].content.parts[0].text
    const modelText: string | undefined =
      payload?.candidates?.[0]?.content?.parts?.[0]?.text ??
      payload?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text).join("\n");

    const stripCodeFences = (s: string) => {
      const trimmed = s.trim();
      // ```json ... ``` or ``` ... ```
      if (trimmed.startsWith("```")) {
        return trimmed
          .replace(/^```[a-zA-Z]*\s*/m, "")
          .replace(/```$/m, "")
          .trim();
      }
      return trimmed;
    };

    const extractedJson = (() => {
      if (!modelText) return null;
      try {
        return JSON.parse(stripCodeFences(modelText));
      } catch {
        return null;
      }
    })();

    // Free safety net: add red flags if model didn't provide them
    const heuristicFlags = detectRedFlags(parsed.data.ocr.text || "");
    const merged =
      extractedJson && typeof extractedJson === "object"
        ? {
            ...extractedJson,
            red_flags:
              Array.isArray((extractedJson as any).red_flags) && (extractedJson as any).red_flags.length > 0
                ? (extractedJson as any).red_flags
                : heuristicFlags.length
                  ? heuristicFlags
                  : null,
          }
        : extractedJson;

    return res.status(200).json({
      model,
      result: merged ?? extractedJson ?? modelText ?? payload ?? text,
      raw: payload ?? text,
    });
  } catch (err) {
    console.error("Label understand error:", err);
    return res.status(500).json({
      error: "Failed to understand label",
      detail: err instanceof Error ? err.message : "Unknown error",
    });
  }
};


