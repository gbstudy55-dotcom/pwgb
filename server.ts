import express, { Request, Response } from 'express';
import https from 'https';
import path from 'path';
import fs from 'fs';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const TARGET_HOST = 'pwmarco-og-06656c44b005-d9e101c9f09c.herokuapp.com';

// Helper to locate static assets safely on Local, Docker, and Vercel serverless environments
function findPublicFile(filename: string): string {
  const possiblePaths = [
    path.join(__dirname, 'public', filename),
    path.join(process.cwd(), 'public', filename),
    path.join(__dirname, filename),
    path.join(process.cwd(), filename)
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return path.join(process.cwd(), 'public', filename);
}

// In-memory cache for stream authentication cookies (_svs)
// This ensures that even when browsers block third-party iframe cookies,
// video stream requests (/api/v/*) and primary-stream requests always authenticate successfully.
let latestSvsCookie = '';
const svsCookieMap = new Map<string, string>();

function getClientId(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'client';
}

// 1. Serve Telegram banner with GB STUDY branding
app.get([
  '/telegram-banner.png',
  /.*telegram-banner.*/i
], (_req: Request, res: Response) => {
  const filePath = findPublicFile('telegram-banner.png');
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.status(404).end();
  }
});

// 2. Serve Default Batch banner with GB STUDY branding
app.get([
  '/default-batch-banner.png',
  /.*default-batch-banner.*/i,
  /.*file-000000008d1c8211a64b48d531d3d091.*/i
], (_req: Request, res: Response) => {
  const filePath = findPublicFile('default-batch-banner.png');
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.status(404).end();
  }
});

// 3. Serve GB STUDY logo & icon for ANY matching logo path
app.get([
  '/logo.png',
  '/gb-study-logo.png',
  '/gb-study-logo-2026.png',
  '/favicon.png',
  '/favicon.ico',
  '/apple-touch-icon.png',
  /.*gb-study-logo.*/i,
  /.*pw-marco-logo.*/i
], (_req: Request, res: Response) => {
  const filePath = findPublicFile('gb-study-logo.png');
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.redirect(302, 'https://i.ibb.co/Q3g9fGSt/1791541921524.png');
  }
});

