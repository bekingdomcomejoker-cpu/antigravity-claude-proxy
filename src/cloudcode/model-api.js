export async function listModels(token) {
  // Returns available models from Cloud Code
  return [
    { id: 'claude-sonnet-4-6-thinking', object: 'model' },
    { id: 'claude-opus-4-6-thinking', object: 'model' },
    { id: 'claude-sonnet-4-6', object: 'model' },
    { id: 'gemini-3-flash', object: 'model' },
    { id: 'gemini-3.1-pro-low', object: 'model' },
    { id: 'gemini-3.1-pro-high', object: 'model' },
  ];
}
