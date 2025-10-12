import { APP_CONFIG } from '../../src/model/config/env-config';
import type { MCPTestClient } from '../types';
import { createMcpClientSimulator } from './mcp-client-simulator';

/** Симулирует подключение Cursor к MCP серверу */
export function simulateCursorConnection(): Promise<MCPTestClient> {
    const config = APP_CONFIG;
    
    if (!config.runtime.isE2ETest) {
        throw new Error('simulateCursorConnection может использоваться только в E2E тестовом режиме');
    }

    return Promise.resolve(createMcpClientSimulator());
}
