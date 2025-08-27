import 'dotenv/config';
import { MCPClient } from "@mastra/mcp";

// Ensure required environment variables are present
const { MUX_TOKEN_ID, MUX_TOKEN_SECRET, MUX_BASE_URL } = process.env;
if (!MUX_TOKEN_ID || !MUX_TOKEN_SECRET) {
  throw new Error("Missing Mux credentials. Please set MUX_TOKEN_ID and MUX_TOKEN_SECRET in your environment.");
}

// Configure MCPClient to connect to your server(s)
export const mcp = new MCPClient({
        servers: {
            mux: {
                command: 'npx',
                args: ['-y', '@mux/mcp@latest', '--client=claude', '--tools=dynamic'],
                env: {
        MUX_TOKEN_ID: MUX_TOKEN_ID,
        MUX_TOKEN_SECRET: MUX_TOKEN_SECRET,
                  // Optionally pass base URL if you need to override it
                  // Only include if set to avoid sending "undefined"
                  ...(MUX_BASE_URL ? { MUX_BASE_URL } : {})
                }
            }
  }
});