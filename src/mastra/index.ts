import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { muxAgent } from './agents';
import { muxVideoInsightsWorkflow } from './workflows';

export const mastra = new Mastra({
  workflows: { muxVideoInsightsWorkflow },
  agents: { muxAgent },
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});