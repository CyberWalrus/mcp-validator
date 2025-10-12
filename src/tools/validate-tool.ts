import type { Tool } from '@modelcontextprotocol/sdk/types.js';

import { createCodeValidatorAgent, validateCodeWithAgent } from '../agents/code-validator-agent';
import type { ValidationInput, ValidationResult, ValidationType } from '../model/types/main';
import { renderErrorResponse } from '../services/adapters/error-handler';

/** Форматирование результата как раньше - ответ ИИ + метаданные */
function formatSuccessfulValidation(result: ValidationResult): string {
    const { recommendations, type, metadata } = result;

    // Основной ответ ИИ
    let content = recommendations || 'Ответ ИИ недоступен';

    // Добавляем метаданные в конце
    const modelValue = metadata?.['model'];
    const durationValue = metadata?.['duration'];
    const tokensValue = metadata?.['tokensUsed'];

    const modelStr = typeof modelValue === 'string' ? modelValue : 'openai/gpt-oss-120b';
    const durationStr =
        typeof durationValue === 'number' || typeof durationValue === 'string' ? String(durationValue) : 'н/д';
    const tokensStr = typeof tokensValue === 'number' || typeof tokensValue === 'string' ? String(tokensValue) : 'н/д';

    content += `

---

**Метаданные валидации:**
- Тип: ${type}
- Модель: ${modelStr}
- Время выполнения: ${durationStr}мс
- Токены: ${tokensStr}
`;

    return content;
}

/** Глобальный кэш агентов для повторного использования */
let codeValidatorAgent: ReturnType<typeof createCodeValidatorAgent> | null = null;

/** MCP инструмент для валидации кода через @modelcontextprotocol/sdk */
export const validateTool: Tool = {
    description:
        'Универсальная валидация кода, тестов, архитектуры и других типов контента через AI с детальными отчетами',
    inputSchema: {
        properties: {
            context: {
                description: 'Дополнительный контекст для валидации (опционально)',
                type: 'string',
            },
            customPrompt: {
                description: 'Кастомный промпт (только для validationType=custom)',
                type: 'string',
            },
            input: {
                properties: {
                    data: {
                        description: 'Данные для валидации или путь к файлу',
                        type: 'string',
                    },
                    encoding: {
                        default: 'utf8',
                        description: 'Кодировка файла (опционально)',
                        enum: ['utf8', 'utf16le', 'ascii'],
                        type: 'string',
                    },
                    type: {
                        description: 'Тип входных данных',
                        enum: ['content', 'file', 'url'],
                        type: 'string',
                    },
                },
                required: ['type', 'data'],
                type: 'object',
            },
            language: {
                default: 'typescript',
                description: 'Язык программирования (опционально)',
                type: 'string',
            },
            validationType: {
                description: 'Тип валидации для выполнения',
                enum: [
                    'code',
                    'tests',
                    'architecture',
                    'security',
                    'performance',
                    'documentation',
                    'prompts',
                    'tasks',
                    'custom',
                ],
                type: 'string',
            },
        },
        required: ['validationType', 'input'],
        type: 'object',
    },
    name: 'validate',
};

/** Обработчик MCP инструмента validate */
export async function handleValidateTool(args: unknown): Promise<{ content: string; isError?: boolean }> {
    try {
        // ИСПРАВЛЕНИЕ: Строгая валидация входных параметров для v2.0
        if (!args || typeof args !== 'object') {
            const errorResult = renderErrorResponse({
                context: 'Валидация параметров MCP инструмента',
                errorCode: -32602,
                errorDetails: JSON.stringify({ provided: args }),
                errorMessage: 'Отсутствуют параметры для валидации',
                errorType: 'validation',
            });

            return {
                content: errorResult.content,
                isError: true,
            };
        }

        const params = args as Record<string, unknown>;

        if (!params['validationType']) {
            const errorResult = renderErrorResponse({
                context: 'Валидация параметров MCP инструмента',
                errorCode: -32602,
                errorDetails: JSON.stringify({ provided: params }),
                errorMessage: 'Отсутствует обязательный параметр validationType',
                errorType: 'validation',
            });

            return {
                content: errorResult.content,
                isError: true,
            };
        }

        const allowedValidationTypes = ['code', 'tests', 'architecture', 'documentation', 'prompts'];
        if (!allowedValidationTypes.includes(params['validationType'] as string)) {
            const errorResult = renderErrorResponse({
                context: 'Валидация параметров MCP инструмента',
                errorCode: -32602,
                errorDetails: JSON.stringify({
                    allowed: allowedValidationTypes,
                    provided: params['validationType'] as string,
                }),
                errorMessage: `Неподдерживаемый тип валидации: ${params['validationType'] as string}`,
                errorType: 'validation',
            });

            return {
                content: errorResult.content,
                isError: true,
            };
        }

        if (!params['input']) {
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

        const input = params['input'] as Record<string, unknown>;
        if (typeof input !== 'object' || !input['type'] || !input['data']) {
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

        if (params['validationType'] === 'custom' && !params['customPrompt']) {
            const errorResult = renderErrorResponse({
                context: 'Валидация параметров MCP инструмента',
                errorCode: -32602,
                errorDetails: JSON.stringify({ provided: params }),
                errorMessage: 'Для custom валидации требуется параметр customPrompt',
                errorType: 'validation',
            });

            return {
                content: errorResult.content,
                isError: true,
            };
        }

        // Валидация входных параметров
        const validationInput: ValidationInput = {
            input: {
                data: input['data'] as string,
                type: input['type'] as 'content' | 'file' | 'url',
                ...(input['encoding'] ? { encoding: input['encoding'] as 'ascii' | 'utf8' | 'utf16le' } : {}),
            } as ValidationInput['input'],
            validationType: params['validationType'] as ValidationType,
            ...(typeof params['context'] === 'string' && { context: params['context'] }),
            ...(typeof params['customPrompt'] === 'string' && { customPrompt: params['customPrompt'] }),
            language: typeof params['language'] === 'string' ? params['language'] : 'typescript',
        };

        // Инициализация агента при первом использовании
        if (!codeValidatorAgent) {
            codeValidatorAgent = createCodeValidatorAgent();
        }

        // Выполнение валидации через агента
        const result = await validateCodeWithAgent(codeValidatorAgent, validationInput);

        // Форматирование успешного результата в markdown
        if (result.success) {
            return {
                content: formatSuccessfulValidation(result),
            };
        }
        // Для неуспешной валидации используем существующую функцию форматирования ошибок
        const errorResult = renderErrorResponse({
            context: `Валидация типа: ${result.type}`,
            errorCode: -32001, // Application error (валидация)
            errorMessage: result.issues.join('; '),
            errorType: 'validation',
        });

        if (!errorResult.success) {
            throw new Error(errorResult.error || 'Ошибка форматирования результата');
        }

        return {
            content: errorResult.content,
            isError: true,
        };
    } catch (error) {
        // Обработка критических ошибок через существующую систему
        const errorResult = renderErrorResponse({
            context: 'Выполнение MCP инструмента validate',
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
export function clearAgentCache(): void {
    codeValidatorAgent = null;
}
