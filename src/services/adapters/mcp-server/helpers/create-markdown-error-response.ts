import { detectErrorType } from '../../error-handler/helpers/error-type-detector';
import { renderErrorResponse } from '../../error-handler/render-error-response';
import type { JSONRPCResponse } from '../types';

/** Создает MCP ответ с markdown ошибкой вместо JSON-RPC ошибки */
export function createMarkdownErrorResponse(
    id: number | string,
    code: number,
    message: string,
    additionalContext?: {
        filePath?: string;
        operation?: string;
        stackTrace?: string;
    },
): JSONRPCResponse {
    try {
        // Определяем тип ошибки по коду
        const errorType = detectErrorType(code);

        // Рендерим markdown ошибку
        const result = renderErrorResponse({
            errorCode: code,
            errorMessage: message,
            errorType,
            ...(additionalContext?.filePath && { filePath: additionalContext.filePath }),
            ...(additionalContext?.operation && { operation: additionalContext.operation }),
            ...(additionalContext?.stackTrace && { stackTrace: additionalContext.stackTrace }),
        });

        // Если рендеринг прошел успешно, возвращаем успешный MCP ответ с markdown
        if (result.success) {
            return {
                id,
                jsonrpc: '2.0',
                result: {
                    content: [
                        {
                            text: result.content,
                            type: 'text' as const,
                        },
                    ],
                },
            };
        }

        // Fallback: если рендеринг не удался, возвращаем базовую markdown ошибку
        return {
            id,
            jsonrpc: '2.0',
            result: {
                content: [
                    {
                        text: `# ⚠️ Ошибка системы\n\n**Код ошибки:** ${code}\n\n**Сообщение:** ${message}\n\n**Детали:** ${result.error || 'Не удалось отрендерить подробное описание ошибки'}`,
                        type: 'text' as const,
                    },
                ],
            },
        };
    } catch {
        // Крайний fallback: простая текстовая ошибка
        return {
            id,
            jsonrpc: '2.0',
            result: {
                content: [
                    {
                        text: `# ⚠️ Критическая ошибка\n\n**Код:** ${code}\n**Сообщение:** ${message}\n\nСистема рендеринга ошибок недоступна.`,
                        type: 'text' as const,
                    },
                ],
            },
        };
    }
}
