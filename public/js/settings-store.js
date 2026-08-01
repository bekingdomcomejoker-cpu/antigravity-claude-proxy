export const settingsStore = {
  strategy: 'hybrid',
  debug: false,
  fallback: false,
  load() {
    try {
      const s = JSON.parse(localStorage.getItem('antigravity-settings') || '{}');
      Object.assign(this, s);
    } catch {}
  },
  save() {
    localStorage.setItem('antigravity-settings', JSON.stringify({
      strategy: this.strategy,
      debug: this.debug,
      fallback: this.fallback
    }));
  }
};
