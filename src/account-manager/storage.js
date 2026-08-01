import { getDb } from '../auth/database.js';

export function loadAccounts() {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM accounts').all();
  return rows.map(r => ({
    email: r.email,
    tokens: r.tokens ? JSON.parse(r.tokens) : null,
    enabled: !!r.enabled,
    isInvalid: !!r.isInvalid,
    lastUsed: r.lastUsed,
    quota: r.quota ? JSON.parse(r.quota) : null,
    modelRateLimits: r.modelRateLimits ? JSON.parse(r.modelRateLimits) : {},
    createdAt: r.createdAt
  }));
}

export function saveAccount(account) {
  const db = getDb();
  db.prepare(`INSERT OR REPLACE INTO accounts (email, tokens, enabled, isInvalid, lastUsed, quota, modelRateLimits, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
    account.email,
    JSON.stringify(account.tokens || {}),
    account.enabled ? 1 : 0,
    account.isInvalid ? 1 : 0,
    account.lastUsed || Date.now(),
    JSON.stringify(account.quota || {}),
    JSON.stringify(account.modelRateLimits || {}),
    account.createdAt || Date.now()
  );
}

export function removeAccount(email) {
  getDb().prepare('DELETE FROM accounts WHERE email = ?').run(email);
}
