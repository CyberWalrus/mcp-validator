import type { Tool } from '@modelcontextprotocol/sdk/types.js';

import { createTestPromptAgent, testPromptWithAgent } from '../agents/test-prompt-agent';
import type { TestPromptInput, TestPromptResult } from '../model/types/main';
import { renderErrorResponse } from '../services/adapters/error-handler';

/** Форматирование результата тестирования промпта в markdown */
function formatTestPromptResult(result: TestPromptResult): string {
    const { totalIterations, successfulIterations, averageDuration, consistencyScore, results, summary } = result;

    const successRate = Math.round((successfulIterations / totalIterations) * 100);

    // Определяем общую оценку
    const overallScore = Math.round(successRate * 0.6 + consistencyScore * 0.4);
    let status: string;
    if (overallScore >= 90) {
        status = '✅ Отлично';
    } else if (overallScore >= 70) {
        status = '⚠️ Хорошо';
    } else {
        status = '❌ Требует доработки';
    }

    return `# 🧪 Результаты тестирования промпта

## Общая статистика
- **Статус:** ${status} (${overallScore}/100)
- **Успешных итераций:** ${successfulIterations}/${totalIterations} (${successRate}%)
- **Консистентность ответов:** ${consistencyScore}/100
- **Среднее время ответа:** ${Math.round(averageDuration)}мс

## Детальные результаты

${results
    .map(
        (testResult) => `
### Итерация ${testResult.iteration}
- **Статус:** ${testResult.success ? '✅ Успех' : '❌ Ошибка'}
- **Время:** ${testResult.duration}мс
- **Модель:** ${testResult.model}
${testResult.error ? `- **Ошибка:** ${testResult.error}` : ''}
${testResult.success ? `- **Длина ответа:** ${testResult.content.length} символов` : ''}
`,
    )
    .join('\n')}

## Анализ качества

${summary || 'Анализ недоступен'}

## Рекомендации

${successRate < 80 ? '⚠️ **Стабильность:** Промпт работает нестабильно. Рассмотрите упрощение или уточнение инструкций.' : '✅ **Стабильность:** Промпт работает стабильно.'}

${consistencyScore < 70 ? '⚠️ **Консистентность:** Ответы сильно различаются. Добавьте более четкие ограничения в промпт.' : '✅ **Консистентность:** Ответы предсказуемы и согласованы.'}

${averageDuration > 10000 ? '⚠️ **Производительность:** Медленные ответы. Рассмотрите сокращение сложности промпта.' : '✅ **Производительность:** Быстрые ответы.'}

---

*Параллельное тестирование выполнено через MCP инструмент с AI анализом*
`;
}

/** Глобальный кэш агентов для повторного использования */
let testPromptAgent: ReturnType<typeof createTestPromptAgent> | null = null;

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

        // Подготовка входных параметров с значениями по умолчанию
        const testInput: TestPromptInput = {
            iterations: typeof params.iterations === 'number' ? params.iterations : 5,
            models: Array.isArray(params.models) ? (params.models as string[]) : ['openai/gpt-oss-120b'],
            prompt: params.prompt,
            timeout: typeof params.timeout === 'number' ? params.timeout : 30000,
            ...(typeof params.context === 'string' && { context: params.context }),
        };

        // Инициализация агента при первом использовании
        if (!testPromptAgent) {
            testPromptAgent = createTestPromptAgent();
        }

        // Выполнение параллельного тестирования через агента
        const result = await testPromptWithAgent(testPromptAgent, testInput);

        // Форматирование результата в markdown
        if (result.success) {
            return {
                content: formatTestPromptResult(result),
            };
        }
        // Для неуспешного тестирования используем существующую систему ошибок
        const errorResult = renderErrorResponse({
            context: `Тестирование промпта: ${testInput.iterations} итераций`,
            errorCode: -32001, // Application error (валидация)
            errorMessage: result.error || 'Не удалось выполнить тестирование промпта',
            errorType: 'validation',
        });

        return {
            content: errorResult.success ? errorResult.content : `# Ошибка тестирования\n\n${result.error}`,
            isError: true,
        };
    } catch (error) {
        // Обработка критических ошибок через существующую систему
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

/** Очистка кэша агентов (для тестирования) */
export function clearTestPromptAgentCache(): void {
    testPromptAgent = null;
}
