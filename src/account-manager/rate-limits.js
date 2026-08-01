export function applyRateLimit(account, model, resetMs = 60000) {
  if (!account.modelRateLimits) account.modelRateLimits = {};
  account.modelRateLimits[model] = {
    isRateLimited: true,
    resetTime: Date.now() + resetMs
  };
}

export function clearExpiredRateLimits(account) {
  if (!account.modelRateLimits) return;
  const now = Date.now();
  for (const [model, rl] of Object.entries(account.modelRateLimits)) {
    if (rl.resetTime && rl.resetTime < now) {
      delete account.modelRateLimits[model];
    }
  }
}
