import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { AgentConfig } from '../types';

describe('callOpenAIForValidation', () => {
    const mockAgent: AgentConfig = {
        instructions: 'Test instructions',
        model: 'gpt-4',
        openai: {
            chat: {
                completions: {
                    create: vi.fn(),
                },
            },
        } as never,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetModules();
    });

    it('должен использовать мок клиент в E2E режиме', async () => {
        // Мокируем APP_CONFIG для E2E режима
        vi.doMock('../../../model/config', () => ({
            APP_CONFIG: {
                model: { maxTokens: 4000, temperature: 0.1 },
                runtime: { isE2ETest: true },
            },
        }));

        const mockGetOpenRouterClient = vi.fn().mockResolvedValue(
            vi.fn().mockResolvedValue({
                text: 'Mock validation response',
                tokensUsed: 100,
            }),
        );

        vi.doMock('../../../services/adapters/openrouter/openrouter-client-factory', () => ({
            getOpenRouterClient: mockGetOpenRouterClient,
        }));

        const { callOpenAIForValidation: callOpenAI } = await import('../call-openai-for-validation');
        const result = await callOpenAI(mockAgent, 'test validation prompt');

        expect(mockGetOpenRouterClient).toHaveBeenCalled();
        expect(result.responseContent).toBe('Mock validation response');
        expect(result.tokensUsed).toBe(100);
    });

    it('должен вызвать OpenAI API в production режиме', async () => {
        const mockResponse = {
            choices: [
                {
                    message: {
                        content: 'Production validation response',
                    },
                },
            ],
            usage: {
                total_tokens: 250,
            },
        };

        // Мокируем APP_CONFIG для production режима
        vi.doMock('../../../model/config', () => ({
            APP_CONFIG: {
                model: { maxTokens: 4000, temperature: 0.1 },
                runtime: { isE2ETest: false },
            },
        }));

        vi.mocked(mockAgent.openai.chat.completions.create).mockResolvedValue(mockResponse as never);

        const { callOpenAIForValidation: callOpenAI } = await import('../call-openai-for-validation');
        const result = await callOpenAI(mockAgent, 'test validation prompt');

        expect(result.responseContent).toBe('Production validation response');
        expect(result.tokensUsed).toBe(250);
    });

    it('должен передать корректные параметры в OpenAI API', async () => {
        // Мокируем APP_CONFIG для production режима
        vi.doMock('../../../model/config', () => ({
            APP_CONFIG: {
                model: { maxTokens: 4000, temperature: 0.1 },
                runtime: { isE2ETest: false },
            },
        }));

        vi.mocked(mockAgent.openai.chat.completions.create).mockResolvedValue({
            choices: [{ message: { content: 'response' } }],
            usage: { total_tokens: 100 },
        } as never);

        const { callOpenAIForValidation: callOpenAI } = await import('../call-openai-for-validation');
        await callOpenAI(mockAgent, 'test prompt');

        expect(mockAgent.openai.chat.completions.create).toHaveBeenCalledWith({
            max_tokens: 4000,
            messages: [
                { content: 'Test instructions', role: 'system' },
                { content: 'test prompt', role: 'user' },
            ],
            model: mockAgent.model,
            temperature: 0.1,
        });
    });

    it('должен вернуть пустую строку если ответ отсутствует', async () => {
        // Мокируем APP_CONFIG для production режима
        vi.doMock('../../../model/config', () => ({
            APP_CONFIG: {
                model: { maxTokens: 4000, temperature: 0.1 },
                runtime: { isE2ETest: false },
            },
        }));

        vi.mocked(mockAgent.openai.chat.completions.create).mockResolvedValue({
            choices: [],
            usage: { total_tokens: 0 },
        } as never);

        const { callOpenAIForValidation: callOpenAI } = await import('../call-openai-for-validation');
        const result = await callOpenAI(mockAgent, 'test prompt');

        expect(result.responseContent).toBe('');
        expect(result.tokensUsed).toBe(0);
    });

    it('должен вернуть 0 токенов если usage отсутствует', async () => {
        // Мокируем APP_CONFIG для production режима
        vi.doMock('../../../model/config', () => ({
            APP_CONFIG: {
                model: { maxTokens: 4000, temperature: 0.1 },
                runtime: { isE2ETest: false },
            },
        }));

        vi.mocked(mockAgent.openai.chat.completions.create).mockResolvedValue({
            choices: [{ message: { content: 'response' } }],
        } as never);

        const { callOpenAIForValidation: callOpenAI } = await import('../call-openai-for-validation');
        const result = await callOpenAI(mockAgent, 'test prompt');

        expect(result.responseContent).toBe('response');
        expect(result.tokensUsed).toBe(0);
    });
});
