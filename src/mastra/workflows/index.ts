import { z } from 'zod';
import { createStep, createWorkflow } from '@mastra/core/workflows';
import { muxAgent } from '../agents';

// Single step: fetch video info and (optionally) analytics
const muxVideoInsightsStep = createStep({
  id: 'mux-video-insights-step',
  description: 'Fetch Mux video info and optionally analytics using MCP tools via the agent',
  inputSchema: z.object({
    identifierType: z.enum(['asset', 'playback']).describe('Whether the identifier is an asset ID or a playback ID'),
    identifier: z.string().min(1).describe('Asset ID or Playback ID'),
    includeAnalytics: z.boolean().default(false),
    dateRange: z
      .object({
        start: z.string().describe('ISO date start (e.g., 2024-01-01)'),
        end: z.string().describe('ISO date end (e.g., 2024-01-31)'),
      })
      .optional(),
  }),
  outputSchema: z.object({
    infoText: z.string(),
    analyticsText: z.string().optional(),
  }),
  execute: async ({ inputData }) => {
    // 1) Get video info
    const infoPrompt = `
Return concise JSON-like details for this Mux video.
Identifier type: ${inputData.identifierType}
Identifier: ${inputData.identifier}

Use the available Mux MCP tools to fetch core details:
- Title/Name (if available)
- Status
- Duration
- Created at
- Playback IDs
- Asset ID
- Any other notable properties

Respond in clear, readable text.
`;
    const infoRes = await muxAgent.generate([{ role: 'user', content: infoPrompt }]);
    const result: { infoText: string; analyticsText?: string } = { infoText: infoRes.text };

    // 2) Optionally get analytics
    if (inputData.includeAnalytics) {
      const dateRangePart = inputData.dateRange
        ? `Date range: ${inputData.dateRange.start} to ${inputData.dateRange.end}`
        : 'Date range: default or recent period';

      const analyticsPrompt = `
Fetch key analytics for this Mux video using MCP tools:
Identifier type: ${inputData.identifierType}
Identifier: ${inputData.identifier}
${dateRangePart}

Include KPIs such as:
- Views/Plays
- Average Watch Time
- Completion Rate (if available)
- Errors or Quality metrics (rebuffering, startup time) if available

Respond in clear, readable text.
`;
      const analyticsRes = await muxAgent.generate([{ role: 'user', content: analyticsPrompt }]);
      result.analyticsText = analyticsRes.text;
    }

    return result;
  },
});

export const muxVideoInsightsWorkflow = createWorkflow({
  id: 'mux-video-insights',
  inputSchema: muxVideoInsightsStep.inputSchema,
  outputSchema: muxVideoInsightsStep.outputSchema,
}).then(muxVideoInsightsStep);

muxVideoInsightsWorkflow.commit();