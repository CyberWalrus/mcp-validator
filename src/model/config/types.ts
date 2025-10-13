/** Объединенные типы из model/config и model/types - новая единая структура */

import type { z } from 'zod';

import type {
    apiConfigSchema,
    appConfigSchema,
    consistencyThresholdsSchema,
    loggingConfigSchema,
    logLevelSchema,
    modelConfigSchema,
    pathsConfigSchema,
    runtimeConfigSchema,
    timeoutsConfigSchema,
    validationLimitsSchema,
} from './schemas';

// ========== ЛОГИРОВАНИЕ ==========

/** Уровни логирования для системы */
export type LogLevel = z.infer<typeof logLevelSchema>;

// ========== ВАЛИДАЦИЯ ==========

/** Результат валидации */
export type ValidationResult = {
    /** Список проблем, если есть */
    issues: string[];
    /** Оценка качества от 0 до 100 */
    score: number;
    /** Успешно ли прошла валидация */
    success: boolean;
    /** Тип валидации */
    type: ValidationType;
    /** Дополнительные данные результата */
    metadata?: Record<string, unknown>;
    /** Рекомендации по улучшению */
    recommendations?: string;
};

/** Входные данные для валидации */
export type ValidationInput = {
    /** Источник входных данных */
    input: InputSource;
    /** Тип валидации */
    validationType: ValidationType;
    /** Дополнительный контекст */
    context?: string;
    /** Язык программирования */
    language?: string;
};

/** Типы валидации */
export type ValidationType = 'architecture' | 'code' | 'custom' | 'documentation' | 'prompts' | 'tests';

/** Источник входных данных */
export type InputSource = {
    /** Данные или путь */
    data: string;
    /** Тип источника */
    type: 'content' | 'file' | 'url';
    /** Кодировка для файлов */
    encoding?: 'ascii' | 'utf8' | 'utf16le';
};

// ========== ТЕСТИРОВАНИЕ ==========

/** Результат параллельного тестирования */
export type TestResult = {
    /** Время выполнения в миллисекундах */
    duration: number;
    /** Сообщение результата */
    message: string;
    /** Статус выполнения теста */
    status: 'error' | 'success' | 'timeout';
    /** Дополнительные данные */
    metadata?: Record<string, unknown>;
};

/** Входные данные для тестирования промпта */
export type TestPromptInput = {
    /** Промпт для тестирования */
    prompt: string;
    /** Дополнительный контекст */
    context?: string;
    /** Количество итераций */
    iterations?: number;
    /** Таймаут для каждого запроса */
    timeout?: number;
};

/** Результат одной итерации тестирования */
export type TestIterationResult = {
    /** Содержимое ответа */
    content: string;
    /** Время выполнения в мс */
    duration: number;
    /** Успешно ли выполнена итерация */
    isSuccess: boolean;
    /** Номер итерации */
    iteration: number;
    /** Использованная модель */
    model: string;
    /** Ошибка, если есть */
    error?: string;
};

/** Результат параллельного тестирования промпта */
export type TestPromptResult = {
    /** Среднее время выполнения */
    averageDuration: number;
    /** Индекс консистентности ответов */
    consistencyScore: number;
    /** Результаты всех итераций */
    results: TestIterationResult[];
    /** Общий успех тестирования */
    success: boolean;
    /** Успешные итерации */
    successfulIterations: number;
    /** Общее количество итераций */
    totalIterations: number;
    /** Ошибка, если тестирование не удалось */
    error?: string;
    /** Краткий отчет */
    summary?: string;
};

// ========== КОНФИГУРАЦИЯ ПРИЛОЖЕНИЯ ==========

/** Настройки AI модели */
export type ModelConfig = z.infer<typeof modelConfigSchema>;

/** Настройки API провайдера */
export type ApiConfig = z.infer<typeof apiConfigSchema>;

/** Настройки таймаутов */
export type TimeoutsConfig = z.infer<typeof timeoutsConfigSchema>;

/** Настройки логирования */
export type LoggingConfig = z.infer<typeof loggingConfigSchema>;

/** Настройки путей к ресурсам */
export type PathsConfig = z.infer<typeof pathsConfigSchema>;

/** Настройки среды выполнения приложения */
export type RuntimeConfig = z.infer<typeof runtimeConfigSchema>;

/** Настройки лимитов валидации */
export type ValidationLimitsConfig = z.infer<typeof validationLimitsSchema>;

/** Настройки порогов консистентности */
export type ConsistencyThresholdsConfig = z.infer<typeof consistencyThresholdsSchema>;

/** Конфигурация приложения */
export type AppConfig = z.infer<typeof appConfigSchema>;
