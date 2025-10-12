import { error, info } from '../../../../lib/helpers/logger';
import { JSON_RPC_ERROR_CODES, MCP_PROTOCOL_VERSION, MCP_SERVER_INFO, MCP_TOOLS } from '../constants';
import { MCPInitializeRequestSchema } from '../schemas';
import type { JSONRPCRequest, JSONRPCResponse } from '../types';
import { createMarkdownErrorResponse } from './create-markdown-error-response';

/** Обрабатывает initialize запрос */
export function handleInitialize(request: JSONRPCRequest): JSONRPCResponse {
    try {
        const parsedRequest = MCPInitializeRequestSchema.parse(request);

        info('Инициализация MCP сервера', {
            clientInfo: parsedRequest.params.clientInfo,
            protocolVersion: parsedRequest.params.protocolVersion,
        });

        return {
            id: request.id,
            jsonrpc: '2.0',
            result: {
                capabilities: {
                    tools: MCP_TOOLS,
                },
                protocolVersion: MCP_PROTOCOL_VERSION,
                serverInfo: MCP_SERVER_INFO,
            },
        };
    } catch (err) {
        error('Ошибка инициализации', { error: err });

        const stackTrace = err instanceof Error ? err.stack : String(err);

        return createMarkdownErrorResponse(
            request.id,
            JSON_RPC_ERROR_CODES.INVALID_PARAMS,
            'Invalid parameters',
            stackTrace ? { stackTrace } : undefined,
        );
    }
}
