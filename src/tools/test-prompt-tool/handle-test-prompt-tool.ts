import { createTestPromptAgent, testPromptWithAgent } from '../../agents/test-prompt-agent';
import type { AgentConfig } from '../../agents/test-prompt-agent/types';
import type { TestPromptInput, TestPromptResult } from '../../model/config';
import { APP_CONFIG } from '../../model/config';
import { renderErrorResponse } from '../../services/adapters/error-handler';
import { formatTestPromptResult } from './format-test-prompt-result';

/** Глобальный кэш агента для повторного использования */
let testPromptAgent: AgentConfig | null = null;

/** Обработчик MCP инструмента test-prompt */
export async function handleTestPromptTool(args: unknown): Promise<{ content: string; isError?: boolean }> {
    try {
        if (args === null || args === undefined || typeof args !== 'object') {
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

        if (params.prompt === null || params.prompt === undefined || typeof params.prompt !== 'string') {
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

        const config = APP_CONFIG;
        const testInput: TestPromptInput = {
            iterations: typeof params.iterations === 'number' ? params.iterations : 5,
            prompt: params.prompt,
            timeout: typeof params.timeout === 'number' ? params.timeout : config.timeouts.apiRequest,
            ...(typeof params.context === 'string' && { context: params.context }),
        };

        if (testPromptAgent === null) {
            testPromptAgent = createTestPromptAgent();
        }

        const result: TestPromptResult = await testPromptWithAgent(testPromptAgent, testInput);

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
