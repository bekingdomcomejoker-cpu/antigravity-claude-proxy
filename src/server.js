import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { setupWebUI } from './webui/index.js';
import { convertAnthropicToGoogle } from './format/request-converter.js';
import { convertGoogleToAnthropic } from './format/response-converter.js';
import { handleStreaming } from './cloudcode/streaming-handler.js';
import { loadAccounts } from './account-manager/storage.js';
import { createStrategy } from './account-manager/strategies/index.js';
import { logger } from './utils/logger.js';
import { recordRequest } from './modules/usage-stats.js';

export async function startServer(port = config.port || 8080) {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '50mb' }));

  const strategy = createStrategy(config.strategy || 'hybrid');

  // Health
  app.get('/health', (req, res) => res.json({ status: 'ok', version: '2.7.7' }));

  // Models
  app.get('/v1/models', (req, res) => {
    res.json({
      object: 'list',
      data: [
        { id: 'claude-sonnet-4-6-thinking', object: 'model' },
        { id: 'claude-opus-4-6-thinking', object: 'model' },
        { id: 'claude-sonnet-4-6', object: 'model' },
        { id: 'gemini-3-flash', object: 'model' },
        { id: 'gemini-3.1-pro-low', object: 'model' },
        { id: 'gemini-3.1-pro-high', object: 'model' },
      ]
    });
  });

  // Messages (core proxy endpoint)
  app.post('/v1/messages', async (req, res) => {
    try {
      const accounts = loadAccounts().filter(a => a.enabled && !a.isInvalid);
      if (!accounts.length) return res.status(401).json({ error: { message: 'No accounts configured' } });

      const model = req.body.model || 'claude-sonnet-4-6';
      const { account } = strategy.selectAccount(accounts, model);
      if (!account) return res.status(429).json({ error: { message: 'All accounts rate-limited or exhausted' } });

      const googleBody = convertAnthropicToGoogle(req.body);
      // In full impl: call Cloud Code API with account token
      // Placeholder response for structure
      const fakeGoogle = {
        candidates: [{ content: { parts: [{ text: 'Proxy is running. Full Cloud Code integration requires linked Google accounts.' }] }, finishReason: 'STOP' }]
      };
      recordRequest(model, account.email);

      if (req.body.stream) {
        // Streaming path would use real response
        res.setHeader('Content-Type', 'text/event-stream');
        res.write(`data: ${JSON.stringify({ type: 'message_start' })}\n\n`);
        res.write(`data: ${JSON.stringify({ type: 'content_block_delta', delta: { type: 'text_delta', text: 'Proxy active.' } })}\n\n`);
        res.write(`data: ${JSON.stringify({ type: 'message_stop' })}\n\n`);
        return res.end();
      }

      const anthropic = convertGoogleToAnthropic(fakeGoogle, model);
      res.json(anthropic);
    } catch (e) {
      logger.error(e);
      res.status(500).json({ error: { message: e.message } });
    }
  });

  // Account limits
  app.get('/account-limits', (req, res) => {
    const accounts = loadAccounts();
    res.json(accounts.map(a => ({ email: a.email, enabled: a.enabled, isInvalid: a.isInvalid, quota: a.quota })));
  });

  setupWebUI(app);

  app.listen(port, () => {
    logger.info(`Antigravity Claude Proxy listening on http://localhost:${port}`);
  });
}
