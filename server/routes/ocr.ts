import type { RequestHandler } from "express";
import FormData from "form-data";

const OCR_SERVICE_URL = process.env.OCR_SERVICE_URL || "http://localhost:8000";

export const handleOCRExtract: RequestHandler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const form = new FormData();
    form.append("file", req.file.buffer, {
      filename: req.file.originalname || "upload",
      contentType: req.file.mimetype || "application/octet-stream",
    });

    const languages = (req.body?.languages as string | undefined) || "eng";
    form.append("languages", languages);

    const preprocessRaw = (req.body?.preprocess as string | undefined) ?? "true";
    const preprocess = preprocessRaw !== "false";
    form.append("preprocess", preprocess ? "true" : "false");

    const upstream = await fetch(`${OCR_SERVICE_URL}/api/ocr/extract`, {
      method: "POST",
      body: form as any,
      headers: form.getHeaders(),
    });

    const text = await upstream.text();
    const maybeJson = (() => {
      try {
        return JSON.parse(text);
      } catch {
        return null;
      }
    })();

    if (!upstream.ok) {
      return res.status(upstream.status).json(
        maybeJson ?? {
          error: "OCR service error",
          detail: text || `Status ${upstream.status}`,
        }
      );
    }

    return res.status(200).json(maybeJson ?? { text });
  } catch (err) {
    console.error("OCR proxy error:", err);
    return res.status(500).json({
      error: "Failed to process OCR request",
      detail: err instanceof Error ? err.message : "Unknown error",
    });
  }
};

export const handleOCRLanguages: RequestHandler = async (_req, res) => {
  try {
    const upstream = await fetch(`${OCR_SERVICE_URL}/api/ocr/languages`);
    const text = await upstream.text();
    const maybeJson = (() => {
      try {
        return JSON.parse(text);
      } catch {
        return null;
      }
    })();

    if (!upstream.ok) {
      return res.status(upstream.status).json(
        maybeJson ?? {
          error: "Failed to fetch languages",
          detail: text || `Status ${upstream.status}`,
        }
      );
    }

    return res.status(200).json(maybeJson ?? { text });
  } catch (err) {
    console.error("OCR languages proxy error:", err);
    return res.status(500).json({
      error: "Failed to fetch languages",
      detail: err instanceof Error ? err.message : "Unknown error",
    });
  }
};


