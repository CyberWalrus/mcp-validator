/** Константы для модуля параллельного тестирования */

/** Параметры тестирования по умолчанию */
export const DEFAULT_TEST_PARAMS = {
    /** Количество итераций по умолчанию */
    ITERATIONS: 5,

    /** Максимальное количество итераций */
    MAX_ITERATIONS: 10,

    /** Минимальное количество итераций */
    MIN_ITERATIONS: 3,

    /** Timeout по умолчанию в миллисекундах */
    TIMEOUT: 30000,
} as const;

/** Модели для тестирования по умолчанию */
export const DEFAULT_TEST_MODELS = [
    process.env.DEFAULT_AI_MODEL || 'openai/gpt-oss-120b',
    'openai/gpt-3.5-turbo',
] as const;

/** Пороги для оценки консистентности */
export const CONSISTENCY_THRESHOLDS = {
    /** Высокая консистентность */
    HIGH: 80,

    /** Низкая консистентность */
    LOW: 40,

    /** Средняя консистентность */
    MEDIUM: 60,
} as const;

/** Типы анализа консистентности */
export const CONSISTENCY_ANALYSIS_TYPES = {
    /** Анализ длины ответов */
    RESPONSE_LENGTH: 'response_length',

    /** Анализ структуры */
    STRUCTURE_CONSISTENCY: 'structure_consistency',

    /** Анализ тона */
    TONE_CONSISTENCY: 'tone_consistency',

    /** Анализ тематики */
    TOPIC_CONSISTENCY: 'topic_consistency',
} as const;

/** Шаблоны сообщений для результатов */
export const RESULT_MESSAGES = {
    /** Все тесты провалились */
    ALL_FAILED: 'Все тесты завершились ошибкой - проблема с промптом или конфигурацией',

    /** Высокая консистентность */
    HIGH_CONSISTENCY: 'Промпт показывает высокую консистентность - ответы стабильны и предсказуемы',

    /** Низкая консистентность */
    LOW_CONSISTENCY: 'Промпт показывает низкую консистентность - ответы значительно различаются',

    /** Средняя консистентность */
    MEDIUM_CONSISTENCY: 'Промпт показывает среднюю консистентность - есть некоторые вариации в ответах',
} as const;

/** Timeout операций в миллисекундах */
export const OPERATION_TIMEOUTS = {
    /** Timeout для анализа консистентности */
    CONSISTENCY_ANALYSIS: 10000,

    /** Timeout для всего параллельного тестирования */
    PARALLEL_TESTING: 120000,

    /** Timeout для одного запроса к модели */
    SINGLE_REQUEST: 30000,
} as const;

/** Максимальные размеры данных */
export const DATA_LIMITS = {
    /** Максимальная длина контекста */
    MAX_CONTEXT_LENGTH: 5000,

    /** Максимальная длина промпта */
    MAX_PROMPT_LENGTH: 10000,

    /** Максимальная длина ответа модели */
    MAX_RESPONSE_LENGTH: 50000,
} as const;
