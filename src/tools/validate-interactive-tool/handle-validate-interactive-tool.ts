import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import type { ValidationType } from '../../model/config';
import { elicitValidationType } from '../../server/elicitation';
import { renderErrorResponse } from '../../services/adapters/error-handler';
import { handleValidateTool } from '../validate-tool';
import type { ValidateInteractiveParams, ValidateInteractiveResult } from './types';

/** Обработчик MCP инструмента validate-interactive - валидирует с интерактивным уточнением параметров */
async function handleValidateInteractiveTool(
    mcpServer: McpServer,
    params: ValidateInteractiveParams,
): Promise<ValidateInteractiveResult> {
    try {
        const { context, filePath, language, validationType } = params;

        if (filePath === null || filePath === undefined || filePath.trim() === '') {
            const errorResult = renderErrorResponse({
                context: 'Валидация параметров MCP инструмента validate-interactive',
                errorCode: -32602,
                errorDetails: JSON.stringify({ provided: params }),
                errorMessage: 'Отсутствует обязательный параметр filePath',
                errorType: 'validation',
            });

            return {
                content: errorResult.content,
                isError: true,
            };
        }

        let finalValidationType: ValidationType | null = validationType ?? null;

        if (finalValidationType === null) {
            finalValidationType = await elicitValidationType(mcpServer, filePath);

            if (finalValidationType === null) {
                return {
                    content: '# Валидация отменена\n\nПользователь отменил выбор типа валидации.',
                    isError: false,
                };
            }
        }

        return await handleValidateTool({
            context,
            input: {
                data: filePath,
                type: 'file',
            },
            language: language ?? 'typescript',
            validationType: finalValidationType,
        });
    } catch (error) {
        const errorResult = renderErrorResponse({
            context: 'Выполнение MCP инструмента validate-interactive',
            errorCode: -32603,
            errorMessage: error instanceof Error ? error.message : String(error),
            errorType: 'system',
        });

        return {
            content: errorResult.success ? errorResult.content : `# Критическая ошибка\n\n${String(error)}`,
            isError: true,
        };
    }
}

/** Создает обработчик интерактивного инструмента валидации с привязкой к серверу */
export function createValidateInteractiveHandler(
    mcpServer: McpServer,
): (params: ValidateInteractiveParams) => Promise<ValidateInteractiveResult> {
    return async (params: ValidateInteractiveParams): Promise<ValidateInteractiveResult> =>
        handleValidateInteractiveTool(mcpServer, params);
}

export { handleValidateInteractiveTool };
