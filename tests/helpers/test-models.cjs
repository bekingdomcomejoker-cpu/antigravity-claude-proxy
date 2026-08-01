async function getTestModels(exclude = []) {
  return [
    { family: 'claude', model: 'claude-sonnet-4-6-thinking' },
    { family: 'gemini', model: 'gemini-3-flash' }
  ].filter(m => !exclude.includes(m.family));
}
function getModelConfig(family) {
  return {
    max_tokens: 1024,
    thinking: family === 'claude' ? { type: 'enabled' } : undefined
  };
}
function familySupportsThinking(family) {
  return true;
}
module.exports = { getTestModels, getModelConfig, familySupportsThinking };
