import { anthropic } from '@ai-sdk/anthropic';
import { Agent } from '@mastra/core/agent';
import { mcp } from '../tools';

// Fetch executable tools from the MCP client
const muxTools = await mcp.getTools();

// Replace Weather Agent with a Mux AI Assist agent that uses the MCP tools
export const muxAgent = new Agent({
    name: 'Mux AI Assist',
    instructions: `
You are a helpful assistant for Mux. You can:
- Fetch video details (status, duration, playback IDs, etc.)
- Fetch analytics and performance metrics for videos

When users ask for video info or analytics:
- Confirm what identifier they have (e.g., asset ID, playback ID)
- Use the MCP Mux tools to retrieve the data
- Summarize results clearly. Include key fields like title/name, duration, created date, playback ID(s), and relevant analytics KPIs.
- If a query needs more context (time range, filters), ask for it before running analytics.
`,
    model: anthropic('claude-3-7-sonnet-20250219'),
    tools: muxTools, // <-- executable tools, not the MCP client
});