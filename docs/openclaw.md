# Using with OpenClaw / ClawdBot

Configure OpenClaw to use this proxy:

```json
{
  "models": {
    "mode": "merge",
    "providers": {
      "antigravity-proxy": {
        "baseUrl": "http://127.0.0.1:8080",
        "apiKey": "test",
        "api": "anthropic-messages",
        "models": [
          { "id": "gemini-3-flash", "name": "Gemini 3 Flash", "reasoning": true },
          { "id": "claude-sonnet-4-6-thinking", "name": "Claude Sonnet 4.6 Thinking", "reasoning": true }
        ]
      }
    }
  }
}
```

Use `127.0.0.1` instead of `localhost`. Start proxy then OpenClaw gateway.
