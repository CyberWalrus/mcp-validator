import type { MCPTestClient } from '../types';
import { createMCPOperations } from './mcp-operations';
import { createMCPTransport } from './mcp-transport';

/** Создает симулятор MCP клиента для тестирования */
export function createMcpClientSimulator(): MCPTestClient {
    const transport = createMCPTransport();
    const operations = createMCPOperations(transport.sendRequest);

    return {
        connectToProcess: transport.connectToProcess,
        sendRequest: transport.sendRequest,
        initialize: operations.initialize,
        callTool: operations.callTool,
        listTools: operations.listTools,
    };
}