import type { MockInstance } from 'vitest';

import type { ParallelTestParams, ParallelTestResult } from '../../../../workflows/testing/types';
import type { ValidationParams, ValidationResponse } from '../../../../workflows/validation/types';
import type { JSONRPCRequest, JSONRPCResponse } from '../../types';

describe('handleToolCall', () => {
    let handleToolCall: (request: JSONRPCRequest) => Promise<JSONRPCResponse>;
    let infoSpy: MockInstance;
    let errorSpy: MockInstance;
    let validateSpy: MockInstance<(params: ValidationParams) => Promise<ValidationResponse>>;
    let runTestsSpy: MockInstance<(params: ParallelTestParams) => Promise<ParallelTestResult>>;

    beforeEach(async () => {
        vi.clearAllMocks();

        const loggerModule = await import('../../../../../lib/helpers/logger');
        const validationModule = await import('../../../../workflows/validation/validate-code');
        const testingModule = await import('../../../../workflows/testing/run-parallel-tests');

        infoSpy = vi.spyOn(loggerModule, 'info');
        infoSpy.mockImplementation(() => {});
        errorSpy = vi.spyOn(loggerModule, 'error');
        errorSpy.mockImplementation(() => {});
        validateSpy = vi.spyOn(validationModule, 'validateCode');
        validateSpy.mockResolvedValue({
            duration: 0,
            issues: [],
            promptUsed: '',
            score: 100,
            success: true,
            type: 'code' as const,
        });
        runTestsSpy = vi.spyOn(testingModule, 'runParallelTests');
        runTestsSpy.mockResolvedValue({
            averageResponseTime: 0,
            consistency: {
                analysis: '',
                anomalies: [],
                patterns: [],
                recommendations: [],
                score: 0,
            },
            failedTests: 0,
            metadata: {
                duration: 0,
                endTime: '',
                models: [],
                originalPrompt: '',
                startTime: '',
                validatorVersion: '',
            },
            results: [],
            success: true,
            successfulTests: 0,
            totalTests: 0,
        });

        ({ handleToolCall } = await import('../handle-tool-call'));
    });

    afterEach(() => {
        infoSpy.mockRestore();
        errorSpy.mockRestore();
        validateSpy.mockRestore();
        runTestsSpy.mockRestore();
    });

    it('должен обрабатывать вызов инструмента validate', async () => {
        const mockValidationResult = {
            duration: 1500,
            issues: [],
            metadata: {
                fullResponse: '# Validation Result\n✅ Code is valid',
                model: 'claude-3.5-sonnet',
            },
            promptUsed: 'Test validation prompt',
            score: 90,
            success: true,
            type: 'code' as const,
        };

        validateSpy.mockResolvedValue(mockValidationResult);

        const request: JSONRPCRequest = {
            id: 'validate-test',
            jsonrpc: '2.0',
            method: 'tools/call',
            params: {
                arguments: {
                    input: {
                        data: 'const x = 1;',
                        type: 'content',
                    },
                    validationType: 'code',
                },
                name: 'validate',
            },
        };

        const response = await handleToolCall(request);

        expect(response).toEqual({
            id: 'validate-test',
            jsonrpc: '2.0',
            result: {
                content: [
                    {
                        text: expect.stringContaining('# Validation Result'),
                        type: 'text',
                    },
                ],
            },
        });

        expect(validateSpy).toHaveBeenCalledWith({
            additionalFiles: [],
            context: '',
            customPrompt: '',
            input: {
                data: 'const x = 1;',
                encoding: 'utf8',
                type: 'content',
            },
            language: '',
            validationType: 'code',
        });
    });

    it('должен обрабатывать вызов инструмента test-prompt', async () => {
        const mockTestResult = {
            averageResponseTime: 1200,
            consistency: {
                analysis: 'High consistency',
                anomalies: [],
                patterns: ['Stable responses'],
                recommendations: ['Ready for production'],
                score: 85,
            },
            failedTests: 0,
            metadata: {
                duration: 4000,
                endTime: '2024-01-15T10:00:04Z',
                models: ['gpt-4'],
                originalPrompt: 'Test prompt',
                startTime: '2024-01-15T10:00:00Z',
                validatorVersion: '2.0.0',
            },
            results: [],
            success: true,
            successfulTests: 3,
            totalTests: 3,
        };

        runTestsSpy.mockResolvedValue(mockTestResult);

        const request: JSONRPCRequest = {
            id: 'test-prompt-call',
            jsonrpc: '2.0',
            method: 'tools/call',
            params: {
                arguments: {
                    iterations: 3,
                    prompt: 'Test prompt for consistency checking',
                    timeout: 30000,
                },
                name: 'test-prompt',
            },
        };

        const response = await handleToolCall(request);

        expect(response).toEqual({
            id: 'test-prompt-call',
            jsonrpc: '2.0',
            result: {
                content: [
                    {
                        text: expect.stringContaining('🧪 Результат тестирования промпта'),
                        type: 'text',
                    },
                ],
            },
        });

        expect(runTestsSpy).toHaveBeenCalledWith({
            iterations: 3,
            prompt: 'Test prompt for consistency checking',
            timeout: 30000,
        });
    });

    it('должен обрабатывать test-prompt с опциональными параметрами', async () => {
        const mockTestResult = {
            averageResponseTime: 1800,
            consistency: {
                analysis: 'Medium consistency',
                anomalies: ['1 failed test'],
                patterns: [],
                recommendations: ['Improve prompt'],
                score: 70,
            },
            failedTests: 1,
            metadata: {
                duration: 9000,
                endTime: '2024-01-15T14:00:09Z',
                models: ['claude-3.5-sonnet', 'gpt-4'],
                originalPrompt: 'Complex test prompt',
                startTime: '2024-01-15T14:00:00Z',
                validatorVersion: '2.0.0',
            },
            results: [],
            success: true,
            successfulTests: 4,
            totalTests: 5,
        };

        runTestsSpy.mockResolvedValue(mockTestResult);

        const request: JSONRPCRequest = {
            id: 'test-with-options',
            jsonrpc: '2.0',
            method: 'tools/call',
            params: {
                arguments: {
                    context: 'Additional context for testing',
                    iterations: 5,
                    models: ['claude-3.5-sonnet', 'gpt-4'],
                    prompt: 'Complex test prompt',
                    timeout: 45000,
                },
                name: 'test-prompt',
            },
        };

        const response = await handleToolCall(request);

        expect(response.result).toBeDefined();
        expect(runTestsSpy).toHaveBeenCalledWith({
            context: 'Additional context for testing',
            iterations: 5,
            models: ['claude-3.5-sonnet', 'gpt-4'],
            prompt: 'Complex test prompt',
            timeout: 45000,
        });
    });

    it('должен возвращать ошибку для неизвестного инструмента', async () => {
        const request: JSONRPCRequest = {
            id: 'unknown-tool',
            jsonrpc: '2.0',
            method: 'tools/call',
            params: {
                arguments: {},
                name: 'unknown-tool',
            },
        };

        const response = await handleToolCall(request);

        expect(response.jsonrpc).toBe('2.0');
        expect(response.id).toBe('unknown-tool');
        const result = response.result as { content: Array<{ text: string; type: string }> };
        expect(result.content).toHaveLength(1);
        expect(result.content[0]?.type).toBe('text');
        expect(result.content[0]?.text).toContain('# ⚠️ Системная ошибка');
        expect(result.content[0]?.text).toContain('Tool not found');
    });

    it('должен возвращать ошибку для некорректных параметров инструмента', async () => {
        const request: JSONRPCRequest = {
            id: 'invalid-params',
            jsonrpc: '2.0',
            method: 'tools/call',
            params: {
                arguments: {
                    validationType: 'code',
                },
                name: 'validate',
            },
        };

        const response = await handleToolCall(request);

        expect(response.jsonrpc).toBe('2.0');
        expect(response.id).toBe('invalid-params');
        const result = response.result as { content: Array<{ text: string; type: string }> };
        expect(result.content).toHaveLength(1);
        expect(result.content[0]?.type).toBe('text');
        expect(result.content[0]?.text).toContain('# ❌ Ошибка валидации');
        expect(result.content[0]?.text).toContain('Обязательное поле "input" отсутствует');
    });

    it('должен логировать вызовы инструментов', async () => {
        validateSpy.mockResolvedValue({
            duration: 1000,
            issues: [],
            promptUsed: 'Test',
            score: 85,
            success: true,
            type: 'code' as const,
        });

        const request: JSONRPCRequest = {
            id: 'logging-test',
            jsonrpc: '2.0',
            method: 'tools/call',
            params: {
                arguments: {
                    input: {
                        data: 'test',
                        type: 'content',
                    },
                    validationType: 'code',
                },
                name: 'validate',
            },
        };

        await handleToolCall(request);

        expect(infoSpy).toHaveBeenCalledWith('Вызов инструмента', { id: 'logging-test', name: 'validate' });
    });

    it('должен обрабатывать ошибки выполнения инструментов', async () => {
        validateSpy.mockRejectedValue(new Error('Validation failed'));

        const request: JSONRPCRequest = {
            id: 'error-test',
            jsonrpc: '2.0',
            method: 'tools/call',
            params: {
                arguments: {
                    input: {
                        data: 'invalid code',
                        type: 'content',
                    },
                    validationType: 'code',
                },
                name: 'validate',
            },
        };

        const response = await handleToolCall(request);

        const result = response.result as { content: Array<{ text: string; type: string }> };
        expect(result.content).toHaveLength(1);
        expect(result.content[0]?.type).toBe('text');
        expect(result.content[0]?.text).toContain('# ❌ Ошибка валидации');
        expect(result.content[0]?.text).toContain('Invalid tool parameters');
        expect(errorSpy).toHaveBeenCalledWith(
            'Ошибка вызова инструмента',
            expect.objectContaining({
                error: expect.any(Error),
            }),
        );
    });

    it('должен корректно парсить параметры инструментов', async () => {
        validateSpy.mockResolvedValue({
            duration: 800,
            issues: [],
            promptUsed: 'Parse test',
            score: 87,
            success: true,
            type: 'tests',
        });

        const request: JSONRPCRequest = {
            id: 'parse-test',
            jsonrpc: '2.0',
            method: 'tools/call',
            params: {
                arguments: {
                    additionalFiles: ['/path/to/helper'],
                    context: 'Security review context',
                    input: {
                        data: '/path/to/file',
                        encoding: 'utf8',
                        type: 'file',
                    },
                    language: 'javascript',
                    validationType: 'security',
                },
                name: 'validate',
            },
        };

        await handleToolCall(request);

        expect(validateSpy).toHaveBeenCalledWith({
            additionalFiles: ['/path/to/helper'],
            context: 'Security review context',
            customPrompt: '',
            input: {
                data: '/path/to/file',
                encoding: 'utf8',
                type: 'file',
            },
            language: 'javascript',
            validationType: 'security',
        });
    });
});
