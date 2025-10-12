import { describe, expect, it } from 'vitest';

describe('E2E система моков', () => {
    it('должен экспортировать моки OpenRouter API', async () => {
        const { MockOpenRouterAPI, createMockResponse } = await import('../mocks/openrouter-api-mocks');

        expect(MockOpenRouterAPI).toBeDefined();
        expect(createMockResponse).toBeDefined();
        expect(typeof createMockResponse).toBe('function');
    });

    it('должен экспортировать симулятор MCP клиента', async () => {
        const { createMcpClientSimulator } = await import('../mocks/mcp-client-simulator');
        const { simulateCursorConnection } = await import('../mocks/simulate-cursor-connection');

        expect(createMcpClientSimulator).toBeDefined();
        expect(simulateCursorConnection).toBeDefined();
        expect(typeof createMcpClientSimulator).toBe('function');
        expect(typeof simulateCursorConnection).toBe('function');
    });

    it('должен экспортировать тестовые данные', async () => {
        const { VALIDATION_TEST_CASES, PROMPT_TEST_CASES } = await import('../mocks/test-data');

        expect(VALIDATION_TEST_CASES).toBeDefined();
        expect(PROMPT_TEST_CASES).toBeDefined();
        expect(Array.isArray(VALIDATION_TEST_CASES)).toBe(true);
        expect(Array.isArray(PROMPT_TEST_CASES)).toBe(true);
    });

    it('должен создавать рабочие моки OpenRouter API', async () => {
        const { createMockResponse } = await import('../mocks/openrouter-api-mocks');

        const mockResponse = createMockResponse('Тестовый ответ', 'gpt-4');

        expect(mockResponse.choices).toHaveLength(1);
        expect(mockResponse?.choices[0]?.message?.content).toBe('Тестовый ответ');
        expect(mockResponse.model).toBe('gpt-4');
        expect(typeof mockResponse.usage.total_tokens).toBe('number');
    });
});
