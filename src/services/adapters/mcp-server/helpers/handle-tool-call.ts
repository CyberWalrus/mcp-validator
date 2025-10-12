import { ZodError } from 'zod';

import { error, info } from '../../../../lib/helpers/logger';
import { formatSchemaError } from '../../../../lib/helpers/schema-error-formatter';
import { runParallelTests } from '../../../workflows/testing/run-parallel-tests';
import { ParallelTestParamsSchema } from '../../../workflows/testing/schemas';
import { ValidationParamsSchema } from '../../../workflows/validation/schemas';
import { validateCode } from '../../../workflows/validation/validate-code';
import { JSON_RPC_ERROR_CODES } from '../constants';
import { MCPToolCallRequestSchema } from '../schemas';
import type { JSONRPCRequest, JSONRPCResponse } from '../types';
import { createMarkdownErrorResponse } from './create-markdown-error-response';
import { formatTestPromptResponse } from './format-test-prompt-response';
import { formatValidationResponse } from './format-validation-response';

/** Обрабатывает tool call запрос */
export async function handleToolCall(request: JSONRPCRequest): Promise<JSONRPCResponse> {
    try {
        const parsedRequest = MCPToolCallRequestSchema.parse(request);
        const { name, arguments: args } = parsedRequest.params;

        info('Вызов инструмента', { id: request.id, name });

        switch (name) {
            case 'validate': {
                const validationParams = ValidationParamsSchema.parse(args);
                const result = await validateCode(validationParams);

                return {
                    id: request.id,
                    jsonrpc: '2.0',
                    result: {
                        content: [
                            {
                                text: formatValidationResponse(result),
                                type: 'text' as const,
                            },
                        ],
                    },
                };
            }

            case 'test-prompt': {
                const testParams = ParallelTestParamsSchema.parse(args);

                // Создаем корректный объект параметров с учетом optional types
                const parallelTestParams = {
                    iterations: testParams.iterations,
                    prompt: testParams.prompt,
                    timeout: testParams.timeout,
                    ...(testParams.context && { context: testParams.context }),
                    ...(testParams.models && { models: testParams.models }),
                };

                const testResult = await runParallelTests(parallelTestParams);

                return {
                    id: request.id,
                    jsonrpc: '2.0',
                    result: {
                        content: [
                            {
                                text: formatTestPromptResponse(testResult),
                                type: 'text' as const,
                            },
                        ],
                    },
                };
            }

            default:
                return createMarkdownErrorResponse(request.id, JSON_RPC_ERROR_CODES.METHOD_NOT_FOUND, 'Tool not found');
        }
    } catch (err) {
        error('Ошибка вызова инструмента', { error: err });

        if (err instanceof ZodError) {
            const friendlyError = formatSchemaError(err);

            return createMarkdownErrorResponse(request.id, JSON_RPC_ERROR_CODES.INVALID_PARAMS, friendlyError);
        }

        const stackTrace = err instanceof Error ? err.stack : String(err);

        return createMarkdownErrorResponse(
            request.id,
            JSON_RPC_ERROR_CODES.INVALID_PARAMS,
            'Invalid tool parameters',
            stackTrace ? { stackTrace } : undefined,
        );
    }
}
