/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-use-before-define, @typescript-eslint/no-unused-vars, no-nested-ternary, prettier/prettier, curly */
import OpenAI from 'openai';

import { getPrompt } from '../lib/cache/prompt-cache';
import { APP_CONFIG, getAppConfigError } from '../model/config';
import type { AppConfig, TestPromptInput, TestPromptResult } from '../model/types/main';
import { readFileContent } from '../services/adapters/file-reader';

function getConfigOrThrow(): AppConfig {
    const config = APP_CONFIG;

    const configError = getAppConfigError();

    if (!config || configError) {
        const message = configError?.message ?? 'Конфигурация приложения недоступна';

        throw new Error(message);
    }

    return config;
}

/** TestPromptAgent для параллельного тестирования промптов */
export function createTestPromptAgent() {
    const config = getConfigOrThrow();
    const {
        openRouter: { apiKey, apiUrl },
    } = config;

    // Создаем OpenAI клиент с OpenRouter backend
    const openai = new OpenAI({
        apiKey,
        baseURL: apiUrl,
    });

    // Загружаем промпт из кэша (ОПТИМИЗИРОВАНО!)
    const promptContent = getPrompt('test-prompt.md');

    return {
        instructions: promptContent,
        model: 'openai/gpt-oss-120b',
        openai,
    };
}

/** Параллельное тестирование промпта через TestPromptAgent */
export async function testPromptWithAgent(agent: any, input: TestPromptInput): Promise<TestPromptResult> {
    try {
        const { prompt, iterations = 5, models = ['openai/gpt-oss-120b'] } = input;

        // Выполняем параллельное тестирование
        const promises = Array.from({ length: iterations }, async (_, index) => {
            const iterationPrompt = `
# Тестирование промпта (итерация ${index + 1}/${iterations})

## Промпт для тестирования:
${prompt}

${input.context ? `## Контекст:\n${input.context}` : ''}

Выполни данный промпт и дай полный ответ согласно инструкциям выше.
`;

            const startTime = Date.now();

            try {
                const response = await agent.openai.chat.completions.create({
                    max_tokens: 4000,
                    messages: [
                        {
                            content: agent.instructions,
                            role: 'system',
                        },
                        {
                            content: iterationPrompt,
                            role: 'user',
                        },
                    ],
                    model: agent.model,
                    temperature: 0.1,
                });

                const duration = Date.now() - startTime;
                const responseContent = response.choices[0]?.message?.content;

                const result: any = {
                    content: responseContent || '',
                    duration,
                    iteration: index + 1,
                    model: models[0] || 'openai/gpt-oss-120b',
                    success: Boolean(responseContent),
                };

                if (!responseContent) {
                    result.error = 'Ошибка выполнения';
                }

                return result;
            } catch (error) {
                const duration = Date.now() - startTime;

                return {
                    content: '',
                    duration,
                    error: error instanceof Error ? error.message : String(error),
                    iteration: index + 1,
                    model: models[0] || 'openai/gpt-oss-120b',
                    success: false,
                };
            }
        });

        // Ждем завершения всех итераций
        const results = await Promise.all(promises);

        // Анализируем результаты
        const successfulResults = results.filter((r) => r.success);
        const averageDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
        const consistencyScore = calculateConsistencyScore(successfulResults.map((r) => r.content));

        return {
            averageDuration,
            consistencyScore,
            results,
            success: successfulResults.length > 0,
            successfulIterations: successfulResults.length,
            summary: generateTestSummary(results, consistencyScore),
            totalIterations: iterations,
        };
    } catch (error) {
        return {
            averageDuration: 0,
            consistencyScore: 0,
            error: `Ошибка тестирования промпта: ${error instanceof Error ? error.message : String(error)}`,
            results: [],
            success: false,
            successfulIterations: 0,
            totalIterations: input.iterations || 5,
        };
    }
}

/** Вычисление индекса консистентности между ответами */
function calculateConsistencyScore(contents: string[]): number {
    if (contents.length < 2) 
return 100;
    if (contents.length === 0 || !contents[0]) 
return 0;

    // Упрощенный алгоритм: сравниваем длины ответов и ключевые слова
    const lengths = contents.map((c) => c.length);
    const avgLength = lengths.reduce((sum, len) => sum + len, 0) / lengths.length;

    // Вычисляем отклонение длин
    const lengthVariance = lengths.reduce((sum, len) => sum + (len - avgLength) ** 2, 0) / lengths.length;
    const lengthConsistency = Math.max(0, 100 - (Math.sqrt(lengthVariance) / avgLength) * 100);

    // Простая проверка на схожесть ключевых слов
    const firstWords = contents[0].toLowerCase().split(/\s+/).slice(0, 10);
    const keywordConsistency =
        contents.slice(1).reduce((score, content, index) => {
            const words = content.toLowerCase().split(/\s+/).slice(0, 10);
            const commonWords = firstWords.filter((word) => words.includes(word)).length;

            return score + (commonWords / firstWords.length) * 100;
        }, 0) /
        (contents.length - 1);

    // Средневзвешенная оценка
    return Math.round(lengthConsistency * 0.3 + keywordConsistency * 0.7);
}

/** Генерация краткого отчета о тестировании */
function generateTestSummary(results: any[], consistencyScore: number): string {
    const successful = results.filter((r) => r.success).length;
    const total = results.length;
    const successRate = Math.round((successful / total) * 100);

    return `
# Результаты тестирования промпта

## Общая статистика
- **Успешных итераций:** ${successful}/${total} (${successRate}%)
- **Консистентность ответов:** ${consistencyScore}/100
- **Среднее время ответа:** ${Math.round(results.reduce((sum, r) => sum + r.duration, 0) / results.length)}мс

## Оценка качества
${
    successRate >= 90
        ? '✅ **Отлично** - промпт работает стабильно'
        : successRate >= 70
          ? '⚠️ **Хорошо** - есть небольшие проблемы'
          : '❌ **Требует доработки** - много неудачных попыток'
}

${
    consistencyScore >= 80
        ? '✅ **Высокая консистентность** - ответы предсказуемы'
        : consistencyScore >= 60
          ? '⚠️ **Средняя консистентность** - есть вариативность'
          : '❌ **Низкая консистентность** - ответы сильно различаются'
}
`.trim();
}
