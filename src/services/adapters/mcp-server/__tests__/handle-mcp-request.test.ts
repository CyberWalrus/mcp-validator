import type { MockInstance } from 'vitest';

import type { ValidationParams, ValidationResponse } from '../../../workflows/validation/types';
import type { JSONRPCRequest, JSONRPCResponse } from '../types';

describe('handleMCPRequest', () => {
    let handleMCPRequest: (request: JSONRPCRequest) => Promise<JSONRPCResponse>;
    let validateCodeSpy: MockInstance<(params: ValidationParams) => Promise<ValidationResponse>>;

    beforeEach(async () => {
        vi.clearAllMocks();
        vi.resetModules();

        const validationModule = await import('../../../workflows/validation/validate-code');
        validateCodeSpy = vi.spyOn(validationModule, 'validateCode');
        validateCodeSpy.mockResolvedValue({
            duration: 1000,
            issues: ['Пример проблемы'],
            metadata: {
                additionalFilesCount: 0,
                detectedLanguage: 'javascript',
                fullResponse: '# 🔧 Анализ качества кода\n\n**Оценка:** 75/100\n**Статус:** ⚠️ Требует улучшений',
                model: 'claude-3-sonnet',
            },
            promptUsed: 'Test prompt',
            score: 75,
            success: false,
            tokensUsed: 150,
            type: 'code',
        });

        ({ handleMCPRequest } = await import('../handle-mcp-request'));
    });

    afterEach(() => {
        validateCodeSpy.mockRestore();
    });

    it('должен обрабатывать initialize запрос', async () => {
        const request = {
            id: '1',
            jsonrpc: '2.0' as const,
            method: 'initialize' as const,
            params: {
                capabilities: {},
                clientInfo: {
                    name: 'test-client',
                    version: '2.0.0',
                },
                protocolVersion: '2024-11-05',
            },
        };

        const result = await handleMCPRequest(request);

        expect(result).toEqual({
            id: '1',
            jsonrpc: '2.0',
            result: {
                capabilities: {
                    tools: {
                        'test-prompt': expect.any(Object),
                        validate: expect.any(Object),
                    },
                },
                protocolVersion: '2024-11-05',
                serverInfo: {
                    name: 'mcp-validator',
                    version: '2.0.0',
                },
            },
        });
    });

    it('должен обрабатывать validate tool запрос', async () => {
        const request = {
            id: '2',
            jsonrpc: '2.0' as const,
            method: 'tools/call' as const,
            params: {
                arguments: {
                    input: {
                        data: 'function test() { return "hello"; }',
                        type: 'content',
                    },
                    validationType: 'code',
                },
                name: 'validate',
            },
        };

        const result = await handleMCPRequest(request);

        expect(result).toEqual({
            id: '2',
            jsonrpc: '2.0',
            result: expect.objectContaining({
                content: expect.arrayContaining([
                    expect.objectContaining({
                        text: expect.any(String),
                        type: 'text',
                    }),
                ]),
            }),
        });

        expect(validateCodeSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                input: expect.objectContaining({
                    data: 'function test() { return "hello"; }',
                    type: 'content',
                }),
                validationType: 'code',
            }),
        );
    });

    it('должен возвращать ошибку для неизвестного метода', async () => {
        const request = {
            id: '3',
            jsonrpc: '2.0' as const,
            method: 'unknown' as const,
        };

        const result = await handleMCPRequest(request);

        expect(result.jsonrpc).toBe('2.0');
        expect(result.id).toBe('3');
        expect(result.result).toBeDefined();
        const resultData = result.result as { content: Array<{ text: string; type: string }> };
        expect(resultData.content).toHaveLength(1);
        expect(resultData.content?.[0]?.type).toBe('text');
        expect(resultData.content?.[0]?.text).toContain('# ⚠️ Ошибка системы');
        expect(resultData.content?.[0]?.text).toContain('Method not found');
        expect(resultData.content?.[0]?.text).toContain('-32601');
    });
});
