import { clearMockResponses, setMockResponse } from '../../../../../end-to-end/mocks/openrouter-test-client';
import type { MockedOpenRouterResponse } from '../../../../../end-to-end/types';
import { initializeAppConfig } from '../../../../model/config';
import { runParallelTests } from '../run-parallel-tests';

const originalMcpE2eTest = process.env.MCP_E2E_TEST;

function createMockResponse(content: string): MockedOpenRouterResponse {
    return {
        choices: [
            {
                message: {
                    content,
                },
            },
        ],
        model: 'claude-3-sonnet',
        usage: {
            total_tokens: 85,
        },
    };
}

beforeAll(() => {
    process.env.MCP_E2E_TEST = 'true';
    initializeAppConfig();
});

afterAll(() => {
    if (originalMcpE2eTest === undefined) {
        delete process.env.MCP_E2E_TEST;
    } else {
        process.env.MCP_E2E_TEST = originalMcpE2eTest;
    }
    initializeAppConfig();
});

describe('runParallelTests', () => {
    beforeEach(() => {
        clearMockResponses();
    });

    it('должен выполнить параллельное тестирование промпта', async () => {
        const successfulResponses = ['Ответ 1', 'Ответ 2', 'Ответ 3', 'Анализ ответов'];

        successfulResponses.forEach((message: string) => {
            const mockResponse = createMockResponse(message);

            setMockResponse(mockResponse);
        });

        const params = {
            context: 'Тест параллельного выполнения',
            iterations: 3,
            prompt: 'Объясни что такое рекурсия простыми словами',
            timeout: 30000,
        };

        const result = await runParallelTests(params);

        expect(result).toEqual(
            expect.objectContaining({
                averageResponseTime: expect.any(Number),
                consistency: expect.objectContaining({
                    aiAnalysis: expect.any(String),
                    analysis: expect.any(String),
                    hasAiAnalysis: true,
                    score: expect.any(Number),
                }),
                failedTests: expect.any(Number),
                metadata: expect.objectContaining({
                    duration: expect.any(Number),
                    endTime: expect.any(String),
                    startTime: expect.any(String),
                }),
                results: expect.arrayContaining([
                    expect.objectContaining({
                        content: expect.any(String),
                        duration: expect.any(Number),
                        isSuccess: expect.any(Boolean),
                        iteration: expect.any(Number),
                    }),
                ]),
                success: true,
                successfulTests: expect.any(Number),
                totalTests: 3,
            }),
        );
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
