"""
FastAPI OCR Service using Tesseract
Supports multiple Indian languages: English, Hindi, Marathi, Telugu, Tamil
"""

from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pytesseract
from PIL import Image
from PIL import UnidentifiedImageError
import cv2
import numpy as np
import io
from typing import Optional, List
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="BharatSetu OCR Service", version="1.0.0")

# CORS middleware to allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    # For local dev, allow all origins to avoid "Failed to fetch" due to CORS,
    # especially when using the Vite Network URL (e.g. http://192.168.x.x:8080).
    # No cookies/credentials are used here.
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Language code mapping
LANGUAGE_MAP = {
    "eng": "English",
    "hin": "Hindi",
    "mar": "Marathi",
    "tel": "Telugu",
    "tam": "Tamil"
}

def preprocess_image(image: Image.Image) -> Image.Image:
    """
    Preprocess image to improve OCR accuracy
    - Convert to grayscale
    - Apply denoising
    - Enhance contrast
    - Resize if too small
    """
    # Convert PIL to OpenCV format
    img_array = np.array(image)
    
    # Convert to grayscale if needed
    if len(img_array.shape) == 3:
        gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
    else:
        gray = img_array
    
    # Denoise
    denoised = cv2.fastNlMeansDenoising(gray, None, 10, 7, 21)
    
    # Enhance contrast using CLAHE (Contrast Limited Adaptive Histogram Equalization)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced = clahe.apply(denoised)
    
    # Resize if image is too small (minimum 300px width)
    height, width = enhanced.shape
    if width < 300:
        scale = 300 / width
        new_width = int(width * scale)
        new_height = int(height * scale)
        enhanced = cv2.resize(enhanced, (new_width, new_height), interpolation=cv2.INTER_CUBIC)
    
    # Convert back to PIL Image
    return Image.fromarray(enhanced)

def extract_text_from_image(image: Image.Image, languages: str = "eng") -> dict:
    """
    Extract text from image using Tesseract OCR
    
    Args:
        image: PIL Image object
        languages: Language codes (e.g., "eng+hin" for English + Hindi)
    
    Returns:
        Dictionary with extracted text and metadata
    """
    try:
        # Preprocess image
        processed_image = preprocess_image(image)
        
        # Perform OCR
        text = pytesseract.image_to_string(processed_image, lang=languages)
        
        # Get detailed data including confidence scores
        data = pytesseract.image_to_data(processed_image, lang=languages, output_type=pytesseract.Output.DICT)
        
        # Calculate average confidence
        confidences = [int(conf) for conf in data['conf'] if int(conf) > 0]
        avg_confidence = sum(confidences) / len(confidences) if confidences else 0
        
        # Get bounding boxes for words
        words_with_boxes = []
        n_boxes = len(data['text'])
        for i in range(n_boxes):
            if int(data['conf'][i]) > 0:
                words_with_boxes.append({
                    'text': data['text'][i],
                    'confidence': int(data['conf'][i]),
                    'left': data['left'][i],
                    'top': data['top'][i],
                    'width': data['width'][i],
                    'height': data['height'][i]
                })
        
        return {
            "text": text.strip(),
            "confidence": round(avg_confidence, 2),
            "word_count": len([w for w in data['text'] if w.strip()]),
            "words": words_with_boxes[:50],  # Limit to first 50 words for response size
            "languages": languages
        }
    
    except Exception as e:
        logger.error(f"OCR Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"OCR processing failed: {str(e)}")

def load_image_any_format(image_bytes: bytes) -> Image.Image:
    """
    Load an image from bytes.

    Primary loader: Pillow
    Fallback loader: OpenCV (useful when Pillow lacks WEBP support on some builds)
    """
    try:
        image = Image.open(io.BytesIO(image_bytes))
        image.load()  # force decode
        # Normalize to RGB to avoid surprises in OpenCV / Tesseract pipelines
        if image.mode not in ("RGB", "L"):
            image = image.convert("RGB")
        return image
    except UnidentifiedImageError:
        # Fallback: OpenCV decode
        nparr = np.frombuffer(image_bytes, np.uint8)
        cv_img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if cv_img is None:
            raise HTTPException(status_code=400, detail="Unsupported or corrupted image file")
        cv_img = cv2.cvtColor(cv_img, cv2.COLOR_BGR2RGB)
        return Image.fromarray(cv_img)

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "BharatSetu OCR Service",
        "status": "running",
        "tesseract_version": pytesseract.get_tesseract_version(),
        "supported_languages": list(LANGUAGE_MAP.keys())
    }

@app.get("/health")
async def health():
    """Health check"""
    return {"status": "healthy"}

@app.post("/api/ocr/extract")
async def extract_ocr(
    file: UploadFile = File(...),
    languages: str = Form("eng"),
    preprocess: bool = Form(True)
):
    """
    Extract text from uploaded image using OCR
    
    Args:
        file: Image file (JPEG, PNG, etc.)
        languages: Language codes separated by '+' (e.g., "eng+hin" for English + Hindi)
                  Default: "eng"
                  Supported: eng, hin, mar, tel, tam
        preprocess: Whether to apply image preprocessing (default: True)
    
    Returns:
        JSON with extracted text, confidence, and word details
    """
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read image
        image_bytes = await file.read()
        image = load_image_any_format(image_bytes)
        
        # Validate languages
        lang_list = languages.split('+')
        invalid_langs = [lang for lang in lang_list if lang not in LANGUAGE_MAP]
        if invalid_langs:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported languages: {invalid_langs}. Supported: {list(LANGUAGE_MAP.keys())}"
            )
        
        # Extract text
        if preprocess:
            result = extract_text_from_image(image, languages)
        else:
            # Skip preprocessing: run OCR directly on the decoded image
            text = pytesseract.image_to_string(image, lang=languages)
            data = pytesseract.image_to_data(image, lang=languages, output_type=pytesseract.Output.DICT)
            confidences = [int(conf) for conf in data['conf'] if int(conf) > 0]
            avg_confidence = sum(confidences) / len(confidences) if confidences else 0
            words_with_boxes = []
            n_boxes = len(data['text'])
            for i in range(n_boxes):
                if int(data['conf'][i]) > 0:
                    words_with_boxes.append({
                        'text': data['text'][i],
                        'confidence': int(data['conf'][i]),
                        'left': data['left'][i],
                        'top': data['top'][i],
                        'width': data['width'][i],
                        'height': data['height'][i]
                    })
            result = {
                "text": text.strip(),
                "confidence": round(avg_confidence, 2),
                "word_count": len([w for w in data['text'] if w.strip()]),
                "words": words_with_boxes[:50],
                "languages": languages
            }
        
        # Add metadata
        result["filename"] = file.filename
        result["file_size"] = len(image_bytes)
        result["image_dimensions"] = {"width": image.width, "height": image.height}
        result["language_names"] = [LANGUAGE_MAP.get(lang, lang) for lang in lang_list]
        
        logger.info(f"OCR completed for {file.filename}: {result['word_count']} words, {result['confidence']}% confidence")
        
        return JSONResponse(content=result)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing OCR request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/api/ocr/languages")
async def get_languages():
    """Get list of supported languages"""
    return {
        "languages": LANGUAGE_MAP,
        "available_tesseract_langs": pytesseract.get_languages()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

