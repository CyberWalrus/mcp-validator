import {
    ConsistencyAnalysisSchema,
    ParallelTestParamsSchema,
    ParallelTestResultSchema,
    TestIterationResultSchema,
} from '../schemas';

describe('Testing Schemas', () => {
    describe('ParallelTestParamsSchema', () => {
        it('должен валидировать корректные параметры', () => {
            const validParams = {
                context: 'Дополнительный контекст',
                iterations: 5,
                prompt: 'Тестовый промпт',
                timeout: 30000,
            };

            const result = ParallelTestParamsSchema.safeParse(validParams);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toEqual(validParams);
            }
        });

        it('должен применять значения по умолчанию', () => {
            const minimalParams = {
                prompt: 'Минимальный тест',
            };

            const result = ParallelTestParamsSchema.safeParse(minimalParams);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.iterations).toBe(5);
                expect(result.data.timeout).toBeUndefined();
            }
        });

        it('должен отклонять пустой промпт', () => {
            const invalidParams = {
                prompt: '',
            };

            const result = ParallelTestParamsSchema.safeParse(invalidParams);

            expect(result.success).toBe(false);
        });

        it('должен отклонять недопустимое количество итераций', () => {
            const invalidParamsTooLow = {
                iterations: 2,
                prompt: 'Тест',
            };

            const invalidParamsTooHigh = {
                iterations: 15,
                prompt: 'Тест',
            };

            expect(ParallelTestParamsSchema.safeParse(invalidParamsTooLow).success).toBe(false);
            expect(ParallelTestParamsSchema.safeParse(invalidParamsTooHigh).success).toBe(false);
        });

        it('должен отклонять недопустимый timeout', () => {
            const invalidParamsTooLow = {
                prompt: 'Тест',
                timeout: 500,
            };

            const invalidParamsTooHigh = {
                prompt: 'Тест',
                timeout: 150000,
            };

            expect(ParallelTestParamsSchema.safeParse(invalidParamsTooLow).success).toBe(false);
            expect(ParallelTestParamsSchema.safeParse(invalidParamsTooHigh).success).toBe(false);
        });
    });

    describe('TestIterationResultSchema', () => {
        it('должен валидировать успешный результат', () => {
            const successResult = {
                content: 'Успешный ответ',
                duration: 1000,
                endTime: '2024-01-01T10:00:01Z',
                isSuccess: true,
                iteration: 1,
                model: 'claude-3-sonnet',
                startTime: '2024-01-01T10:00:00Z',
            };

            const result = TestIterationResultSchema.safeParse(successResult);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toEqual(successResult);
            }
        });

        it('должен валидировать результат с ошибкой', () => {
            const errorResult = {
                content: '',
                duration: 500,
                error: 'Network timeout',
                isSuccess: false,
                iteration: 2,
                startTime: '2024-01-01T10:00:00Z',
            };

            const result = TestIterationResultSchema.safeParse(errorResult);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.isSuccess).toBe(false);
                expect(result.data.error).toBe('Network timeout');
            }
        });

        it('должен отклонять отрицательное время выполнения', () => {
            const invalidResult = {
                content: 'Test response',
                duration: -100,
                isSuccess: true,
                iteration: 1,
                startTime: '2024-01-01T10:00:00Z',
            };

            const result = TestIterationResultSchema.safeParse(invalidResult);

            expect(result.success).toBe(false);
        });

        it('должен отклонять недопустимый номер итерации', () => {
            const invalidResult = {
                content: 'Test response',
                duration: 1000,
                isSuccess: true,
                iteration: 0,
                startTime: '2024-01-01T10:00:00Z',
            };

            const result = TestIterationResultSchema.safeParse(invalidResult);

            expect(result.success).toBe(false);
        });
    });

    describe('ConsistencyAnalysisSchema', () => {
        it('должен валидировать полный анализ консистентности', () => {
            const fullAnalysis = {
                analysis: 'Высокая консистентность',
                anomalies: ['Один медленный запрос'],
                patterns: ['Стабильные ответы', 'Хорошая структура'],
                recommendations: ['Готов к продакшену', 'Тестировать на краевых случаях'],
                score: 85,
            };

            const result = ConsistencyAnalysisSchema.safeParse(fullAnalysis);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toEqual(fullAnalysis);
            }
        });

        it('должен валидировать минимальный анализ', () => {
            const minimalAnalysis = {
                analysis: 'Средняя консистентность',
                score: 50,
            };

            const result = ConsistencyAnalysisSchema.safeParse(minimalAnalysis);

            expect(result.success).toBe(true);
        });

        it('должен отклонять скор вне диапазона 0-100', () => {
            const invalidScoreLow = {
                analysis: 'Тест',
                score: -10,
            };

            const invalidScoreHigh = {
                analysis: 'Тест',
                score: 150,
            };

            expect(ConsistencyAnalysisSchema.safeParse(invalidScoreLow).success).toBe(false);
            expect(ConsistencyAnalysisSchema.safeParse(invalidScoreHigh).success).toBe(false);
        });
    });

    describe('ParallelTestResultSchema', () => {
        it('должен валидировать полный результат тестирования', () => {
            const fullResult = {
                averageResponseTime: 1200,
                consistency: {
                    analysis: 'Высокая консистентность',
                    score: 80,
                },
                failedTests: 1,
                metadata: {
                    duration: 5000,
                    endTime: '2024-01-01T10:00:05Z',
                    models: ['claude-3-sonnet'],
                    originalPrompt: 'Тестовый промпт',
                    startTime: '2024-01-01T10:00:00Z',
                    validatorVersion: '2.0.0',
                },
                results: [
                    {
                        content: 'Ответ',
                        duration: 1000,
                        isSuccess: true,
                        iteration: 1,
                        startTime: '2024-01-01T10:00:00Z',
                    },
                ],
                success: true,
                successfulTests: 4,
                totalTests: 5,
            };

            const result = ParallelTestResultSchema.safeParse(fullResult);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.totalTests).toBe(5);
                expect(result.data.consistency.score).toBe(80);
                expect(result.data.results).toHaveLength(1);
            }
        });

        it('должен отклонять отрицательные значения счетчиков', () => {
            const invalidResult = {
                averageResponseTime: 0,
                consistency: { analysis: 'Тест', score: 0 },
                failedTests: 0,
                isSuccess: false,
                metadata: {
                    duration: 0,
                    endTime: '2024-01-01T10:00:00Z',
                    models: [],
                    originalPrompt: '',
                    startTime: '2024-01-01T10:00:00Z',
                    validatorVersion: '2.0.0',
                },
                results: [],
                successfulTests: 0,
                totalTests: -1,
            };

            const result = ParallelTestResultSchema.safeParse(invalidResult);

            expect(result.success).toBe(false);
        });
    });
});
