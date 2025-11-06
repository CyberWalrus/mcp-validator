import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { VerifyInfoInput } from '../../../model/config';
import type { AgentConfig } from '../types';
import { verifyInfoWithAgent } from '../verify-info-with-agent';

vi.mock('../../lib/cache', () => ({
    getPrompt: vi.fn(() => 'Mocked prompt instructions'),
}));

vi.mock('../get-verification-content', () => ({
    getVerificationContent: vi.fn(),
}));

vi.mock('../format-verification-prompt', () => ({
    formatVerificationPrompt: vi.fn(() => 'Formatted prompt'),
}));

vi.mock('../call-openai-for-verification', () => ({
    fetchOpenAIForVerification: vi.fn(),
}));

vi.mock('../combine-verification-results', async () => {
    const actual = await vi.importActual('../combine-verification-results');
    const realFn = (actual as { combineVerificationResults: (checks: unknown[]) => unknown })
        .combineVerificationResults;

    return {
        ...actual,
        combineVerificationResults: vi.fn().mockImplementation(realFn),
    };
});

describe('verifyInfoWithAgent', () => {
    let mockAgent: AgentConfig;
    let mockVerifyInput: VerifyInfoInput;

    beforeEach(() => {
        vi.clearAllMocks();

        mockAgent = {
            instructions: '',
            model: 'test-model',
            openai: {} as never,
        };

        mockVerifyInput = {
            input: {
                data: 'test information',
                encoding: 'utf8',
                type: 'content',
            },
        };
    });

    it('должен вернуть успешный результат когда все проверки выполнены', async () => {
        const { getVerificationContent } = await import('../get-verification-content');
        const { fetchOpenAIForVerification } = await import('../call-openai-for-verification');

        vi.mocked(getVerificationContent).mockResolvedValue({
            content: 'test content',
            success: true,
        });

        vi.mocked(fetchOpenAIForVerification)
            .mockResolvedValueOnce({
                duration: 100,
                responseContent: 'Check 1 result',
                tokensUsed: 50,
            })
            .mockResolvedValueOnce({
                duration: 120,
                responseContent: 'Check 2 result',
                tokensUsed: 60,
            })
            .mockResolvedValueOnce({
                duration: 110,
                responseContent: 'Check 3 result',
                tokensUsed: 55,
            });

        const result = await verifyInfoWithAgent(mockAgent, mockVerifyInput);

        expect(result.success).toBe(true);
        expect(result.overallScore).toBe(100);
        expect(fetchOpenAIForVerification).toHaveBeenCalledTimes(3);
    });

    it('должен вернуть ошибку когда не удалось получить контент', async () => {
        const { getVerificationContent } = await import('../get-verification-content');

        vi.mocked(getVerificationContent).mockResolvedValue({
            error: 'File not found',
            success: false,
        });

        const result = await verifyInfoWithAgent(mockAgent, mockVerifyInput);

        expect(result.success).toBe(false);
        expect(result.error).toBe('File not found');
    });

    it('должен обработать ошибку при выполнении проверок', async () => {
        const { getVerificationContent } = await import('../get-verification-content');
        const { fetchOpenAIForVerification } = await import('../call-openai-for-verification');

        vi.mocked(getVerificationContent).mockResolvedValue({
            content: 'test content',
            success: true,
        });

        vi.mocked(fetchOpenAIForVerification)
            .mockRejectedValueOnce(new Error('API error'))
            .mockRejectedValueOnce(new Error('API error'))
            .mockRejectedValueOnce(new Error('API error'));

        const result = await verifyInfoWithAgent(mockAgent, mockVerifyInput);

        expect(result.success).toBe(false);
        expect(result.error).toBe('Все проверки завершились с ошибками');
        expect(result.checks).toHaveLength(3);
        expect(result.checks?.every((check) => check.isSuccess === false && check.error === 'API error')).toBe(true);
    });

    it('должен обработать пустой ответ от API', async () => {
        const { getVerificationContent } = await import('../get-verification-content');
        const { fetchOpenAIForVerification } = await import('../call-openai-for-verification');
        const { combineVerificationResults } = await import('../combine-verification-results');

        vi.mocked(getVerificationContent).mockResolvedValue({
            content: 'test content',
            success: true,
        });

        vi.mocked(fetchOpenAIForVerification).mockResolvedValue({
            duration: 100,
            responseContent: '',
            tokensUsed: 0,
        });

        vi.mocked(combineVerificationResults).mockReturnValue({
            checks: [],
            combinedReport: 'Report',
            error: 'All checks failed',
            overallScore: 0,
            success: false,
            totalDuration: 300,
            totalTokensUsed: 0,
        });

        const result = await verifyInfoWithAgent(mockAgent, mockVerifyInput);

        expect(result.success).toBe(false);
    });
});