// Global CSS style to enforce fully BLUE theme on all proxied pages
const BLUE_THEME_STYLE = `
<style id="gb-study-blue-theme">
  :root {
    --spring-leaf: #2563eb !important;
    --spring-mint: #3b82f6 !important;
    --spring-mint-dark: #1d4ed8 !important;
    --spring-leaf-dark: #1e40af !important;
    --spring-forest: #0b1528 !important;
    --spring-forest-surface: #112240 !important;
    --spring-yellow: #38bdf8 !important;
    --spring-lavender: #93c5fd !important;
    --bg-light-0: #f0f7ff !important;
    --bg-light-1: #e0effe !important;
    --bg-light-2: #bae6fd !important;
    --bg-light-soft: #f4f9ff !important;
    --bg-card-light: rgba(255, 255, 255, 0.94) !important;
    --bg-dark-0: #070d19 !important;
    --bg-dark-1: #0b1528 !important;
    --bg-dark-2: #13233f !important;
    --bg-card-dark: rgba(11, 21, 40, 0.92) !important;
    --shadow-petal: 0 8px 20px rgba(37, 99, 235, 0.2) !important;
    --shadow-leaf: 0 12px 32px rgba(59, 130, 246, 0.25) !important;
    --shadow-glow: 0 6px 16px rgba(59, 130, 246, 0.45) !important;
    --shadow-bloom: 0 16px 48px rgba(37, 99, 235, 0.3) !important;
    --gradient-bg-light: linear-gradient(135deg, #f0f7ff, #e0effe 40%, #bae6fd 70%, #f0f7ff) !important;
    --gradient-bg-dark: linear-gradient(135deg, #070d19, #0b1528 40%, #13233f 70%, #070d19) !important;
    --spring-gradient-bg: linear-gradient(160deg, #eff6ff, #dbeafe 30%, #e0f2fe 60%, #eff6ff) !important;
    --glass-shadow: 0 8px 24px -4px rgba(37, 99, 235, 0.16), 0 2px 6px -1px rgba(0, 0, 0, 0.04) !important;
  }
  .dark {
    --bg-light-0: #070d19 !important;
    --bg-light-1: #0b1528 !important;
    --bg-light-2: #13233f !important;
    --bg-light-soft: #0a1120 !important;
    --bg-card-light: rgba(11, 21, 40, 0.92) !important;
    --spring-gradient-bg: linear-gradient(160deg, #070d19, #0b1528 40%, #13233f 70%, #070d19) !important;
    --glass-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.6), 0 2px 6px -1px rgba(0, 0, 0, 0.4) !important;
  }
  /* Fully Blue UI Components */
  .btn-primary-garden, button.bg-emerald-600, button.bg-emerald-500, .bg-gradient-to-r.from-emerald-500 {
    background: linear-gradient(135deg, #2563eb, #1d4ed8) !important;
    color: #ffffff !important;
  }
  .btn-secondary-garden {
    border-color: rgba(37, 99, 235, 0.4) !important;
    color: #2563eb !important;
  }
  .dark .btn-secondary-garden {
    color: #60a5fa !important;
  }
  .hero-garden {
    background: radial-gradient(circle at 50% 20%, rgba(37, 99, 235, 0.16), transparent 70%) !important;
  }
  .petal, .petal-particle {
    background: #60a5fa !important;
  }
  /* Force blue colors on all badges, rings and links */
  [class*="text-emerald"], [class*="text-teal"], [class*="text-green"] {
    color: #3b82f6 !important;
  }
  .dark [class*="text-emerald"], .dark [class*="text-teal"], .dark [class*="text-green"] {
    color: #60a5fa !important;
  }
  [class*="border-emerald"], [class*="border-teal"], [class*="border-green"] {
    border-color: rgba(59, 130, 246, 0.3) !important;
  }
  /* Visually render GB STUDY on brand header without DOM text mutation */
  span.bg-clip-text.text-transparent {
    font-size: 0 !important;
  }
  span.bg-clip-text.text-transparent::after {
    content: "GB STUDY" !important;
    font-size: 1.125rem !important;
    font-weight: 700 !important;
    letter-spacing: -0.025em !important;
    background: linear-gradient(135deg, #38bdf8, #60a5fa, #93c5fd) !important;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
  }
</style>
`;

// Safe client-side branding script: Intercepts clicks and runs strictly AFTER hydration to avoid Error #418
const CLIENT_BRANDING_SCRIPT = `
<script id="gb-study-branding-patch">
(function() {
  // 1. Intercept Telegram clicks immediately without touching DOM attributes
  document.addEventListener('click', function(e) {
    var a = e.target && e.target.closest ? e.target.closest('a') : null;
    if (a && a.href && (a.href.indexOf('official_marco_22') !== -1 || a.href.indexOf('t.me/pw_marco') !== -1)) {
      e.preventDefault();
      e.stopPropagation();
      window.open('https://t.me/GBFreestudy', '_blank', 'noopener,noreferrer');
    }
  }, true);

  // 2. Safely apply title and text strictly after window.load (guarantees React hydration has completed)
  function onHydrated() {
    try {
      document.title = 'GB STUDY';
      var tgLinks = document.querySelectorAll('a[href*="official_marco_22"]');
      for (var i = 0; i < tgLinks.length; i++) {
        tgLinks[i].href = 'https://t.me/GBFreestudy';
        if (tgLinks[i].textContent && tgLinks[i].textContent.indexOf('@official_marco_22') !== -1) {
          tgLinks[i].textContent = '@GBFreestudy';
        }
      }
    } catch(e) {}
  }

  if (document.readyState === 'complete') {
    setTimeout(onHydrated, 100);
  } else {
    window.addEventListener('load', function() {
      setTimeout(onHydrated, 100);
    });
  }
})();
</script>
`;

// Safe HTML rewriter: Does NOT mutate DOM markup or text nodes, preventing React hydration mismatch (#418)
function rewriteHtmlContent(html: string): string {
  if (!html) return html;

  let modified = html;

  // Inject Blue Theme CSS and Client Branding Script before </head>
  if (modified.includes('</head>')) {
    modified = modified.replace('</head>', `${BLUE_THEME_STYLE}${CLIENT_BRANDING_SCRIPT}</head>`);
  }

  return modified;
}

