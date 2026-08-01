export function parseRateLimitHeaders(headers) {
  const reset = headers.get('x-ratelimit-reset') || headers.get('retry-after');
  return {
    isLimited: headers.get('x-ratelimit-remaining') === '0',
    resetMs: reset ? parseInt(reset, 10) * 1000 : 60000
  };
}
