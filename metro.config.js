// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// The app currently uses Dexie/IndexedDB (not expo-sqlite) on web — see
// src/data/repositories/index.web.ts — because getting the document-level
// COOP/COEP headers expo-sqlite's web backend needs working reliably in the
// local dev server proved unreliable. This config is kept so expo-sqlite's
// web backend still works if that's revisited later; it doesn't affect the
// current web build, and native (iOS/Android) doesn't need it at all.
// expo-sqlite's web implementation loads a WASM build of SQLite; Metro needs
// to know to treat .wasm files as bundleable assets rather than source.
config.resolver.assetExts.push('wasm');

// expo-sqlite on web persists via OPFS, which requires SharedArrayBuffer,
// which in turn requires these cross-origin isolation headers on every
// response from the dev server (and, later, whatever static host serves
// the production web build).
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
      res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
      return middleware(req, res, next);
    };
  },
};

module.exports = config;
