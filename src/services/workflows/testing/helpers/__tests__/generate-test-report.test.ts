import type { ConsistencyAnalysis, ParallelTestParams, TestIterationResult } from '../../types';
import { generateTestReport } from '../generate-test-report';

describe('generateTestReport', () => {
    const mockParams: ParallelTestParams = {
        context: 'Тестовый контекст',
        iterations: 3,
        prompt: 'Тестовый промпт',
    };

    const mockResults: TestIterationResult[] = [
        {
            iteration: 1,
            response: 'Первый ответ',
            responseTime: 1000,
            startTime: '2024-01-01T10:00:00Z',
            success: true,
        },
        {
            iteration: 2,
            response: 'Второй ответ длиннее',
            responseTime: 1200,
            startTime: '2024-01-01T10:00:01Z',
            success: true,
        },
        {
            error: 'Тестовая ошибка',
            iteration: 3,
            responseTime: 800,
            startTime: '2024-01-01T10:00:02Z',
            success: false,
        },
    ];

    const mockConsistency: ConsistencyAnalysis = {
        analysis: 'Средняя консистентность',
        anomalies: ['Одна ошибка'],
        patterns: ['Стабильные ответы'],
        recommendations: ['Улучшить стабильность'],
        score: 75,
    };

    it('должен генерировать корректный отчет', () => {
        const report = generateTestReport(mockParams, mockResults, mockConsistency);

        expect(report).toContain('🧪 Отчет тестирования промпта');
        expect(report).toContain('Тестовый промпт');
        expect(report).toContain('Тестовый контекст');
        expect(report).toContain('**Всего тестов:** 3');
        expect(report).toContain('**Успешных:** 2');
        expect(report).toContain('**Неудачных:** 1');
        expect(report).toContain('**Оценка консистентности:** 75/100');
        expect(report).toContain('Средняя консистентность');
    });

    it('должен включать детали каждого теста', () => {
        const report = generateTestReport(mockParams, mockResults, mockConsistency);

        expect(report).toContain('| 1 | ✅ | 1000 | 12 символов |');
        expect(report).toContain('| 2 | ✅ | 1200 | 20 символов |');
        expect(report).toContain('| 3 | ❌ | 800 | Тестовая ошибка |');
    });

    it('должен включать паттерны и аномалии', () => {
        const report = generateTestReport(mockParams, mockResults, mockConsistency);

        expect(report).toContain('✅ Паттерны');
        expect(report).toContain('- Стабильные ответы');
        expect(report).toContain('⚠️ Аномалии');
        expect(report).toContain('- Одна ошибка');
        expect(report).toContain('💡 Рекомендации');
        expect(report).toContain('1. Улучшить стабильность');
    });

    it('должен работать без контекста', () => {
        const paramsWithoutContext = { ...mockParams, context: undefined as unknown as string };

        const report = generateTestReport(paramsWithoutContext, mockResults, mockConsistency);

        expect(report).not.toContain('Контекст:');
        expect(report).toContain('Тестовый промпт');
    });

    it('должен обрабатывать пустые массивы паттернов и аномалий', () => {
        const emptyConsistency: ConsistencyAnalysis = {
            analysis: 'Базовый анализ',
            anomalies: [],
            patterns: [],
            recommendations: [],
            score: 50,
        };

        const report = generateTestReport(mockParams, mockResults, emptyConsistency);

        expect(report).not.toContain('✅ Паттерны');
        expect(report).not.toContain('⚠️ Аномалии');
        expect(report).not.toContain('💡 Рекомендации');
        expect(report).toContain('Базовый анализ');
    });
});
