import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import type { PromptResponse } from './types';

/** Регистрирует все промпты валидатора */
export function registerValidatorPrompts(server: McpServer): void {
    server.registerPrompt(
        'validate-code',
        {
            argsSchema: {
                filePath: z.string().describe('Абсолютный путь к файлу'),
                focus: z.enum(['quality', 'security', 'performance', 'all']).default('all').describe('Фокус валидации'),
            },
            description: 'Проверка качества TypeScript/JavaScript кода с детальным отчётом',
            title: 'Валидация кода',
        },
        ({ filePath, focus }): PromptResponse => ({
            messages: [
                {
                    content: {
                        text: `Провалидируй код в файле ${filePath} с фокусом на ${focus}. Используй инструмент validate с типом "code".`,
                        type: 'text',
                    },
                    role: 'user',
                },
            ],
        }),
    );

    server.registerPrompt(
        'validate-tests',
        {
            argsSchema: {
                filePath: z.string().describe('Путь к тестовому файлу'),
            },
            description: 'Анализ качества и полноты тестового покрытия',
            title: 'Валидация тестов',
        },
        ({ filePath }): PromptResponse => ({
            messages: [
                {
                    content: {
                        text: `Провалидируй тесты в файле ${filePath}. Используй инструмент validate с типом "tests".`,
                        type: 'text',
                    },
                    role: 'user',
                },
            ],
        }),
    );

    server.registerPrompt(
        'validate-architecture',
        {
            argsSchema: {
                filePath: z.string().describe('Путь к файлу или директории'),
            },
            description: 'Проверка архитектурных решений и паттернов',
            title: 'Валидация архитектуры',
        },
        ({ filePath }): PromptResponse => ({
            messages: [
                {
                    content: {
                        text: `Провалидируй архитектуру в ${filePath}. Используй инструмент validate с типом "architecture".`,
                        type: 'text',
                    },
                    role: 'user',
                },
            ],
        }),
    );

    server.registerPrompt(
        'test-consistency',
        {
            argsSchema: {
                iterations: z.number().min(3).max(10).default(5).describe('Количество итераций'),
                prompt: z.string().describe('Промпт для тестирования'),
            },
            description: 'Параллельное тестирование промпта на стабильность ответов',
            title: 'Тест консистентности промпта',
        },
        ({ prompt, iterations }): PromptResponse => ({
            messages: [
                {
                    content: {
                        text: `Протестируй консистентность следующего промпта (${iterations} итераций):\n\n${prompt}\n\nИспользуй инструмент test-prompt.`,
                        type: 'text',
                    },
                    role: 'user',
                },
            ],
        }),
    );

    server.registerPrompt(
        'verify-facts',
        {
            argsSchema: {
                text: z.string().describe('Текст для проверки'),
            },
            description: 'Верификация информации через 3 параллельные проверки',
            title: 'Проверка фактов',
        },
        ({ text }): PromptResponse => ({
            messages: [
                {
                    content: {
                        text: `Проверь достоверность следующей информации:\n\n${text}\n\nИспользуй инструмент verify-info.`,
                        type: 'text',
                    },
                    role: 'user',
                },
            ],
        }),
    );
}
