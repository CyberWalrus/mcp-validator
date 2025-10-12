import type { Tool } from '@modelcontextprotocol/sdk/types.js';

import { createCodeValidatorAgent, validateCodeWithAgent } from '../../agents/code-validator-agent';
import type { ValidationInput, ValidationType } from '../../model/types/main';
import { renderErrorResponse } from '../../services/adapters/error-handler';
import { getCodeValidatorAgent, setCodeValidatorAgent } from './clear-agent-cache';
import { formatSuccessfulValidation } from './format-successful-validation';

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

        if (!params.validationType) {
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
        if (!allowedValidationTypes.includes(params.validationType as string)) {
            const errorResult = renderErrorResponse({
                context: 'Валидация параметров MCP инструмента',
                errorCode: -32602,
                errorDetails: JSON.stringify({
                    allowed: allowedValidationTypes,
                    provided: params.validationType as string,
                }),
                errorMessage: `Неподдерживаемый тип валидации: ${params.validationType as string}`,
                errorType: 'validation',
            });

            return {
                content: errorResult.content,
                isError: true,
            };
        }

        if (!params.input) {
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
        if (typeof input !== 'object' || !input.type || !input.data) {
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

        if (params.validationType === 'custom' && !params.customPrompt) {
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

        const validationInput: ValidationInput = {
            input: {
                data: input.data as string,
                type: input.type as 'content' | 'file' | 'url',
                ...(input.encoding ? { encoding: input.encoding as 'ascii' | 'utf8' | 'utf16le' } : {}),
            } as ValidationInput['input'],
            validationType: params.validationType as ValidationType,
            ...(typeof params.context === 'string' && { context: params.context }),
            ...(typeof params.customPrompt === 'string' && { customPrompt: params.customPrompt }),
            language: typeof params.language === 'string' ? params.language : 'typescript',
        };

        let codeValidatorAgent = getCodeValidatorAgent();
        if (!codeValidatorAgent) {
            codeValidatorAgent = createCodeValidatorAgent();
            setCodeValidatorAgent(codeValidatorAgent);
        }

        const result = await validateCodeWithAgent(codeValidatorAgent, validationInput);

        if (result.success) {
            return {
                content: formatSuccessfulValidation(result),
            };
        }

        const errorResult = renderErrorResponse({
            context: `Валидация типа: ${result.type}`,
            errorCode: -32001,
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

