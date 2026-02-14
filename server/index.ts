import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import multer from "multer";
import { handleOCRExtract, handleOCRLanguages } from "./routes/ocr";
import { handleLabelUnderstand } from "./routes/label-understand";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // OCR proxy routes (forward to Python OCR service)
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (_req, file, cb) => {
      if (file.mimetype?.startsWith("image/")) cb(null, true);
      else cb(new Error("Only image files are allowed"));
    },
  });

  app.post("/api/ocr/extract", upload.single("file"), handleOCRExtract);
  app.get("/api/ocr/languages", handleOCRLanguages);

  // Gemini label understanding (server-side key)
  app.post("/api/label/understand", handleLabelUnderstand);

  return app;
}
