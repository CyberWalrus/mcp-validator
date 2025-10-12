import { reloadAppConfig } from '../../model/config';
import { initializeMCPServer } from '../../services/adapters/mcp-server';
import { error as logError, info } from '../helpers/logger';

/**
 * Запускает MCP сервер
 * @returns {void}
 */
export function startMcpServer(): void {
    try {
        reloadAppConfig();
        info('🚀 Starting MCP Server...');
        initializeMCPServer();
        info('✅ MCP Server started successfully');
    } catch (error) {
        logError('❌ Failed to start MCP Server:', { error });
        throw error;
    }
}
