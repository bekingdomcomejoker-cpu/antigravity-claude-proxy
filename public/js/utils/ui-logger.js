export function uiLog(level, msg) {
  console[level] || console.log(`[UI ${level}]`, msg);
  window.dispatchEvent(new CustomEvent('ui-log', { detail: { level, msg, ts: Date.now() } }));
}
