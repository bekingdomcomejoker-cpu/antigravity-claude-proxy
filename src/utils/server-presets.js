export const PRESETS = {
  development: { debug: true, logLevel: 'debug', maxRetries: 3 },
  production: { debug: false, logLevel: 'info', maxRetries: 5, persistTokenCache: true },
  'high-performance': { maxRetries: 10, retryMaxMs: 60000, tokenCacheTtlMs: 600000 }
};

export function applyPreset(config, name) {
  return { ...config, ...(PRESETS[name] || {}) };
}
