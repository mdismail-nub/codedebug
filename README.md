# DebugDeck — AI Code Debugger + Explainer

A premium-looking single-page web app where users can:

- Paste buggy code and error context.
- Use OpenRouter models for AI-powered debugging and explanation.
- Receive actionable fixes and clear root-cause analysis.

## Quick Start

1. Open `index.html` in your browser.
2. Enter your OpenRouter API key (`sk-or-v1-...`).
3. Choose a model (for example `openai/gpt-4o-mini`).
4. Paste code and click **Analyze with AI**.

## Notes

- API key is saved in `localStorage` for convenience.
- Requests are sent directly from browser to OpenRouter endpoint:
  - `https://openrouter.ai/api/v1/chat/completions`
- For production, proxy requests through your backend to protect secrets and enforce usage limits.
