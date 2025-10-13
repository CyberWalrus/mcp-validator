import { analyzeTestConsistency } from '../analyze-test-consistency';
import type { TestIterationResult } from '../types';

describe('analyzeTestConsistency', () => {
    it('должен анализировать высокую консистентность для стабильных результатов', () => {
        const results: TestIterationResult[] = [
            {
                content: 'Рекурсия - это метод программирования, когда функция вызывает сама себя.',
                duration: 1000,
                endTime: '2024-01-01T10:00:01Z',
                isSuccess: true,
                iteration: 1,
                startTime: '2024-01-01T10:00:00Z',
            },
            {
                content: 'Рекурсия - это техника, при которой функция обращается к самой себе.',
                duration: 1100,
                endTime: '2024-01-01T10:00:01Z',
                isSuccess: true,
                iteration: 2,
                startTime: '2024-01-01T10:00:00Z',
            },
            {
                content: 'Рекурсия означает, что функция может вызывать саму себя в процессе выполнения.',
                duration: 950,
                endTime: '2024-01-01T10:00:01Z',
                isSuccess: true,
                iteration: 3,
                startTime: '2024-01-01T10:00:00Z',
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
                content: 'Короткий ответ.',
                duration: 500,
                isSuccess: true,
                iteration: 1,
                startTime: '2024-01-01T10:00:00Z',
            },
            {
                content:
                    'Очень длинный и подробный ответ, который содержит много деталей и объяснений, намного больше информации чем предыдущий ответ, что создает значительную разницу в длине и структуре.',
                duration: 3000,
                isSuccess: true,
                iteration: 2,
                startTime: '2024-01-01T10:00:00Z',
            },
            {
                content: 'Средний по длине ответ с некоторыми деталями.',
                duration: 1200,
                isSuccess: true,
                iteration: 3,
                startTime: '2024-01-01T10:00:00Z',
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
                content: '',
                duration: 0,
                error: 'Network error',
                isSuccess: false,
                iteration: 1,
                startTime: '2024-01-01T10:00:00Z',
            },
            {
                content: '',
                duration: 0,
                error: 'Timeout error',
                isSuccess: false,
                iteration: 2,
                startTime: '2024-01-01T10:00:00Z',
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
                content: 'Единственный успешный ответ.',
                duration: 1000,
                isSuccess: true,
                iteration: 1,
                startTime: '2024-01-01T10:00:00Z',
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
                content: 'Нормальный ответ',
                duration: 1000,
                isSuccess: true,
                iteration: 1,
                startTime: '2024-01-01T10:00:00Z',
            },
            {
                content: 'Нормальный ответ',
                duration: 1100,
                isSuccess: true,
                iteration: 2,
                startTime: '2024-01-01T10:00:00Z',
            },
            {
                content: 'Медленный ответ',

                duration: 5000,

                isSuccess: true,
                iteration: 3,
                startTime: '2024-01-01T10:00:00Z',
            },
        ];

        const analysis = analyzeTestConsistency(results);

        expect(analysis.anomalies).toEqual(
            expect.arrayContaining([
                expect.stringMatching(/время выполнения сильно варьируется/i),
                expect.stringMatching(/очень быстрое выполнение/i),
                expect.stringMatching(/очень медленное выполнение/i),
            ]),
        );
    });
});
