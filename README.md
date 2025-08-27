# Mux MCP Agent Template

A starter template for building an AI assistant that connects to Mux through the Model Context Protocol (MCP) using the Mastra framework. The agent can fetch video asset details, playback information, and analytics—then summarize results for users in natural language.

Planned future expansion: Browserbase integration for safe, automated headful browsing tasks (e.g., authenticated dashboards, visual checks).

## Features

- MCP-powered tools for Mux (assets, playback, analytics)
- AI agent orchestration with Mastra
- Clear, structured responses for video insights
- Extensible design to add more MCP servers and tools
- Future-ready: Browserbase integration path

## Prerequisites

- Node.js 18+ (recommended)
- npm (package manager)
- Mux account with API credentials

## Quick Start

1. Copy environment variables:
    - Duplicate `.env.example` to `.env`
    - Fill in the required values (see below)

2. Install dependencies:
    - `npm install`

3. Run the development server:
    - `npm run dev`

4. Build and run (optional):
    - `npm run build`
    - `npm start`

## Environment Variables

Required:
- `MUX_TOKEN_ID` — Your Mux access token ID
- `MUX_TOKEN_SECRET` — Your Mux access token secret

Optional:
- `MUX_BASE_URL` — Override the default Mux API base URL if needed
- `ANTHROPIC_API_KEY` — Required if you’re using Anthropic models via `@ai-sdk/anthropic`

Tip: Never commit real credentials. Use `.env` and a secrets manager for production.

## What You Can Ask The Agent

- “Get the status and duration of asset ASSET_ID.”
- “List playback IDs for asset ASSET_ID.”
- “Show playback performance for the past 7 days.”
- “Summarize key analytics KPIs for VIDEO_ID between 2025-07-01 and 2025-07-31.”
- “Which playback ID is most used for ASSET_ID?”

The agent will:
- Confirm identifiers (asset ID, playback ID) and time ranges
- Call MCP tools for Mux
- Return a concise summary with key fields (title/name, duration, created date, playback IDs, analytics KPIs)

## Project Structure (High Level)

- Agent definition and orchestration with Mastra
- MCP client configuration to connect to the Mux MCP server
- Tool execution via MCP (dynamic tools exposed by the Mux server)

## Future: Browserbase Integration

We plan to add Browserbase for:
- Headful session workflows (secure, ephemeral browsing)
- Visual verification of dashboards and reports
- Authenticated flows that complement API-based analytics

This will enable richer, end-to-end analysis workflows that combine Mux API data with in-browser checks.

## Troubleshooting

- “Missing Mux credentials” error:
    - Ensure `MUX_TOKEN_ID` and `MUX_TOKEN_SECRET` are set in `.env`
- Tool not found:
    - Make sure dependencies are installed and the MCP server is reachable
- Rate limits or auth errors:
    - Verify credentials and organization permissions in Mux

## Contributing

Issues and PRs are welcome. Please include clear descriptions and reproduction steps.

## License

MIT