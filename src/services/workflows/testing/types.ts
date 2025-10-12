/** Типы для модуля параллельного тестирования промптов */

/** Параметры для параллельного тестирования */
export type ParallelTestParams = {
    /** Промпт для тестирования */
    prompt: string;
    /** Дополнительный контекст промпта */
    context?: string;
    /** Количество параллельных итераций */
    iterations?: number;
    /** Список моделей для тестирования */
    models?: string[];
    /** Timeout для каждого запроса в миллисекундах */
    timeout?: number;
};

/** Результат одной итерации тестирования */
export type TestIterationResult = {
    /** Номер итерации или специальный идентификатор (например, 'analysis') */
    iteration: number | string;
    /** Время выполнения в миллисекундах */
    responseTime: number;
    /** Время начала выполнения */
    startTime: string;
    /** Успешно ли выполнен тест */
    success: boolean;
    /** Время окончания выполнения */
    endTime?: string;
    /** Ошибка, если произошла */
    error?: string;
    /** Используемая модель */
    model?: string;
    /** Ответ модели */
    response?: string;
};

/** Результат параллельного тестирования */
export type ParallelTestResult = {
    /** Среднее время ответа в миллисекундах */
    averageResponseTime: number;
    /** Анализ консистентности */
    consistency: ConsistencyAnalysis;
    /** Количество неудачных тестов */
    failedTests: number;
    /** Метаданные тестирования */
    metadata: TestMetadata;
    /** Результаты всех итераций */
    results: TestIterationResult[];
    /** Успешно ли завершено тестирование */
    success: boolean;
    /** Количество успешных тестов */
    successfulTests: number;
    /** Общее количество тестов */
    totalTests: number;
};

/** Анализ консистентности ответов */
export type ConsistencyAnalysis = {
    /** Текстовый анализ консистентности */
    analysis: string;
    /** Аномалии или выбросы */
    anomalies: string[];
    /** Выявленные паттерны */
    patterns: string[];
    /** Рекомендации по улучшению */
    recommendations: string[];
    /** Оценка консистентности от 0 до 100 */
    score: number;
    /** Результат продвинутого AI анализа (новое поле) */
    aiAnalysis?: string;
    /** Флаг наличия AI анализа */
    hasAiAnalysis?: boolean;
};

/** Метаданные тестирования */
export type TestMetadata = {
    /** Общее время выполнения в миллисекундах */
    duration: number;
    /** Время окончания тестирования */
    endTime: string;
    /** Использованные модели */
    models: string[];
    /** Исходный промпт */
    originalPrompt: string;
    /** Время начала тестирования */
    startTime: string;
    /** Версия валидатора */
    validatorVersion: string;
    /** Контекст тестирования */
    context?: string;
};
