import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { info } from '../../../lib/helpers/logger';

/** Запускает сервер с stdio транспортом */
export async function startStdioTransport(server: McpServer): Promise<void> {
    info('🔌 Запуск stdio транспорта...');
    const transport = new StdioServerTransport();
    await server.connect(transport);
    info('✅ Stdio транспорт подключен');
}
