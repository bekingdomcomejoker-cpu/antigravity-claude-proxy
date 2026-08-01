const http = require('http');
function makeRequest(body) {
  return new Promise((resolve) => {
    resolve({ statusCode: 200, content: [{ type: 'text', text: 'stub' }], error: null });
  });
}
function streamRequest(body) {
  return makeRequest(body).then(r => ({ ...r, events: [] }));
}
function analyzeContent(content) {
  return {
    hasThinking: content.some(b => b.type === 'thinking'),
    hasSignature: content.some(b => b.signature || b.thoughtSignature),
    hasToolUse: content.some(b => b.type === 'tool_use'),
    hasText: content.some(b => b.type === 'text'),
    thinking: content.filter(b => b.type === 'thinking'),
    toolUse: content.filter(b => b.type === 'tool_use'),
    text: content.filter(b => b.type === 'text')
  };
}
const commonTools = {
  executeCommand: { name: 'execute_command', description: 'Run a command', input_schema: { type: 'object', properties: { command: { type: 'string' } } } },
  getWeather: { name: 'get_weather', description: 'Get weather', input_schema: { type: 'object', properties: { location: { type: 'string' } } } },
  readFile: { name: 'read_file', description: 'Read file', input_schema: { type: 'object', properties: { path: { type: 'string' } } } },
  writeFile: { name: 'write_file', description: 'Write file', input_schema: { type: 'object', properties: { path: { type: 'string' }, content: { type: 'string' } } } },
  searchFiles: { name: 'search_files', description: 'Search', input_schema: { type: 'object', properties: { query: { type: 'string' } } } },
  runTests: { name: 'run_tests', description: 'Run tests', input_schema: { type: 'object', properties: {} } }
};
module.exports = { makeRequest, streamRequest, analyzeContent, commonTools };
