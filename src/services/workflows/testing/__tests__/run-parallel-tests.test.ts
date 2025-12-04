import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { initializeAppConfig } from '../../../../model/config';
import { runParallelTests } from '../run-parallel-tests';

const mockOpenRouterResponse = {
    duration: 100,
    model: 'claude-3-sonnet',
    text: 'Тестовый ответ от AI',
    tokensUsed: 85,
};

vi.mock('../../../adapters/openrouter', () => ({
    getOpenRouterClient: vi.fn().mockResolvedValue(vi.fn().mockResolvedValue(mockOpenRouterResponse)),
}));

beforeAll(() => {
    initializeAppConfig();
});

describe('runParallelTests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('должен выполнить параллельное тестирование промпта', async () => {
        const params = {
            context: 'Тест параллельного выполнения',
            iterations: 3,
            prompt: 'Объясни что такое рекурсия простыми словами',
            timeout: 30_000,
        };

        const result = await runParallelTests(params);

        expect(result.totalTests).toBe(3);
        expect(result.metadata).toBeDefined();
        expect(result.metadata.duration).toBeGreaterThanOrEqual(0);
    });

    it('должен обрабатывать ошибки при параллельном тестировании', async () => {
        const params = {
            iterations: 3,
            prompt: 'Тестовый промпт',
            timeout: 1,
        };

        const result = await runParallelTests(params);

        expect(result.success).toBe(false);
        expect(result.failedTests).toBeGreaterThan(0);
    });

    it('должен валидировать входные параметры', async () => {
        const invalidParams = {
            iterations: 15,
            prompt: '',
        };

        const result = await runParallelTests(invalidParams as never);

        expect(result.success).toBe(false);
        expect(result.consistency.analysis).toContain('Ошибка выполнения тестирования');
    });
});
