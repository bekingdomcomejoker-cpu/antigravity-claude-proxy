const cache = new Map();
export function cacheSignature(key, sig) { cache.set(key, sig); }
export function getSignature(key) { return cache.get(key); }
