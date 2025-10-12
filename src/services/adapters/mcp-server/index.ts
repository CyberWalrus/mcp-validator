/** Фасад модуля MCP сервера - экспортирует только публичные API функции */

export { handleMCPRequest } from './handle-mcp-request';
export { getMCPServerInfo, initializeMCPServer } from './initialize-mcp-server';
export { isShutdownInProgress, shutdownMCPServer } from './shutdown-mcp-server';

// types.ts, schemas.ts, constants.ts остаются приватными для модуля
