import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { muxAgent } from './agents';

export const mastra = new Mastra({
    workflows: {},
    agents: { muxAgent },
    logger: new PinoLogger({
        name: 'Mastra',
        level: 'info',
    }),
});