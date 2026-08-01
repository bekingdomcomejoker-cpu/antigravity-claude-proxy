export class RateLimitState {
  constructor() { this.limits = new Map(); }
  set(email, model, resetTime) {
    if (!this.limits.has(email)) this.limits.set(email, {});
    this.limits.get(email)[model] = { isRateLimited: true, resetTime };
  }
  clear(email, model) {
    if (this.limits.has(email)) delete this.limits.get(email)[model];
  }
  get(email) { return this.limits.get(email) || {}; }
}
