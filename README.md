# Antigravity Claude Proxy

A proxy server that exposes an **Anthropic-compatible API** backed by **Antigravity's Cloud Code**, letting you use Claude and Gemini models with **Claude Code CLI**.

> **⚠️ WARNING:** Google has been issuing ToS violation bans on accounts connected to this proxy. Use at your own risk. Prefer a burner account.

## Quick Start

```bash
npm install
npm start
# or
npx antigravity-claude-proxy@latest start
```

Open http://localhost:8080 for the WebUI.

```bash
acc start          # background
acc stop
acc status
acc ui
acc accounts add
```

## Claude Code Config

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "test",
    "ANTHROPIC_BASE_URL": "http://localhost:8080",
    "ANTHROPIC_MODEL": "claude-sonnet-4-6-thinking"
  }
}
```

## Features

- Multi-account load balancing (hybrid / sticky / round-robin)
- Claude + Gemini models with thinking support
- Streaming SSE, tool use, prompt caching helpers
- Web dashboard, account OAuth, quota tracking
- Headless OAuth support

## Docs

See `docs/` and `CLAUDE.md`.

## License

MIT
