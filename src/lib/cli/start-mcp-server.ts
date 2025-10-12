import { reloadAppConfig } from '../../model/config';
import { startMcpServer as startMcpServerCore } from '../../server/mcp-server';
import { error as logError, info } from '../helpers/logger';

/** Запускает MCP сервер в постоянном режиме */
export async function startMcpServer(): Promise<void> {
    try {
        reloadAppConfig();
        info('🚀 Starting MCP Server...');
        await startMcpServerCore();
        info('✅ MCP Server started successfully');
    } catch (error) {
        logError('❌ Failed to start MCP Server:', { error });
        throw error;
    }
}
