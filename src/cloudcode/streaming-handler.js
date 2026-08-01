import { streamSSEResponse } from './sse-streamer.js';
export async function handleStreaming(response, res, model) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  for await (const event of streamSSEResponse(response, model)) {
    res.write(`event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`);
  }
  res.end();
}
