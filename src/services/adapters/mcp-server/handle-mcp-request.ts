import { error, info } from '../../../lib/helpers/logger';
import { createMarkdownErrorResponse } from './helpers/create-markdown-error-response';
import { handleInitialize } from './helpers/handle-initialize';
import { handleToolCall } from './helpers/handle-tool-call';
import { handleToolsList } from './helpers/handle-tools-list';
import { JSON_RPC_ERROR_CODES } from './constants';
import { JSONRPCRequestSchema } from './schemas';
import type { JSONRPCRequest, JSONRPCResponse, MCPRequest } from './types';

/** Обрабатывает MCP запрос и возвращает соответствующий ответ */
export async function handleMCPRequest(request: MCPRequest): Promise<JSONRPCResponse> {
    try {
        info('Получен MCP запрос', { id: request.id, method: request.method });

        const parsedRequest = JSONRPCRequestSchema.parse(request);

        switch (parsedRequest.method) {
            case 'initialize':
                return handleInitialize(request as JSONRPCRequest);

            case 'notifications/initialized':
                // Notifications не требуют ответа согласно JSON-RPC 2.0
                info('Получено уведомление об инициализации', { id: request.id });

                return { id: request.id, jsonrpc: '2.0', result: null };

            case 'tools/list':
                return handleToolsList(request as JSONRPCRequest);

            case 'tools/call':
                return await handleToolCall(request as JSONRPCRequest);

            default:
                return createMarkdownErrorResponse(
                    request.id,
                    JSON_RPC_ERROR_CODES.METHOD_NOT_FOUND,
                    'Method not found',
                );
        }
    } catch (err) {
        error('Ошибка обработки MCP запроса', { error: err, request });

        const stackTrace = err instanceof Error ? err.stack : String(err);

        return createMarkdownErrorResponse(
            request.id,
            JSON_RPC_ERROR_CODES.INTERNAL_ERROR,
            'Internal error',
            stackTrace ? { stackTrace } : undefined,
        );
    }
}
