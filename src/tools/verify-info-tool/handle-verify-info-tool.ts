import { createVerifyInfoAgent, verifyInfoWithAgent } from '../../agents/verify-info-agent';
import type { AgentConfig } from '../../agents/verify-info-agent/types';
import type { VerifyInfoInput } from '../../model/config';
import { renderErrorResponse } from '../../services/adapters/error-handler';
import { formatVerifyInfoResult } from './format-verify-info-result';

/** Глобальный кэш агента */
let verifyInfoAgent: AgentConfig | null = null;

/** Обработчик MCP инструмента verify-info - проверяет информацию через VerifyInfoAgent и возвращает форматированный результат */
export async function handleVerifyInfoTool(args: unknown): Promise<{ content: string; isError?: boolean }> {
    try {
        if (args === null || args === undefined || typeof args !== 'object') {
            const errorResult = renderErrorResponse({
                context: 'Валидация параметров MCP инструмента',
                errorCode: -32602,
                errorDetails: JSON.stringify({ provided: args }),
                errorMessage: 'Отсутствуют параметры для проверки информации',
                errorType: 'validation',
            });

            return {
                content: errorResult.content,
                isError: true,
            };
        }

        const params = args as Record<string, unknown>;

        if (params.input === null || params.input === undefined) {
            const errorResult = renderErrorResponse({
                context: 'Валидация параметров MCP инструмента',
                errorCode: -32602,
                errorDetails: JSON.stringify({ provided: params }),
                errorMessage: 'Отсутствует обязательный параметр input',
                errorType: 'validation',
            });

            return {
                content: errorResult.content,
                isError: true,
            };
        }

        const input = params.input as Record<string, unknown>;
        if (
            typeof input !== 'object' ||
            input.type === null ||
            input.type === undefined ||
            input.data === null ||
            input.data === undefined
        ) {
            const errorResult = renderErrorResponse({
                context: 'Валидация параметров MCP инструмента',
                errorCode: -32602,
                errorDetails: JSON.stringify({ provided: input }),
                errorMessage: 'Параметр input должен содержать type и data',
                errorType: 'validation',
            });

            return {
                content: errorResult.content,
                isError: true,
            };
        }

        const allowedInputTypes = ['content', 'file'];
        if (!allowedInputTypes.includes(input.type as string)) {
            const errorResult = renderErrorResponse({
                context: 'Валидация параметров MCP инструмента',
                errorCode: -32602,
                errorDetails: JSON.stringify({
                    allowed: allowedInputTypes,
                    provided: input.type as string,
                }),
                errorMessage: `Неподдерживаемый тип входных данных: ${input.type as string}. Поддерживаются только content и file`,
                errorType: 'validation',
            });

            return {
                content: errorResult.content,
                isError: true,
            };
        }

        const verifyInput: VerifyInfoInput = {
            input: {
                data: input.data as string,
                encoding: (input.encoding as 'ascii' | 'utf8' | 'utf16le') || 'utf8',
                type: input.type as 'content' | 'file',
            },
            ...(typeof params.context === 'string' && { context: params.context }),
            ...(typeof params.encoding === 'string' && { encoding: params.encoding as 'ascii' | 'utf8' | 'utf16le' }),
        };

        if (verifyInfoAgent === null) {
            verifyInfoAgent = createVerifyInfoAgent();
        }

        const result = await verifyInfoWithAgent(verifyInfoAgent, verifyInput);

        if (result.success) {
            return {
                content: formatVerifyInfoResult(result),
            };
        }

        const errorResult = renderErrorResponse({
            context: 'Проверка информации',
            errorCode: -32603,
            errorMessage: result.error || 'Не удалось выполнить проверку информации',
            errorType: 'system',
        });

        return {
            content: errorResult.success
                ? errorResult.content
                : `# Ошибка проверки информации\n\n${result.error || 'Неизвестная ошибка'}`,
            isError: true,
        };
    } catch (error) {
        const errorResult = renderErrorResponse({
            context: 'Выполнение MCP инструмента verify-info',
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
