import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { AgentConfig } from '../types';

describe('fetchOpenAIForVerification', () => {
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
        vi.doMock('../../../model/config', () => ({
            APP_CONFIG: {
                model: { maxTokens: 4000, temperature: 0.1 },
                runtime: { isE2ETest: true },
            },
        }));

        const mockGetOpenRouterClient = vi.fn().mockResolvedValue(
            vi.fn().mockResolvedValue({
                text: 'Mock verification response',
                tokensUsed: 100,
            }),
        );

        vi.doMock('../../../services/adapters/openrouter/openrouter-client-factory', () => ({
            getOpenRouterClient: mockGetOpenRouterClient,
        }));

        const { fetchOpenAIForVerification } = await import('../call-openai-for-verification');
        const result = await fetchOpenAIForVerification(mockAgent, 'test verification prompt');

        expect(mockGetOpenRouterClient).toHaveBeenCalled();
        expect(result.responseContent).toBe('Mock verification response');
        expect(result.tokensUsed).toBe(100);
    });

    it('должен вызвать OpenAI API в production режиме', async () => {
        const mockResponse = {
            choices: [
                {
                    message: {
                        content: 'Production verification response',
                    },
                },
            ],
            usage: {
                total_tokens: 250,
            },
        };

        vi.doMock('../../../model/config', () => ({
            APP_CONFIG: {
                model: { maxTokens: 4000, temperature: 0.1 },
                runtime: { isE2ETest: false },
            },
        }));

        vi.mocked(mockAgent.openai.chat.completions.create).mockResolvedValue(mockResponse as never);

        const { fetchOpenAIForVerification } = await import('../call-openai-for-verification');
        const result = await fetchOpenAIForVerification(mockAgent, 'test verification prompt');

        expect(result.responseContent).toBe('Production verification response');
        expect(result.tokensUsed).toBe(250);
    });

    it('должен передать корректные параметры в OpenAI API', async () => {
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

        const { fetchOpenAIForVerification } = await import('../call-openai-for-verification');
        await fetchOpenAIForVerification(mockAgent, 'test prompt');

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
});
