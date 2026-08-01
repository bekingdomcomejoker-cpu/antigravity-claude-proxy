import { BaseStrategy } from './base-strategy.js';
import { HealthTracker } from './trackers/health-tracker.js';
import { TokenBucketTracker } from './trackers/token-bucket-tracker.js';
import { QuotaTracker } from './trackers/quota-tracker.js';

export class HybridStrategy extends BaseStrategy {
  constructor(options = {}) {
    super();
    this.health = new HealthTracker(options.healthScore || {});
    this.tokens = new TokenBucketTracker(options.tokenBucket || {});
    this.quota = new QuotaTracker(options.quota || {});
    this.weights = options.weights || { health: 2, tokens: 5, quota: 3, lru: 0.1 };
  }

  selectAccount(accounts, model) {
    if (!accounts?.length) return { account: null, index: 0 };

    const usable = this.getUsableAccounts(accounts, model)
      .filter(({ account }) => !this.quota.isQuotaCritical(account, model));

    if (!usable.length) {
      // Emergency / last-resort fallback
      const any = accounts.find(a => a.enabled && !a.isInvalid);
      if (any) {
        return { account: any, index: accounts.indexOf(any), waitMs: 500 };
      }
      return { account: null, index: 0 };
    }

    let best = null;
    let bestScore = -Infinity;

    for (const { account, index } of usable) {
      if (!this.health.isUsable(account.email) || !this.tokens.hasTokens(account.email)) continue;

      const healthScore = this.health.getScore(account.email);
      const tokenScore = this.tokens.getTokens(account.email);
      const quotaScore = this.quota.getScore(account, model);
      const lruScore = account.lastUsed ? (Date.now() - account.lastUsed) / 60000 : 100;

      const score =
        this.weights.health * healthScore +
        this.weights.tokens * tokenScore +
        this.weights.quota * quotaScore +
        this.weights.lru * lruScore;

      if (score > bestScore) {
        bestScore = score;
        best = { account, index };
      }
    }

    if (!best) {
      // Fallback with throttle
      const fallback = usable[0];
      return { account: fallback.account, index: fallback.index, waitMs: 250 };
    }

    this.tokens.consume(best.account.email);
    return best;
  }

  onSuccess(account) {
    this.health.recordSuccess(account.email);
  }

  onRateLimit(account) {
    this.health.recordRateLimit(account.email);
  }

  onFailure(account) {
    this.health.recordFailure(account.email);
    this.tokens.refund(account.email);
  }

  getHealthTracker() { return this.health; }
  getTokenBucketTracker() { return this.tokens; }
  getQuotaTracker() { return this.quota; }
}
