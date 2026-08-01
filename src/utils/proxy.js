export function getProxyAgent() {
  const proxy = process.env.HTTP_PROXY || process.env.HTTPS_PROXY || process.env.http_proxy || process.env.https_proxy;
  if (!proxy) return null;
  // In full: return undici ProxyAgent
  return null;
}
