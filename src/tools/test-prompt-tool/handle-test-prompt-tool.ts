import type { Tool } from '@modelcontextprotocol/sdk/types.js';

import { createTestPromptAgent, testPromptWithAgent } from '../../agents/test-prompt-agent';
import type { TestPromptInput } from '../../model/types/main';
import { renderErrorResponse } from '../../services/adapters/error-handler';
import { getTestPromptAgent, setTestPromptAgent } from './clear-test-prompt-agent-cache';
import { formatTestPromptResult } from './format-test-prompt-result';

/** MCP инструмент для параллельного тестирования промптов */
export const testPromptTool: Tool = {
    description:
        'Параллельное тестирование промптов на консистентность с 3-10 итерациями для проверки стабильности AI ответов',
    inputSchema: {
        properties: {
            context: {
                description: 'Дополнительный контекст для тестирования (опционально)',
                type: 'string',
            },
            iterations: {
                default: 5,
                description: 'Количество параллельных итераций (по умолчанию 5)',
                maximum: 10,
                minimum: 3,
                type: 'number',
            },
            models: {
                default: ['openai/gpt-oss-120b'],
                description: 'Список моделей для тестирования (опционально)',
                items: {
                    type: 'string',
                },
                type: 'array',
            },
            prompt: {
                description: 'Промпт для тестирования',
                type: 'string',
            },
            timeout: {
                default: 30000,
                description: 'Timeout для каждого запроса в миллисекундах',
                minimum: 1000,
                type: 'number',
            },
        },
        required: ['prompt'],
        type: 'object',
    },
    name: 'test-prompt',
};

/** Обработчик MCP инструмента test-prompt */
export async function handleTestPromptTool(args: unknown): Promise<{ content: string; isError?: boolean }> {
    try {
        if (!args || typeof args !== 'object') {
            const errorResult = renderErrorResponse({
                context: 'Валидация параметров MCP инструмента',
                errorCode: -32602,
                errorMessage: 'Отсутствуют параметры для тестирования промпта',
                errorType: 'validation',
            });

            return {
                content: errorResult.content,
                isError: true,
            };
        }

        const params = args as Record<string, unknown>;

        if (!params.prompt || typeof params.prompt !== 'string') {
            const errorResult = renderErrorResponse({
                context: 'Валидация параметров MCP инструмента',
                errorCode: -32602,
                errorMessage: 'Отсутствует обязательный параметр prompt',
                errorType: 'validation',
            });

            return {
                content: errorResult.content,
                isError: true,
            };
        }

        const testInput: TestPromptInput = {
            iterations: typeof params.iterations === 'number' ? params.iterations : 5,
            models: Array.isArray(params.models) ? (params.models as string[]) : ['openai/gpt-oss-120b'],
            prompt: params.prompt,
            timeout: typeof params.timeout === 'number' ? params.timeout : 30000,
            ...(typeof params.context === 'string' && { context: params.context }),
        };

        let testPromptAgent = getTestPromptAgent();
        if (!testPromptAgent) {
            testPromptAgent = createTestPromptAgent();
            setTestPromptAgent(testPromptAgent);
        }

        const result = await testPromptWithAgent(testPromptAgent, testInput);

        if (result.success) {
            return {
                content: formatTestPromptResult(result),
            };
        }

        const errorResult = renderErrorResponse({
            context: `Тестирование промпта: ${testInput.iterations} итераций`,
            errorCode: -32001,
            errorMessage: result.error || 'Не удалось выполнить тестирование промпта',
            errorType: 'validation',
        });

        return {
            content: errorResult.success ? errorResult.content : `# Ошибка тестирования\n\n${result.error}`,
            isError: true,
        };
    } catch (error) {
        const errorResult = renderErrorResponse({
            context: 'Выполнение MCP инструмента test-prompt',
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
