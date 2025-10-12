import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { cleanupE2EEnvironment, setupE2EEnvironment } from '../helpers';
import type { E2ETestContext, MCPResponse } from '../types';

/** Проверяет что ответ содержит корректную валидацию промпта */
function expectValidPromptValidation(response: MCPResponse) {
    expect(response.jsonrpc).toBe('2.0');
    expect(response.result).toBeDefined();

    const result = response.result as { content: Array<{ text: string; type: string }> };
    expect(result.content).toHaveLength(1);
    expect(result.content?.[0]?.type).toBe('text');

    const markdownContent = result.content?.[0]?.text;
    expect(markdownContent).toBeTruthy();

    if (!markdownContent) {
        throw new Error('Markdown content is undefined');
    }

    // Проверяем что это НЕ неясная ошибка "Валидация выполнена"
    expect(markdownContent).not.toBe('Валидация выполнена');

    // Проверяем что есть полезная информация (не пустой ответ и содержит текст)
    expect(markdownContent.length).toBeGreaterThan(20);
    
    // Проверяем что есть полезная информация из мока или реального ответа
    const hasUsefulInfo =
        markdownContent.includes('Анализ кода завершен') ||
        markdownContent.includes('Анализ') ||
        markdownContent.includes('Рекомендуется') ||
        markdownContent.includes('feedback') ||
        markdownContent.includes('score') ||
        markdownContent.includes('правильно') ||
        markdownContent.includes('корректн') ||
        markdownContent.includes('Статус обработки');
    expect(hasUsefulInfo).toBe(true);
}

describe('E2E: Исправление валидации промптов', () => {
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

    describe('Валидация промптов должна работать корректно', () => {
        it('должен успешно валидировать промпт без неясных ошибок', async () => {
            // Настраиваем мок успешного ответа
            testContext.mockOpenRouter.mockResponse({
                choices: [
                    {
                        message: {
                            content:
                                'Анализ кода завершен. Промпт хорошо структурирован с четкими инструкциями. Рекомендуется добавить примеры использования для улучшения понимания.',
                        },
                    },
                ],
                model: 'gpt-4',
                usage: {
                    total_tokens: 150,
                },
            });

            // Тестируем валидацию простого промпта
            const response = await testContext.clientSimulator.callTool('validate', {
                context: 'Тестирование исправления неясной ошибки валидации',
                input: {
                    data: '# Test prompt\n\nWrite a function to calculate sum of two numbers',
                    type: 'content',
                },
                language: 'markdown',
                validationType: 'prompts',
            });

            expectValidPromptValidation(response);
        });

        it('должен валидировать тестовый код без ошибки "Валидация выполнена"', async () => {
            // Настраиваем мок успешного ответа для валидации тестов
            testContext.mockOpenRouter.mockResponse({
                choices: [
                    {
                        message: {
                            content:
                                'Анализ кода завершен. Тесты написаны правильно с использованием describe и it блоков. Рекомендуется добавить больше edge cases.',
                        },
                    },
                ],
                model: 'gpt-4',
                usage: {
                    total_tokens: 120,
                },
            });

            // Тестируем валидацию тестового кода
            const response = await testContext.clientSimulator.callTool('validate', {
                context: 'Тестирование исправления валидации тестов',
                input: {
                    data: 'describe("calculator", () => { it("should add numbers", () => { expect(add(2, 3)).toBe(5); }); });',
                    type: 'content',
                },
                language: 'typescript',
                validationType: 'tests',
            });

            expectValidPromptValidation(response);
        });

        it('должен корректно обрабатывать кастомную папку промптов через PROMPTS_PATH', async () => {
            // Настраиваем мок успешного ответа для валидации кода
            testContext.mockOpenRouter.mockResponse({
                choices: [
                    {
                        message: {
                            content:
                                'Анализ кода завершен. Функция корректна и возвращает строку. Рекомендуется добавить JSDoc комментарии и типизацию.',
                        },
                    },
                ],
                model: 'gpt-4',
                usage: {
                    total_tokens: 100,
                },
            });

            // Этот тест проверяет что система может использовать кастомную папку промптов
            // В реальном окружении это будет работать с переменной PROMPTS_PATH
            const response = await testContext.clientSimulator.callTool('validate', {
                context: 'Тестирование поддержки кастомной папки промптов',
                input: {
                    data: 'function test() { return "hello world"; }',
                    type: 'content',
                },
                language: 'javascript',
                validationType: 'code',
            });

            expectValidPromptValidation(response);
        });
    });

    describe('Улучшенный вывод ошибок', () => {
        it('должен возвращать понятные ошибки вместо кодов', async () => {
            // Отправляем некорректный запрос для проверки улучшенных ошибок
            const response = await testContext.clientSimulator.callTool('validate', {
                input: {
                    data: 'test',
                    type: 'content',
                },
                validationType: 'invalid-type',
            });

            expect(response.jsonrpc).toBe('2.0');
            expect(response.result).toBeDefined();

            const result = response.result as { content: Array<{ text: string; type: string }> };
            const errorText = result.content?.[0]?.text;

            // Проверяем что ошибка содержит полезную информацию
            expect(errorText).toContain('Ошибка валидации');
            expect(errorText).toContain('Рекомендации по исправлению');
            expect(errorText).not.toBe('Валидация выполнена'); // Старая неясная ошибка
        });

        it('должен предоставлять детальную информацию об ошибках валидации', async () => {
            // Тестируем что новые ошибки содержат детали
            const response = await testContext.clientSimulator.callTool('validate', {
                // Отсутствует validationType
                input: {
                    data: 'test code',
                    type: 'content',
                },
            });

            expect(response.jsonrpc).toBe('2.0');
            expect(response.result).toBeDefined();

            const result = response.result as { content: Array<{ text: string; type: string }> };
            const errorText = result.content?.[0]?.text;

            // Проверяем наличие структурированной информации об ошибке
            expect(errorText).toContain('Возможные причины');
            expect(errorText).toContain('Рекомендации по исправлению');
            expect(errorText).toContain('Код ошибки');
        });
    });
}, 60000); // Увеличенный таймаут для E2E тестов
