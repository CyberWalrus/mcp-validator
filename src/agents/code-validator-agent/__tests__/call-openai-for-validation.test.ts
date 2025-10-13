import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getConfigOrThrow } from '../../../model/config/get-config-or-throw';
import { callOpenAIForValidation } from '../call-openai-for-validation';
import type { AgentConfig } from '../types';

vi.mock('../../../model/config/get-config-or-throw', () => ({
    getConfigOrThrow: vi.fn(),
}));

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
    });

    it('должен использовать мок клиент в E2E режиме', async () => {
        vi.mocked(getConfigOrThrow).mockReturnValue({
            runtime: {
                isE2ETest: true,
            },
        } as never);

        const mockGetOpenRouterClient = vi.fn().mockResolvedValue(
            vi.fn().mockResolvedValue({
                text: 'Mock validation response',
                tokensUsed: 100,
            }),
        );

        vi.doMock('../../../services/adapters/openrouter/openrouter-client-factory', () => ({
            getOpenRouterClient: mockGetOpenRouterClient,
        }));

        const result = await callOpenAIForValidation(mockAgent, 'test prompt');

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

        vi.mocked(getConfigOrThrow).mockReturnValue({
            model: {
                maxTokens: 4000,
                temperature: 0.1,
            },
            runtime: {
                isE2ETest: false,
            },
        } as never);

        vi.mocked(mockAgent.openai.chat.completions.create).mockResolvedValue(mockResponse as never);

        const result = await callOpenAIForValidation(mockAgent, 'test validation prompt');

        expect(result.responseContent).toBe('Production validation response');
        expect(result.tokensUsed).toBe(250);
    });

    it('должен передать корректные параметры в OpenAI API', async () => {
        vi.mocked(getConfigOrThrow).mockReturnValue({
            model: {
                maxTokens: 4000,
                temperature: 0.1,
            },
            runtime: {
                isE2ETest: false,
            },
        } as never);

        vi.mocked(mockAgent.openai.chat.completions.create).mockResolvedValue({
            choices: [{ message: { content: 'response' } }],
            usage: { total_tokens: 100 },
        } as never);

        const validationPrompt = 'Test validation prompt';
        await callOpenAIForValidation(mockAgent, validationPrompt);

        expect(mockAgent.openai.chat.completions.create).toHaveBeenCalledWith({
            max_tokens: 4000,
            messages: [
                {
                    content: mockAgent.instructions,
                    role: 'system',
                },
                {
                    content: validationPrompt,
                    role: 'user',
                },
            ],
            model: mockAgent.model,
            temperature: 0.1,
        });
    });

    it('должен вернуть пустую строку если ответ отсутствует', async () => {
        vi.mocked(getConfigOrThrow).mockReturnValue({
            model: {
                maxTokens: 4000,
                temperature: 0.1,
            },
            runtime: {
                isE2ETest: false,
            },
        } as never);

        vi.mocked(mockAgent.openai.chat.completions.create).mockResolvedValue({
            choices: [],
            usage: { total_tokens: 0 },
        } as never);

        const result = await callOpenAIForValidation(mockAgent, 'test prompt');

        expect(result.responseContent).toBe('');
        expect(result.tokensUsed).toBe(0);
    });

    it('должен вернуть 0 токенов если usage отсутствует', async () => {
        vi.mocked(getConfigOrThrow).mockReturnValue({
            model: {
                maxTokens: 4000,
                temperature: 0.1,
            },
            runtime: {
                isE2ETest: false,
            },
        } as never);

        vi.mocked(mockAgent.openai.chat.completions.create).mockResolvedValue({
            choices: [{ message: { content: 'response' } }],
        } as never);

        const result = await callOpenAIForValidation(mockAgent, 'test prompt');

        expect(result.tokensUsed).toBe(0);
    });
});
