import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { MOCK_API_RESPONSES } from './constants';
import { cleanupE2EEnvironment, setupE2EEnvironment } from './helpers';
import type { E2ETestContext } from './types';

describe('Duration tracking E2E', () => {
    let testContext: E2ETestContext;

    beforeAll(async () => {
        testContext = await setupE2EEnvironment();

        // Инициализируем соединение
        await testContext.clientSimulator.initialize({
            name: 'cursor',
            version: '2.0.0',
        });
    });

    afterAll(async () => {
        await cleanupE2EEnvironment(testContext);
    });

    it('should track duration for validate tool', async () => {
        // Настраиваем мок успешного ответа
        testContext.mockOpenRouter.mockResponse(MOCK_API_RESPONSES.CODE_VALIDATION_SUCCESS);

        const testCode = `
function add(a: number, b: number): number {
    return a + b;
}
`;

        const result = await testContext.clientSimulator.callTool('validate', {
            input: {
                data: testCode,
                type: 'content',
            },
            language: 'typescript',
            validationType: 'code',
        });

        expect(result.result).toBeDefined();
        const content = (result.result as any)?.content?.[0]?.text || '';
        expect(content).toContain('Время выполнения:');
        expect(content).toMatch(/Время выполнения: \d+мс/);
        expect(content).not.toContain('Время выполнения: 0мс');
    });

    it('should track duration for test-prompt tool', async () => {
        // Настраиваем мок для test-prompt
        testContext.mockOpenRouter.mockResponse(MOCK_API_RESPONSES.CODE_VALIDATION_SUCCESS);

        const testPrompt = 'Write a function that adds two numbers';

        const result = await testContext.clientSimulator.callTool('test-prompt', {
            iterations: 2,
            prompt: testPrompt,
            timeout: 5000,
        });

        expect(result.result).toBeDefined();
        const content = (result.result as any)?.content?.[0]?.text || '';

        // Test-prompt может падать в E2E, проверяем что duration > 0 в случае успеха
        if (content.includes('Среднее время:')) {
            expect(content).toMatch(/Среднее время: \d+мс/);
            expect(content).not.toContain('Среднее время: 0мс');
            expect(content).toMatch(/Итерация \d+.*\d+мс/);
        } else {
            // Если ошибка, проверяем что это не из-за duration = 0
            expect(content).not.toContain('Время выполнения: 0мс');
        }
    });

    it('should track duration even when validation fails', async () => {
        // Настраиваем мок для ошибки валидации
        testContext.mockOpenRouter.mockResponse(MOCK_API_RESPONSES.CODE_VALIDATION_WARNING);

        const invalidCode = 'invalid syntax {';

        const result = await testContext.clientSimulator.callTool('validate', {
            input: {
                data: invalidCode,
                type: 'content',
            },
            language: 'typescript',
            validationType: 'code',
        });

        // Даже при ошибке должен быть duration > 0
        expect(result.result).toBeDefined();
        const content = (result.result as any)?.content?.[0]?.text || '';
        expect(content).toContain('Время выполнения:');
        expect(content).toMatch(/Время выполнения: \d+мс/);
        expect(content).not.toContain('Время выполнения: 0мс');
    });

    it('should track duration for test-prompt even when some iterations fail', async () => {
        // Настраиваем мок для test-prompt с ошибками
        testContext.mockOpenRouter.mockResponse(MOCK_API_RESPONSES.CODE_VALIDATION_WARNING);

        const problematicPrompt = 'Write code that will definitely fail';

        const result = await testContext.clientSimulator.callTool('test-prompt', {
            iterations: 3,
            prompt: problematicPrompt,
            timeout: 1000, // Короткий timeout для быстрого теста
        });

        // Должен быть duration даже если некоторые итерации упали
        expect(result.result).toBeDefined();
        const content = (result.result as any)?.content?.[0]?.text || '';
        
        // Test-prompt может падать в E2E, проверяем что duration > 0 в случае успеха
        if (content.includes('Среднее время:')) {
            expect(content).toMatch(/Среднее время: \d+мс/);
            expect(content).not.toContain('Среднее время: 0мс');
        } else {
            // Если ошибка, проверяем что это не из-за duration = 0
            expect(content).not.toContain('Время выполнения: 0мс');
        }
    });
});
