import OpenAI from 'openai';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ValidationInput } from '../../../model/config';
import type { AgentConfig } from '../types';
import { validateCodeWithAgent } from '../validate-code-with-agent';

vi.mock('../../lib/cache', () => ({
    getPrompt: vi.fn(() => 'Mocked prompt instructions'),
}));

vi.mock('../get-validation-content', () => ({
    getValidationContent: vi.fn(),
}));

vi.mock('../format-validation-prompt', () => ({
    formatValidationPrompt: vi.fn(() => 'Formatted prompt'),
}));

vi.mock('../call-openai-for-validation', () => ({
    callOpenAIForValidation: vi.fn(),
}));

vi.mock('../parse-validation-response', () => ({
    parseValidationResponse: vi.fn(),
}));

describe('validateCodeWithAgent', () => {
    let mockAgent: AgentConfig;
    let mockValidationInput: ValidationInput;

    beforeEach(() => {
        vi.clearAllMocks();

        mockAgent = {
            instructions: '',
            model: 'test-model',
            openai: new OpenAI({ apiKey: 'test-key' }),
        };

        mockValidationInput = {
            input: {
                data: 'test code',
                encoding: 'utf8',
                type: 'content',
            },
            validationType: 'code',
        };
    });

    it('должен возвращать success: true когда API возвращает ответ', async () => {
        const { getValidationContent } = await import('../get-validation-content');
        const { callOpenAIForValidation } = await import('../call-openai-for-validation');
        const { parseValidationResponse } = await import('../parse-validation-response');

        vi.mocked(getValidationContent).mockResolvedValue({
            content: 'test content',
            success: true,
        });

        vi.mocked(callOpenAIForValidation).mockResolvedValue({
            duration: 1000,
            responseContent: 'Оценка: 95/100\n\nВсе отлично!',
            tokensUsed: 500,
        });

        vi.mocked(parseValidationResponse).mockReturnValue({
            issues: [],
            recommendations: 'Оценка: 95/100\n\nВсе отлично!',
            score: 95,
        });

        const result = await validateCodeWithAgent(mockAgent, mockValidationInput);

        expect(result.success).toBe(true);
        expect(result.score).toBe(95);
        expect(result.recommendations).toBe('Оценка: 95/100\n\nВсе отлично!');
    });

    it('должен возвращать success: true даже для низкого score', async () => {
        const { getValidationContent } = await import('../get-validation-content');
        const { callOpenAIForValidation } = await import('../call-openai-for-validation');
        const { parseValidationResponse } = await import('../parse-validation-response');

        vi.mocked(getValidationContent).mockResolvedValue({
            content: 'test content',
            success: true,
        });

        vi.mocked(callOpenAIForValidation).mockResolvedValue({
            duration: 1000,
            responseContent: 'Оценка: 45/100\n\nЕсть проблемы',
            tokensUsed: 500,
        });

        vi.mocked(parseValidationResponse).mockReturnValue({
            issues: [],
            recommendations: 'Оценка: 45/100\n\nЕсть проблемы',
            score: 45,
        });

        const result = await validateCodeWithAgent(mockAgent, mockValidationInput);

        expect(result.success).toBe(true);
        expect(result.score).toBe(45);
    });

    it('должен возвращать success: true когда score не определен', async () => {
        const { getValidationContent } = await import('../get-validation-content');
        const { callOpenAIForValidation } = await import('../call-openai-for-validation');
        const { parseValidationResponse } = await import('../parse-validation-response');

        vi.mocked(getValidationContent).mockResolvedValue({
            content: 'test content',
            success: true,
        });

        vi.mocked(callOpenAIForValidation).mockResolvedValue({
            duration: 1000,
            responseContent: 'Ответ без оценки',
            tokensUsed: 500,
        });

        vi.mocked(parseValidationResponse).mockReturnValue({
            issues: [],
            recommendations: 'Ответ без оценки',
            score: undefined,
        });

        const result = await validateCodeWithAgent(mockAgent, mockValidationInput);

        expect(result.success).toBe(true);
        expect(result.score).toBeUndefined();
    });

    it('должен возвращать success: false при ошибке получения контента', async () => {
        const { getValidationContent } = await import('../get-validation-content');

        vi.mocked(getValidationContent).mockResolvedValue({
            error: 'Файл не найден',
            success: false,
        });

        const result = await validateCodeWithAgent(mockAgent, mockValidationInput);

        expect(result.success).toBe(false);
        expect(result.issues).toContain('Файл не найден');
    });

    it('должен возвращать success: false при пустом ответе от API', async () => {
        const { getValidationContent } = await import('../get-validation-content');
        const { callOpenAIForValidation } = await import('../call-openai-for-validation');

        vi.mocked(getValidationContent).mockResolvedValue({
            content: 'test content',
            success: true,
        });

        vi.mocked(callOpenAIForValidation).mockResolvedValue({
            duration: 1000,
            responseContent: '',
            tokensUsed: 0,
        });

        const result = await validateCodeWithAgent(mockAgent, mockValidationInput);

        expect(result.success).toBe(false);
        expect(result.issues).toContain('Не удалось получить результат валидации от агента');
    });

    it('должен возвращать success: false при исключении', async () => {
        const { getValidationContent } = await import('../get-validation-content');

        vi.mocked(getValidationContent).mockRejectedValue(new Error('Network error'));

        const result = await validateCodeWithAgent(mockAgent, mockValidationInput);

        expect(result.success).toBe(false);
        expect(result.issues[0]).toContain('Ошибка валидации: Network error');
    });

    it('должен всегда возвращать пустой массив issues при успехе', async () => {
        const { getValidationContent } = await import('../get-validation-content');
        const { callOpenAIForValidation } = await import('../call-openai-for-validation');
        const { parseValidationResponse } = await import('../parse-validation-response');

        vi.mocked(getValidationContent).mockResolvedValue({
            content: 'test content',
            success: true,
        });

        vi.mocked(callOpenAIForValidation).mockResolvedValue({
            duration: 1000,
            responseContent: 'Ответ с проблемами',
            tokensUsed: 500,
        });

        vi.mocked(parseValidationResponse).mockReturnValue({
            issues: [],
            recommendations: 'Ответ с проблемами',
            score: 50,
        });

        const result = await validateCodeWithAgent(mockAgent, mockValidationInput);

        expect(result.issues).toEqual([]);
    });
});
