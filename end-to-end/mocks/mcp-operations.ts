import { getConnectionConfig } from './mcp-transport';
import type {
    ClientInfo,
    InitializeResponse,
    MCPRequest,
    ToolCallResponse,
    ToolsListResponse,
} from '../types';

/** Создает операции MCP клиента */
export function createMCPOperations(sendRequest: (request: MCPRequest) => Promise<any>) {
    let requestId = 1;

    /** Инициализировать соединение с MCP сервером */
    async function initialize(clientInfo: ClientInfo): Promise<InitializeResponse> {
        const config = getConnectionConfig();
        
        const request: MCPRequest = {
            id: requestId++,
            jsonrpc: '2.0',
            method: 'initialize',
            params: {
                capabilities: {},
                clientInfo: {
                    ...clientInfo,
                    environment: config.environment,
                },
                protocolVersion: '2024-11-05',
            },
        };

        const response = await sendRequest(request);
        return response as InitializeResponse;
    }

    /** Вызвать инструмент MCP сервера */
    async function callTool(name: string, args: unknown): Promise<ToolCallResponse> {
        const request: MCPRequest = {
            id: requestId++,
            jsonrpc: '2.0',
            method: 'tools/call',
            params: {
                arguments: args,
                name,
            },
        };

        return sendRequest(request);
    }

    /** Получить список доступных инструментов */
    async function listTools(): Promise<ToolsListResponse> {
        const request: MCPRequest = {
            id: requestId++,
            jsonrpc: '2.0',
            method: 'tools/list',
        };

        return sendRequest(request);
    }

    return {
        initialize,
        callTool,
        listTools,
    };
}

