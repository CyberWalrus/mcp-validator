import type { JSONRPCResponse } from '../types';

/** Создает JSON-RPC ответ с ошибкой */
export function createErrorResponse(id: number | string, code: number, message: string): JSONRPCResponse {
    return {
        error: {
            code,
            message,
        },
        id,
        jsonrpc: '2.0',
    };
}
