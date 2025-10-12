import { info } from '../../../../lib/helpers/logger';
import { MCP_TOOLS } from '../constants';
import type { JSONRPCRequest, JSONRPCResponse } from '../types';

/** Обрабатывает запрос tools/list */
export function handleToolsList(request: JSONRPCRequest): JSONRPCResponse {
    info('Запрос списка инструментов', { id: request.id });

    const tools = Object.keys(MCP_TOOLS).map((toolName) => ({
        description: MCP_TOOLS?.[toolName]?.description,
        inputSchema: MCP_TOOLS?.[toolName]?.inputSchema,
        name: toolName,
    }));

    return {
        id: request.id,
        jsonrpc: '2.0',
        result: {
            tools,
        },
    };
}
