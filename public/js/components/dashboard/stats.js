export function formatStats(raw) {
  return {
    total: raw.total || 0,
    accounts: raw.accounts || 0,
    byModel: raw.byModel || {}
  };
}
