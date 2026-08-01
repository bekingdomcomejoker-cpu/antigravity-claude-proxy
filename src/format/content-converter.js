export function normalizeContent(content) {
  if (typeof content === 'string') return [{ type: 'text', text: content }];
  return content || [];
}
