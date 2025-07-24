# Message Strategy Analyzer

## Overview
A frontend-only HTML app that uses Tesseract.js for OCR and analyzes conversations using the OpenRouter API via a secure Vercel serverless function.

## Folder Structure

```
/
  api/
    analyze.js           # Vercel serverless function (backend proxy)
  public/
    index.html           # Main frontend app (no API key exposed)
    vercel.json          # Vercel config for SPA and API routing
```

## Deployment (Vercel)
1. **Set Environment Variable:**
   - In your Vercel dashboard, add `OPENROUTER_API_KEY` to your project settings (do NOT commit your API key).
2. **Deploy:**
   - Push this repo to Vercel (GitHub/GitLab/Bitbucket or manual import).
3. **Access:**
   - Your app will be available at your Vercel domain. All API calls are securely proxied through `/api/analyze`.

## Security
- The OpenRouter API key is never exposed to the frontend.
- All sensitive calls are handled server-side via Vercel Functions.

## Notes
- The OCR logic (Tesseract.js) runs entirely in the browser.
- Only the API call logic is moved to the backend for security. 