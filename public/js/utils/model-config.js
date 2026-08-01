export const MODEL_FAMILIES = {
  claude: ['claude-sonnet-4-6', 'claude-sonnet-4-6-thinking', 'claude-opus-4-6-thinking'],
  gemini: ['gemini-3-flash', 'gemini-3.1-pro-low', 'gemini-3.1-pro-high']
};

export function getFamily(modelId) {
  if (modelId.startsWith('claude')) return 'claude';
  if (modelId.startsWith('gemini')) return 'gemini';
  return 'unknown';
}
