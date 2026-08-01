import { extractCodeFromInput } from './token-extractor.js';

export { extractCodeFromInput };

export async function startOAuthFlow(options = {}) {
  // Returns auth URL for Google OAuth
  const clientId = process.env.GOOGLE_CLIENT_ID || 'placeholder';
  const redirect = options.redirectUri || 'http://localhost:51121/oauth-callback';
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirect)}&response_type=code&scope=openid%20email%20profile`;
  return { url };
}

export async function exchangeCode(code) {
  // Exchange auth code for tokens - placeholder
  return {
    access_token: 'placeholder',
    refresh_token: 'placeholder',
    expires_in: 3600
  };
}
