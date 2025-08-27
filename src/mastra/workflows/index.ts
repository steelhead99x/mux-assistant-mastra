import { z } from 'zod';
import { createStep, createWorkflow } from '@mastra/core/workflows';
import { muxAgent } from '../agents';

// Step: ask the agent (with MCP tools) for video info
const getVideoInfo = createStep({
    id: 'get-video-info',
    description: 'Fetch Mux video info (asset or playback) using MCP tools via the agent',
    inputSchema: z.object({
        identifierType: z.enum(['asset', 'playback']).describe('Whether the identifier is an asset ID or a playback ID'),
        identifier: z.string().min(1).describe('Asset ID or Playback ID'),
    }),
    outputSchema: z.object({
        infoText: z.string(),
    }),
    execute: async ({ inputData }) => {
        const prompt = `
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
        const res = await muxAgent.generate([{ role: 'user', content: prompt }]);
        return { infoText: res.text };
    },
});

// Step: optionally fetch analytics
const getVideoAnalytics = createStep({
    id: 'get-video-analytics',
    description: 'Fetch analytics for a Mux video using MCP tools via the agent',
    inputSchema: z.object({
        identifierType: z.enum(['asset', 'playback']).describe('Whether the identifier is an asset ID or a playback ID'),
        identifier: z.string().min(1).describe('Asset ID or Playback ID'),
        dateRange: z
            .object({
                start: z.string().describe('ISO date start (e.g., 2024-01-01)'),
                end: z.string().describe('ISO date end (e.g., 2024-01-31)'),
            })
            .optional(),
    }),
    outputSchema: z.object({
        analyticsText: z.string(),
    }),
    execute: async ({ inputData }) => {
        const dateRangePart = inputData.dateRange
            ? `Date range: ${inputData.dateRange.start} to ${inputData.dateRange.end}`
            : 'Date range: default or recent period';
        const prompt = `
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
        const res = await muxAgent.generate([{ role: 'user', content: prompt }]);
        return { analyticsText: res.text };
    },
});

// Workflow: video insights (info + optional analytics)
export const muxVideoInsightsWorkflow = createWorkflow({
    id: 'mux-video-insights',
    inputSchema: z.object({
        identifierType: z.enum(['asset', 'playback']),
        identifier: z.string().min(1),
        includeAnalytics: z.boolean().default(false),
        dateRange: z
            .object({
                start: z.string().describe('ISO date start'),
                end: z.string().describe('ISO date end'),
            })
            .optional(),
    }),
    outputSchema: z.object({
        infoText: z.string(),
        analyticsText: z.string().optional(),
    }),
})
    .then(getVideoInfo)
    .optionalThen({
        id: 'maybe-analytics',
        when: ({ inputData }) => inputData?.includeAnalytics === true,
        step: getVideoAnalytics,
        // map inputs from workflow input into this step
        mapInput: ({ inputData }) => ({
            identifierType: inputData!.identifierType,
            identifier: inputData!.identifier,
            dateRange: inputData!.dateRange,
        }),
        // merge outputs
        mapOutput: ({ previousOutput, stepOutput }) => ({
            infoText: previousOutput!.infoText,
            analyticsText: stepOutput.analyticsText,
        }),
    });

muxVideoInsightsWorkflow.commit();