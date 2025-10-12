import type { ParallelTestResult } from '../../../../workflows/testing/types';
import { formatTestPromptResponse } from '../format-test-prompt-response';

describe('formatTestPromptResponse', () => {
    it('должен форматировать результат с высокой консистентностью', () => {
        const testResult: ParallelTestResult = {
            averageResponseTime: 1250,
            consistency: {
                analysis: 'Промпт показывает высокую консистентность - ответы стабильны и предсказуемы',
                anomalies: [],
                patterns: ['Стабильная длина ответов', 'Предсказуемое время выполнения'],
                recommendations: ['Промпт готов к использованию в продакшене'],
                score: 90,
            },
            failedTests: 0,
            metadata: {
                duration: 6500,
                endTime: '2024-01-15T10:00:06Z',
                models: ['claude-3.5-sonnet', 'gpt-4'],
                originalPrompt: 'Test prompt for analysis',
                startTime: '2024-01-15T10:00:00Z',
                validatorVersion: '2.0.0',
            },
            results: [],
            success: true,
            successfulTests: 5,
            totalTests: 5,
        };

        const formatted = formatTestPromptResponse(testResult);

        expect(formatted).toContain('# 🧪 Результат тестирования промпта');
        expect(formatted).toContain('**Оценка консистентности:** 90/100');
        expect(formatted).toContain('**Статус:** ✅ Высокая консистентность');
        expect(formatted).toContain('**Всего тестов:** 5');
        expect(formatted).toContain('**Успешных:** 5');
        expect(formatted).toContain('**Неудачных:** 0');
        expect(formatted).toContain('**Среднее время ответа:** 1250мс');
        expect(formatted).toContain('Промпт показывает высокую консистентность');
        expect(formatted).toContain('- Стабильная длина ответов');
        expect(formatted).toContain('- Предсказуемое время выполнения');
        expect(formatted).toContain('- Промпт готов к использованию в продакшене');
        expect(formatted).toContain('Время выполнения: 6500мс');
        expect(formatted).toContain('Использованные модели: claude-3.5-sonnet, gpt-4');
    });

    it('должен форматировать результат с умеренной консистентностью', () => {
        const testResult: ParallelTestResult = {
            averageResponseTime: 1800,
            consistency: {
                analysis: 'Промпт показывает среднюю консистентность - есть некоторые вариации в ответах',
                anomalies: ['1 из 4 запросов завершились ошибкой'],
                patterns: ['Умеренная вариация в ответах'],
                recommendations: [
                    'Рассмотрите уточнение формулировок промпта',
                    'Добавьте больше контекста для стабильности',
                ],
                score: 65,
            },
            failedTests: 1,
            metadata: {
                duration: 8200,
                endTime: '2024-01-15T14:30:08Z',
                models: ['gpt-4'],
                originalPrompt: 'Moderate consistency prompt',
                startTime: '2024-01-15T14:30:00Z',
                validatorVersion: '2.0.0',
            },
            results: [],
            success: true,
            successfulTests: 3,
            totalTests: 4,
        };

        const formatted = formatTestPromptResponse(testResult);

        expect(formatted).toContain('**Оценка консистентности:** 65/100');
        expect(formatted).toContain('**Статус:** ⚠️ Умеренная консистентность');
        expect(formatted).toContain('**Успешных:** 3');
        expect(formatted).toContain('**Неудачных:** 1');
        expect(formatted).toContain('среднюю консистентность');
        expect(formatted).toContain('### 📋 Выявленные паттерны:');
        expect(formatted).toContain('- Умеренная вариация в ответах');
        expect(formatted).toContain('### ⚠️ Аномалии:');
        expect(formatted).toContain('- 1 из 4 запросов завершились ошибкой');
        expect(formatted).toContain('- Рассмотрите уточнение формулировок промпта');
    });

    it('должен форматировать результат с низкой консистентностью', () => {
        const testResult: ParallelTestResult = {
            averageResponseTime: 2500,
            consistency: {
                analysis: 'Промпт показывает низкую консистентность - ответы значительно различаются',
                anomalies: ['4 из 6 запросов завершились ошибкой', 'Высокая вариативность времени ответа'],
                patterns: ['Значительная вариация в ответах'],
                recommendations: [
                    'Критично необходима доработка промпта',
                    'Добавьте четкие инструкции и примеры',
                    'Рассмотрите разбиение на более простые задачи',
                ],
                score: 25,
            },
            failedTests: 4,
            metadata: {
                duration: 15000,
                endTime: '2024-01-15T16:00:15Z',
                models: ['claude-3-haiku', 'gpt-3.5-turbo'],
                originalPrompt: 'Problematic prompt with issues',
                startTime: '2024-01-15T16:00:00Z',
                validatorVersion: '2.0.0',
            },
            results: [],
            success: false,
            successfulTests: 2,
            totalTests: 6,
        };

        const formatted = formatTestPromptResponse(testResult);

        expect(formatted).toContain('**Оценка консистентности:** 25/100');
        expect(formatted).toContain('**Статус:** ❌ Низкая консистентность');
        expect(formatted).toContain('**Успешных:** 2');
        expect(formatted).toContain('**Неудачных:** 4');
        expect(formatted).toContain('низкую консистентность');
        expect(formatted).toContain('- Критично необходима доработка промпта');
        expect(formatted).toContain('- Добавьте четкие инструкции и примеры');
        expect(formatted).toContain('Использованные модели: claude-3-haiku, gpt-3.5-turbo');
        expect(formatted).toContain('Время выполнения: 15000мс');
    });

    it('должен корректно обрабатывать результат без паттернов и аномалий', () => {
        const testResult: ParallelTestResult = {
            averageResponseTime: 1000,
            consistency: {
                analysis: 'Отличная консистентность',
                anomalies: [],
                patterns: [],
                recommendations: ['Промпт идеален'],
                score: 100,
            },
            failedTests: 0,
            metadata: {
                duration: 3000,
                endTime: '2024-01-15T12:00:03Z',
                models: ['claude-3.5-sonnet'],
                originalPrompt: 'Perfect prompt',
                startTime: '2024-01-15T12:00:00Z',
                validatorVersion: '2.0.0',
            },
            results: [],
            success: true,
            successfulTests: 3,
            totalTests: 3,
        };

        const formatted = formatTestPromptResponse(testResult);

        expect(formatted).toContain('**Оценка консистентности:** 100/100');
        expect(formatted).toContain('Отличная консистентность');
        expect(formatted).not.toContain('### 📋 Выявленные паттерны:');
        expect(formatted).not.toContain('### ⚠️ Аномалии:');
        expect(formatted).toContain('### 💡 Рекомендации:');
        expect(formatted).toContain('- Промпт идеален');
    });

    it('должен правильно определять статусные иконки по баллам', () => {
        const testCases = [
            { expectedIcon: '✅', expectedText: 'Высокая консистентность', score: 95 },
            { expectedIcon: '✅', expectedText: 'Высокая консистентность', score: 80 },
            { expectedIcon: '⚠️', expectedText: 'Умеренная консистентность', score: 75 },
            { expectedIcon: '⚠️', expectedText: 'Умеренная консистентность', score: 60 },
            { expectedIcon: '❌', expectedText: 'Низкая консистентность', score: 45 },
            { expectedIcon: '❌', expectedText: 'Низкая консистентность', score: 0 },
        ];

        testCases.forEach((testCase) => {
            const testResult: ParallelTestResult = {
                averageResponseTime: 1000,
                consistency: {
                    analysis: 'Test analysis',
                    anomalies: [],
                    patterns: [],
                    recommendations: ['Test recommendation'],
                    score: testCase.score,
                },
                failedTests: 0,
                metadata: {
                    duration: 5000,
                    endTime: '2024-01-15T10:00:05Z',
                    models: ['test-model'],
                    originalPrompt: 'Test prompt',
                    startTime: '2024-01-15T10:00:00Z',
                    validatorVersion: '2.0.0',
                },
                results: [],
                success: true,
                successfulTests: 5,
                totalTests: 5,
            };

            const formatted = formatTestPromptResponse(testResult);

            expect(formatted).toContain(`**Оценка консистентности:** ${testCase.score}/100`);
            expect(formatted).toContain(`**Статус:** ${testCase.expectedIcon} ${testCase.expectedText}`);
        });
    });

    it('должен форматировать временные метки корректно', () => {
        const testResult: ParallelTestResult = {
            averageResponseTime: 500,
            consistency: {
                analysis: 'Test',
                anomalies: [],
                patterns: [],
                recommendations: ['Test'],
                score: 100,
            },
            failedTests: 0,
            metadata: {
                duration: 1234,
                endTime: '2024-12-25T15:30:46Z',
                models: ['test-model-1', 'test-model-2', 'test-model-3'],
                originalPrompt: 'Time test',
                startTime: '2024-12-25T15:30:45Z',
                validatorVersion: '2.0.0',
            },
            results: [],
            success: true,
            successfulTests: 1,
            totalTests: 1,
        };

        const formatted = formatTestPromptResponse(testResult);

        expect(formatted).toContain('Время выполнения: 1234мс');
        expect(formatted).toContain('Использованные модели: test-model-1, test-model-2, test-model-3');
        expect(formatted).toContain('Начало тестирования: 2024-12-25T15:30:45Z');
        expect(formatted).toContain('Окончание: 2024-12-25T15:30:46Z');
    });
});
