import { saveAccount, loadAccounts } from './storage.js';

export async function refreshToken(account) {
  // OAuth refresh logic placeholder - uses stored refresh_token
  if (!account.tokens?.refresh_token) throw new Error('No refresh token');
  // In real impl: call Google token endpoint
  return account;
}

export function getValidToken(account) {
  if (!account.tokens?.access_token) return null;
  // Check expiry if present
  return account.tokens.access_token;
}
