import { z } from 'zod';

/** Схема параметров параллельного тестирования */
export const ParallelTestParamsSchema = z.object({
    /** Дополнительный контекст промпта */
    context: z.string().optional(),

    /** Количество параллельных итераций */
    iterations: z.number().min(3, 'Минимум 3 итерации').max(10, 'Максимум 10 итераций').optional().default(5),

    /** Промпт для тестирования */
    prompt: z.string().min(1, 'Промпт не может быть пустым'),

    /** Timeout для каждого запроса в миллисекундах */
    timeout: z
        .number()
        .min(1000, 'Минимальный timeout 1 секунда')
        .max(120000, 'Максимальный timeout 2 минуты')
        .optional(),
});

/** Схема результата одной итерации */
export const TestIterationResultSchema = z.object({
    /** Время окончания выполнения */
    endTime: z.string().optional(),

    /** Ошибка, если произошла */
    error: z.string().optional(),

    /** Успешно ли выполнен тест */
    isSuccess: z.boolean(),

    /** Номер итерации */
    iteration: z.number().min(1),

    /** Используемая модель */
    model: z.string().optional(),

    /** Ответ модели */
    response: z.string().optional(),

    /** Время выполнения в миллисекундах */
    responseTime: z.number().nonnegative(),

    /** Время начала выполнения */
    startTime: z.string(),
});

/** Схема анализа консистентности */
export const ConsistencyAnalysisSchema = z.object({
    /** Текстовый анализ консистентности */
    analysis: z.string(),

    /** Аномалии или выбросы */
    anomalies: z.array(z.string()).optional(),

    /** Выявленные паттерны */
    patterns: z.array(z.string()).optional(),

    /** Рекомендации по улучшению */
    recommendations: z.array(z.string()).optional(),

    /** Оценка консистентности от 0 до 100 */
    score: z.number().min(0).max(100),
});

/** Схема результата параллельного тестирования */
export const ParallelTestResultSchema = z.object({
    /** Среднее время ответа в миллисекундах */
    averageResponseTime: z.number().nonnegative(),

    /** Анализ консистентности */
    consistency: ConsistencyAnalysisSchema,

    /** Количество неудачных тестов */
    failedTests: z.number().nonnegative(),

    /** Успешно ли завершено тестирование */
    isSuccess: z.boolean().optional(),

    /** Метаданные тестирования */
    metadata: z.object({
        /** Контекст тестирования */
        context: z.string().optional(),

        /** Общее время выполнения в миллисекундах */
        duration: z.number().nonnegative(),

        /** Время окончания тестирования */
        endTime: z.string(),

        /** Исходный промпт */
        originalPrompt: z.string(),

        /** Время начала тестирования */
        startTime: z.string(),

        /** Версия валидатора */
        validatorVersion: z.string(),
    }),

    /** Результаты всех итераций */
    results: z.array(TestIterationResultSchema),

    /** Успешно ли завершено тестирование */
    success: z.boolean(),

    /** Количество успешных тестов */
    successfulTests: z.number().nonnegative(),

    /** Общее количество тестов */
    totalTests: z.number().nonnegative(),
});