// Fallback loader if Heroku takes a couple seconds to wake up
function renderWakingUpPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>GB STUDY - Connecting...</title>
  <link rel="icon" type="image/png" href="/gb-study-logo.png">
  <style>
    body {
      margin: 0;
      font-family: system-ui, -apple-system, sans-serif;
      background: linear-gradient(135deg, #070d19, #0b1528 50%, #0d1e3a);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
      padding: 20px;
    }
    .card {
      background: rgba(11, 21, 40, 0.9);
      border: 1px solid rgba(59, 130, 246, 0.3);
      border-radius: 24px;
      padding: 40px 30px;
      max-width: 440px;
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6);
    }
    .logo {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      margin-bottom: 20px;
    }
    h1 {
      font-size: 22px;
      margin: 0 0 10px;
      color: #60a5fa;
    }
    p {
      font-size: 13px;
      color: #cbd5e1;
      line-height: 1.6;
      margin: 0 0 24px;
    }
    .spinner {
      width: 32px;
      height: 32px;
      border: 3px solid rgba(59, 130, 246, 0.2);
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .btn {
      display: inline-block;
      padding: 10px 24px;
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: white;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
      border: none;
    }
  </style>
</head>
<body>
  <div class="card">
    <img src="/gb-study-logo.png" alt="GB STUDY" class="logo">
    <div class="spinner"></div>
    <h1>Connecting to GB STUDY...</h1>
    <p>Establishing secure connection with the lecture stream server. Reloading automatically in 3 seconds...</p>
    <button class="btn" onclick="window.location.reload()">Reload Now</button>
  </div>
  <script>
    setTimeout(function() {
      window.location.reload();
    }, 3000);
  </script>
</body>
</html>`;
}

// 2. Full-stack Reverse Proxy with Automatic Stream Authentication Injection
function handleProxy(req: Request, res: Response, retryCount = 0) {
  const clientId = getClientId(req);
  const isStreamRequest = req.path.startsWith('/api/v/');
  const isPrimaryStreamRequest = req.path.startsWith('/api/primary-stream');

  // Build clean sanitized request headers
  const reqHeaders: Record<string, string | string[] | undefined> = {
    host: TARGET_HOST,
    'user-agent':
      (req.headers['user-agent'] as string) ||
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    accept: (req.headers['accept'] as string) || '*/*',
    'accept-language': (req.headers['accept-language'] as string) || 'en-US,en;q=0.9',
    'accept-encoding': 'identity',
    referer: `https://${TARGET_HOST}/`,
    origin: `https://${TARGET_HOST}`
  };

  // Build client cookie string
  let cookieHeader = (req.headers['cookie'] as string) || '';

  // If this is a video stream request (/api/v/*), ensure the required _svs token is present
  if (isStreamRequest) {
    if (!cookieHeader.includes('_svs=')) {
      const cachedSvs = svsCookieMap.get(clientId) || latestSvsCookie;
      if (cachedSvs) {
        cookieHeader = cookieHeader ? `${cookieHeader}; ${cachedSvs}` : cachedSvs;
      }
    }
  }

  if (cookieHeader) {
    reqHeaders['cookie'] = cookieHeader;
  }

  if (req.headers['content-type']) {
    reqHeaders['content-type'] = req.headers['content-type'];
  }
  if (req.headers['content-length']) {
    reqHeaders['content-length'] = req.headers['content-length'];
  }
  if (req.headers['range']) {
    reqHeaders['range'] = req.headers['range'];
  }

  const options: https.RequestOptions = {
    hostname: TARGET_HOST,
    port: 443,
    path: req.originalUrl || req.url,
    method: req.method,
    headers: reqHeaders,
    timeout: 30000
  };

  let hasEnded = false;

  const proxyReq = https.request(options, (proxyRes) => {
    const statusCode = proxyRes.statusCode || 200;
    const responseHeaders = { ...proxyRes.headers };

    // Capture and cache _svs cookies from Heroku
    if (responseHeaders['set-cookie']) {
      const cookies = responseHeaders['set-cookie'];
      cookies.forEach((c: string) => {
        const svsMatch = c.match(/(_svs=[^;]+)/);
        if (svsMatch && !c.includes('Max-Age=0')) {
          const svsPair = svsMatch[1];
          latestSvsCookie = svsPair;
          svsCookieMap.set(clientId, svsPair);
        }
      });

      // Rewrite cookies for cross-origin iframe compliance (SameSite=None; Secure; Partitioned)
      responseHeaders['set-cookie'] = cookies.map((c: string) => {
        let cookieStr = c.replace(/domain=[^;]+;/gi, '');
        cookieStr = cookieStr.replace(/SameSite=Lax/gi, 'SameSite=None');
        if (!/SameSite=None/i.test(cookieStr)) {
          cookieStr += '; SameSite=None';
        }
        if (!/Secure/i.test(cookieStr)) {
          cookieStr += '; Secure';
        }
        if (!/Partitioned/i.test(cookieStr)) {
          cookieStr += '; Partitioned';
        }
        return cookieStr;
      });
    }

    // Handle temporary upstream dyno waking
    if ((statusCode === 502 || statusCode === 503) && retryCount < 2) {
      proxyRes.resume();
      setTimeout(() => {
        handleProxy(req, res, retryCount + 1);
      }, 1000);
      return;
    }

    const contentType = (responseHeaders['content-type'] || '').toLowerCase();
    const isHtml = contentType.includes('text/html');

    if (isHtml) {
      const chunks: Buffer[] = [];
      proxyRes.on('data', (chunk) => {
        chunks.push(chunk);
      });

      proxyRes.on('end', () => {
        if (hasEnded) return;
        hasEnded = true;

        let originalBuffer = Buffer.concat(chunks);

        const encoding = (responseHeaders['content-encoding'] || '').toLowerCase();
        try {
          if (encoding === 'gzip') {
            originalBuffer = zlib.gunzipSync(originalBuffer);
            delete responseHeaders['content-encoding'];
          } else if (encoding === 'deflate') {
            originalBuffer = zlib.inflateSync(originalBuffer);
            delete responseHeaders['content-encoding'];
          }
        } catch {
          // ignore
        }

        const originalText = originalBuffer.toString('utf8');

        // Catch Heroku error page and show branded connecting screen
        if (originalText.includes('Application error') && originalText.includes('heroku logs')) {
          if (retryCount < 2) {
            setTimeout(() => {
              handleProxy(req, res, retryCount + 1);
            }, 1200);
            return;
          }
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(renderWakingUpPage());
          return;
        }

        const modifiedText = rewriteHtmlContent(originalText);
        const modifiedBuffer = Buffer.from(modifiedText, 'utf8');

        delete responseHeaders['content-length'];
        delete responseHeaders['transfer-encoding'];
        responseHeaders['content-length'] = modifiedBuffer.length.toString();

        res.writeHead(statusCode, responseHeaders);
        res.end(modifiedBuffer);
      });
    } else {
      // Direct binary/stream pipe for JS chunks, Next.js RSC text/x-component, API JSON, video chunks, and PDFs
      res.writeHead(statusCode, responseHeaders);
      proxyRes.pipe(res);
    }
  });

  proxyReq.on('timeout', () => {
    proxyReq.destroy();
    if (retryCount < 2) {
      setTimeout(() => {
        handleProxy(req, res, retryCount + 1);
      }, 1000);
    } else if (!res.headersSent) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(renderWakingUpPage());
    }
  });

  proxyReq.on('error', (err) => {
    console.error('Proxy Error for URL:', req.originalUrl, err);
    if (retryCount < 2) {
      setTimeout(() => {
        handleProxy(req, res, retryCount + 1);
      }, 1000);
    } else if (!res.headersSent) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(renderWakingUpPage());
    }
  });

  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method || 'GET')) {
    proxyReq.end();
  } else {
    req.pipe(proxyReq);
  }
}

// 3. Catch-all reverse proxy handler
app.use((req: Request, res: Response) => {
  handleProxy(req, res);
});

// Run local listener only when not inside Vercel serverless runtime
if (!process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GB STUDY full proxy server running on http://0.0.0.0:${PORT}`);
  });
}

export default app;
export { app };
