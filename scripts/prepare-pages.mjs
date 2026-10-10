// Post-processes `expo export -p web` output in dist/ for static hosting
// (GitHub Pages or Vercel).
import { copyFileSync, readFileSync, writeFileSync } from 'node:fs';

const BASE = process.env.EXPO_BASE_URL ?? '';
const dist = new URL('../dist/', import.meta.url);

copyFileSync(new URL('../assets/icon.png', import.meta.url), new URL('apple-touch-icon.png', dist));

// iOS ignores the web manifest for "Add to Home Screen"; it reads these tags instead.
const iosTags = [
  `<link rel="apple-touch-icon" href="${BASE}/apple-touch-icon.png">`,
  '<meta name="apple-mobile-web-app-capable" content="yes">',
  '<meta name="mobile-web-app-capable" content="yes">',
  '<meta name="apple-mobile-web-app-title" content="Milk Tracker">',
  '<meta name="apple-mobile-web-app-status-bar-style" content="default">',
].join('\n');

const indexUrl = new URL('index.html', dist);
const html = readFileSync(indexUrl, 'utf8').replace('</head>', `${iosTags}\n</head>`);
writeFileSync(indexUrl, html);

// GitHub Pages has no SPA rewrites; serving the app shell as 404.html lets
// a refresh on /milk-tracker/dashboard still boot the router.
writeFileSync(new URL('404.html', dist), html);

// Without this, Pages' Jekyll step drops the `_expo/` folder (leading underscore).
writeFileSync(new URL('.nojekyll', dist), '');

console.log('dist/ prepared for GitHub Pages');
