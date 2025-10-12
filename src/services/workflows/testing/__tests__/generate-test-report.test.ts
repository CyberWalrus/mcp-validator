import { generateShortReport, generateTestReport } from '../generate-test-report';
import type { ParallelTestResult } from '../types';

describe('generateTestReport', () => {
    const mockResult: ParallelTestResult = {
        averageResponseTime: 1200,
        consistency: {
            analysis: 'Промпт демонстрирует высокую консистентность',
            anomalies: ['1 из 3 запросов завершился ошибкой'],
            patterns: ['Стабильная длина ответов', 'Последовательная структура'],
            recommendations: ['Проверьте стабильность сетевого соединения'],
            score: 75,
        },
        failedTests: 1,
        metadata: {
            context: 'Тест для студентов',
            duration: 3000,
            endTime: '2024-01-01T10:00:03Z',
            models: ['claude-3-sonnet', 'claude-3-haiku'],
            originalPrompt: 'Объясни что такое рекурсия',
            startTime: '2024-01-01T10:00:00Z',
            validatorVersion: '2.0.0',
        },
        results: [
            {
                endTime: '2024-01-01T10:00:01Z',
                iteration: 1,
                model: 'claude-3-sonnet',
                response: 'Первый успешный ответ',
                responseTime: 1000,
                startTime: '2024-01-01T10:00:00Z',
                success: true,
            },
            {
                endTime: '2024-01-01T10:00:02Z',
                iteration: 2,
                model: 'claude-3-haiku',
                response: 'Второй успешный ответ',
                responseTime: 1100,
                startTime: '2024-01-01T10:00:01Z',
                success: true,
            },
            {
                endTime: '2024-01-01T10:00:03Z',
                error: 'Network timeout',
                iteration: 3,
                model: 'claude-3-sonnet',
                responseTime: 1500,
                startTime: '2024-01-01T10:00:02Z',
                success: false,
            },
        ],
        success: true,
        successfulTests: 2,
        totalTests: 3,
    };

    it('должен генерировать полный отчет с всеми секциями', () => {
        const report = generateTestReport(mockResult);

        expect(report).toContain('# 🧪 Отчет о параллельном тестировании промпта');
        expect(report).toContain('## 📊 Общая статистика');
        expect(report).toContain('## 🎯 Исходный промпт');
        expect(report).toContain('## 📈 Анализ консистентности');
        expect(report).toContain('## 📋 Детальные результаты тестирования');
        expect(report).toContain('## 📊 Статистика по моделям');
        expect(report).toContain('## ⏱️ Временные характеристики');
        expect(report).toContain('## 🔧 Техническая информация');
    });

    it('должен включать правильную статистику', () => {
        const report = generateTestReport(mockResult);

        expect(report).toContain('**Общее количество тестов** | 3');
        expect(report).toContain('**Успешных тестов** | 2 (66.7%)');
        expect(report).toContain('**Неудачных тестов** | 1 (33.3%)');
        expect(report).toContain('**Среднее время ответа** | 1200мс');
        expect(report).toContain('**Оценка консистентности** | 75/100');
    });

    it('должен отображать исходный промпт и контекст', () => {
        const report = generateTestReport(mockResult);

        expect(report).toContain('Объясни что такое рекурсия');
        expect(report).toContain('**Контекст:** Тест для студентов');
    });

    it('должен включать анализ консистентности', () => {
        const report = generateTestReport(mockResult);

        expect(report).toMatch(/⚠️ \*\*Средняя консистентность\*\*|✅ \*\*Высокая консистентность\*\*/);
        expect(report).toContain('Промпт демонстрирует высокую консистентность');
    });

    it('должен показывать выявленные паттерны', () => {
        const report = generateTestReport(mockResult);

        expect(report).toContain('### ✅ Выявленные паттерны');
        expect(report).toContain('- Стабильная длина ответов');
        expect(report).toContain('- Последовательная структура');
    });

    it('должен показывать обнаруженные аномалии', () => {
        const report = generateTestReport(mockResult);

        expect(report).toContain('### ⚠️ Обнаруженные аномалии');
        expect(report).toContain('- 1 из 3 запросов завершился ошибкой');
    });

    it('должен показывать рекомендации', () => {
        const report = generateTestReport(mockResult);

        expect(report).toContain('### 💡 Рекомендации по улучшению');
        expect(report).toContain('1. Проверьте стабильность сетевого соединения');
    });

    it('должен включать детальную таблицу результатов', () => {
        const report = generateTestReport(mockResult);

        expect(report).toContain('| Итерация | Статус | Время (мс) | Модель | Детали |');
        expect(report).toContain('| 1 | ✅ | 1000 | claude-3-sonnet | 21 символов |');
        expect(report).toContain('| 3 | ❌ | 1500 | claude-3-sonnet | Network timeout... |');
    });

    it('должен показывать статистику по моделям', () => {
        const report = generateTestReport(mockResult);

        expect(report).toContain('| Модель | Тестов | Успешных | Успешность | Среднее время |');
        expect(report).toContain('claude-3-sonnet');
        expect(report).toContain('claude-3-haiku');
    });
});

describe('generateShortReport', () => {
    const mockResult: ParallelTestResult = {
        averageResponseTime: 1000,
        consistency: {
            analysis: 'Промпт показывает отличную консистентность',
            anomalies: [],
            patterns: ['Стабильная длина ответов', 'Единообразная структура'],
            recommendations: ['Промпт готов к продакшену', 'Рассмотрите тестирование на краевых случаях'],
            score: 85,
        },
        failedTests: 0,
        metadata: {
            context: 'Тестовый контекст',
            duration: 3000,
            endTime: '2024-01-01T10:00:03Z',
            models: ['claude-3-sonnet'],
            originalPrompt: 'Тестовый промпт',
            startTime: '2024-01-01T10:00:00Z',
            validatorVersion: '2.0.0',
        },
        results: [],
        success: true,
        successfulTests: 3,
        totalTests: 3,
    };

    it('должен генерировать краткий отчет', () => {
        const report = generateShortReport(mockResult);

        expect(report).toContain('# 🧪 Результат тестирования промпта');
        expect(report).toContain('**Оценка качества:** 85/100');
        expect(report).toContain('**Статус:** ✅ **Высокая консистентность**');
        expect(report).toContain('**Успешность:** 100.0% (3/3)');
        expect(report).toContain('**Среднее время:** 1000мс');
    });

    it('должен включать анализ и рекомендации', () => {
        const report = generateShortReport(mockResult);

        expect(report).toContain('## 📊 Анализ');
        expect(report).toContain('Промпт показывает отличную консистентность');
        expect(report).toContain('## 💡 Основные рекомендации');
        expect(report).toContain('1. Промпт готов к продакшену');
        expect(report).toContain('2. Рассмотрите тестирование на краевых случаях');
    });

    it('должен ограничивать количество рекомендаций до 3', () => {
        const mockWithManyRecommendations = {
            ...mockResult,
            consistency: {
                ...mockResult.consistency,
                recommendations: [
                    'Рекомендация 1',
                    'Рекомендация 2',
                    'Рекомендация 3',
                    'Рекомендация 4',
                    'Рекомендация 5',
                ],
            },
        };

        const report = generateShortReport(mockWithManyRecommendations);

        expect(report).toContain('1. Рекомендация 1');
        expect(report).toContain('2. Рекомендация 2');
        expect(report).toContain('3. Рекомендация 3');
        expect(report).not.toContain('4. Рекомендация 4');
    });
});
