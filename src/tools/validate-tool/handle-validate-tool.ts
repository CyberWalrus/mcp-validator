import { createCodeValidatorAgent, validateCodeWithAgent } from '../../agents/code-validator-agent';
import type { AgentConfig } from '../../agents/code-validator-agent/types';
import type { ValidationInput, ValidationResult, ValidationType } from '../../model/config';
import { renderErrorResponse } from '../../services/adapters/error-handler';
import { formatSuccessfulValidation } from './format-successful-validation';

/** Глобальный кэш агента */
let codeValidatorAgent: AgentConfig | null = null;

/** Обработчик MCP инструмента validate - валидирует код через CodeValidatorAgent и возвращает форматированный результат */
export async function handleValidateTool(args: unknown): Promise<{ content: string; isError?: boolean }> {
    try {
        if (args === null || args === undefined || typeof args !== 'object') {
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

        if (params.validationType === null || params.validationType === undefined) {
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
        if (allowedValidationTypes.includes(params.validationType as string) === false) {
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

        if (params.validationType === 'custom' && (params.customPrompt === null || params.customPrompt === undefined)) {
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

        if (codeValidatorAgent === null) {
            codeValidatorAgent = createCodeValidatorAgent();
        }

        const result: ValidationResult = await validateCodeWithAgent(codeValidatorAgent, validationInput);

        if (result.success) {
            return {
                content: formatSuccessfulValidation(result),
            };
        }

        const errorResult = renderErrorResponse({
            context: `Валидация типа: ${result.type}`,
            errorCode: -32603,
            errorMessage: result.issues.join('; '),
            errorType: 'system',
        });

        return {
            content: errorResult.success ? errorResult.content : `# Ошибка валидации\n\n${result.issues.join('\n')}`,
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
