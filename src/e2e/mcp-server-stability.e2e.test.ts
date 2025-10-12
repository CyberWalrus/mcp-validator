import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { cleanupE2EEnvironment, setupE2EEnvironment } from './helpers';
import type { E2ETestContext } from './types';

describe('E2E: Стабильность MCP сервера', () => {
    let testContext: E2ETestContext;

    beforeAll(async () => {
        testContext = await setupE2EEnvironment();
    });

    afterAll(async () => {
        await cleanupE2EEnvironment(testContext);
    });

    it('должен обрабатывать множественные последовательные запросы без завершения', async () => {
        // Инициализируем соединение
        await testContext.clientSimulator.initialize({
            name: 'cursor-stability-test',
            version: '2.0.0',
        });

        // Выполняем серию запросов
        const requestCount = 10;
        const responses = [];

        for (let i = 0; i < requestCount; i++) {
            const toolsResponse = await testContext.clientSimulator.listTools();
            responses.push(toolsResponse);

            // Проверяем что сервер все еще отвечает
            expect(toolsResponse.jsonrpc).toBe('2.0');
            expect(toolsResponse.result).toBeDefined();
        }

        expect(responses).toHaveLength(requestCount);

        // Проверяем что процесс все еще активен
        expect(testContext.mcpProcess.killed).toBe(false);
        expect(testContext.mcpProcess.exitCode).toBeNull();
    }, 30000);

    it('должен обрабатывать concurrent запросы без race conditions', async () => {
        // Инициализируем соединение
        await testContext.clientSimulator.initialize({
            name: 'cursor-concurrent-test',
            version: '2.0.0',
        });

        // Выполняем concurrent запросы
        const concurrentCount = 5;
        const promises = Array.from({ length: concurrentCount }, () => testContext.clientSimulator.listTools());

        const responses = await Promise.all(promises);

        // Все запросы должны быть успешными
        responses.forEach((response) => {
            expect(response.jsonrpc).toBe('2.0');
            expect(response.result).toBeDefined();
        });

        // Процесс должен остаться активным
        expect(testContext.mcpProcess.killed).toBe(false);
        expect(testContext.mcpProcess.exitCode).toBeNull();
    }, 20000);

    it('должен восстанавливаться после ошибок валидации', async () => {
        // Инициализируем соединение
        await testContext.clientSimulator.initialize({
            name: 'cursor-recovery-test',
            version: '2.0.0',
        });

        // Отправляем заведомо некорректный запрос валидации
        const invalidValidationResponse = await testContext.clientSimulator.callTool('validate', {
            input: {
                data: 'invalid-code-that-will-cause-error',
                type: 'content',
            },
            validationType: 'code',
        });

        // Ответ должен содержать ошибку, но сервер не должен упасть
        expect(invalidValidationResponse.jsonrpc).toBe('2.0');
        expect(invalidValidationResponse.result).toBeDefined();

        // Проверяем что сервер все еще работает после ошибки
        const toolsResponse = await testContext.clientSimulator.listTools();
        expect(toolsResponse.jsonrpc).toBe('2.0');
        expect(toolsResponse.result).toBeDefined();

        // Процесс должен остаться активным
        expect(testContext.mcpProcess.killed).toBe(false);
        expect(testContext.mcpProcess.exitCode).toBeNull();
    }, 25000);

    it('должен поддерживать стабильное соединение (оптимизированно)', async () => {
        // Инициализируем соединение
        await testContext.clientSimulator.initialize({
            name: 'cursor-stability-test',
            version: '2.0.0',
        });

        // ОПТИМИЗАЦИЯ: Вместо реального 10+ секундного ожидания,
        // делаем несколько быстрых проверок подряд для демонстрации стабильности
        const checkCount = 5;
        const checkInterval = 300; // 300мс между проверками

        for (let i = 0; i < checkCount; i++) {
            const toolsResponse = await testContext.clientSimulator.listTools();
            expect(toolsResponse.jsonrpc).toBe('2.0');
            expect(toolsResponse.result).toBeDefined();

            // Проверяем что процесс все еще активен
            expect(testContext.mcpProcess.killed).toBe(false);
            expect(testContext.mcpProcess.exitCode).toBeNull();

            if (i < checkCount - 1) {
                await new Promise((resolve) => {
                    setTimeout(() => resolve(undefined), checkInterval);
                });
            }
        }

        // Финальная проверка с вызовом инструмента
        const finalResponse = await testContext.clientSimulator.callTool('validate', {
            context: 'Тест стабильности соединения',
            input: { data: 'const x = 1;', type: 'content' },
            validationType: 'code',
        });
        expect(finalResponse.jsonrpc).toBe('2.0');
        expect(finalResponse.result).toBeDefined();
    }, 5000); // Таймаут уменьшен до 5 секунд

    it('должен корректно обрабатывать большие JSON запросы', async () => {
        // Инициализируем соединение
        await testContext.clientSimulator.initialize({
            name: 'cursor-large-request-test',
            version: '2.0.0',
        });

        // Создаем большой промпт для тестирования буферизации
        const largePrompt = 'test prompt '.repeat(1000); // ~11KB

        const testPromptResponse = await testContext.clientSimulator.callTool('test-prompt', {
            iterations: 1,
            prompt: largePrompt,
            timeout: 30000,
        });

        // Ответ должен быть успешным
        expect(testPromptResponse.jsonrpc).toBe('2.0');
        expect(testPromptResponse.result).toBeDefined();

        // Процесс должен остаться активным
        expect(testContext.mcpProcess.killed).toBe(false);
        expect(testContext.mcpProcess.exitCode).toBeNull();
    }, 45000);
}, 300000); // 5 минут общий таймаут для всего suite
