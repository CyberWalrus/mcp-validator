import { analyzeTestConsistency } from '../analyze-test-consistency';
import type { TestIterationResult } from '../types';

describe('analyzeTestConsistency', () => {
    it('должен анализировать высокую консистентность для стабильных результатов', () => {
        const results: TestIterationResult[] = [
            {
                endTime: '2024-01-01T10:00:01Z',
                iteration: 1,
                response: 'Рекурсия - это метод программирования, когда функция вызывает сама себя.',
                responseTime: 1000,
                startTime: '2024-01-01T10:00:00Z',
                success: true,
            },
            {
                endTime: '2024-01-01T10:00:01Z',
                iteration: 2,
                response: 'Рекурсия - это техника, при которой функция обращается к самой себе.',
                responseTime: 1100,
                startTime: '2024-01-01T10:00:00Z',
                success: true,
            },
            {
                endTime: '2024-01-01T10:00:01Z',
                iteration: 3,
                response: 'Рекурсия означает, что функция может вызывать саму себя в процессе выполнения.',
                responseTime: 950,
                startTime: '2024-01-01T10:00:00Z',
                success: true,
            },
        ];

        const analysis = analyzeTestConsistency(results);

        expect(analysis.score).toBeGreaterThanOrEqual(40);
        expect(analysis.analysis).toContain('консистентность');
        expect(analysis.patterns).toBeDefined();
        expect(analysis.recommendations).toBeDefined();
    });

    it('должен анализировать низкую консистентность для различающихся результатов', () => {
        const results: TestIterationResult[] = [
            {
                iteration: 1,
                response: 'Короткий ответ.',
                responseTime: 500,
                startTime: '2024-01-01T10:00:00Z',
                success: true,
            },
            {
                iteration: 2,
                response:
                    'Очень длинный и подробный ответ, который содержит много деталей и объяснений, намного больше информации чем предыдущий ответ, что создает значительную разницу в длине и структуре.',
                responseTime: 3000,
                startTime: '2024-01-01T10:00:00Z',
                success: true,
            },
            {
                iteration: 3,
                response: 'Средний по длине ответ с некоторыми деталями.',
                responseTime: 1200,
                startTime: '2024-01-01T10:00:00Z',
                success: true,
            },
        ];

        const analysis = analyzeTestConsistency(results);

        expect(analysis.score).toBeLessThan(70);
        expect(analysis.anomalies).toBeDefined();
        expect(analysis.recommendations).toEqual(
            expect.arrayContaining([expect.stringMatching(/доработка|улучшения|инструкции|необходима|критично/i)]),
        );
    });

    it('должен обрабатывать случай когда все тесты провалились', () => {
        const results: TestIterationResult[] = [
            {
                error: 'Network error',
                iteration: 1,
                responseTime: 0,
                startTime: '2024-01-01T10:00:00Z',
                success: false,
            },
            {
                error: 'Timeout error',
                iteration: 2,
                responseTime: 0,
                startTime: '2024-01-01T10:00:00Z',
                success: false,
            },
        ];

        const analysis = analyzeTestConsistency(results);

        expect(analysis.score).toBe(0);
        expect(analysis.analysis).toContain('все тесты завершились ошибкой');
        expect(analysis.anomalies).toContain('Все тесты завершились ошибкой');
        expect(analysis.recommendations).toEqual(
            expect.arrayContaining([expect.stringMatching(/проверьте|корректность|timeout|api/i)]),
        );
    });

    it('должен обрабатывать случай с одним успешным результатом', () => {
        const results: TestIterationResult[] = [
            {
                iteration: 1,
                response: 'Единственный успешный ответ.',
                responseTime: 1000,
                startTime: '2024-01-01T10:00:00Z',
                success: true,
            },
        ];

        const analysis = analyzeTestConsistency(results);

        expect(analysis.score).toBe(50);
        expect(analysis.analysis).toContain('Недостаточно данных');
        expect(analysis.recommendations).toEqual(
            expect.arrayContaining([expect.stringMatching(/увеличьте.*итераций/i)]),
        );
    });

    it('должен выявлять аномалии во времени выполнения', () => {
        const results: TestIterationResult[] = [
            {
                iteration: 1,
                response: 'Нормальный ответ',
                responseTime: 1000,
                startTime: '2024-01-01T10:00:00Z',
                success: true,
            },
            {
                iteration: 2,
                response: 'Нормальный ответ',
                responseTime: 1100,
                startTime: '2024-01-01T10:00:00Z',
                success: true,
            },
            {
                iteration: 3,

                response: 'Медленный ответ',

                responseTime: 5000,
                startTime: '2024-01-01T10:00:00Z',
                success: true,
            },
        ];

        const analysis = analyzeTestConsistency(results);

        expect(analysis.anomalies).toEqual(
            expect.arrayContaining([expect.stringMatching(/запросов выполнялись.*дольше|высокая вариация/i)]),
        );
    });
});
