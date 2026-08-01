export function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
export function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
