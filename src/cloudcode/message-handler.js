import { convertAnthropicToGoogle } from '../format/request-converter.js';
import { convertGoogleToAnthropic } from '../format/response-converter.js';
import { handleStreaming } from './streaming-handler.js';
import { logger } from '../utils/logger.js';

/**
 * Core message handling: convert, call upstream, convert back.
 * Full Cloud Code HTTP call is left as integration point.
 */
export async function handleMessages(req, res, account, strategy) {
  const model = req.body.model || 'claude-sonnet-4-6';
  const stream = !!req.body.stream;

  try {
    const googleBody = convertAnthropicToGoogle(req.body);

    // Placeholder: real implementation calls daily-cloudcode-pa.sandbox.googleapis.com
    // with account OAuth token and Cloud Code wrapping.
    const upstream = {
      candidates: [{
        content: { parts: [{ text: 'Antigravity proxy is active. Link Google accounts for live model responses.' }] },
        finishReason: 'STOP'
      }],
      usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 20 }
    };

    if (stream) {
      // Build a minimal synthetic stream
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.write(`data: ${JSON.stringify({ type: 'message_start', message: { id: 'msg_proxy', role: 'assistant', model } })}\n\n`);
      res.write(`data: ${JSON.stringify({ type: 'content_block_start', index: 0, content_block: { type: 'text', text: '' } })}\n\n`);
      res.write(`data: ${JSON.stringify({ type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: upstream.candidates[0].content.parts[0].text } })}\n\n`);
      res.write(`data: ${JSON.stringify({ type: 'content_block_stop', index: 0 })}\n\n`);
      res.write(`data: ${JSON.stringify({ type: 'message_delta', delta: { stop_reason: 'end_turn' } })}\n\n`);
      res.write(`data: ${JSON.stringify({ type: 'message_stop' })}\n\n`);
      return res.end();
    }

    const anthropic = convertGoogleToAnthropic(upstream, model);
    res.json(anthropic);
  } catch (e) {
    logger.error('handleMessages', e);
    res.status(500).json({ error: { type: 'api_error', message: e.message } });
  }
}
