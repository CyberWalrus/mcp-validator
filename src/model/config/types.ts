/** Единый источник типов для всего проекта - все типы выводятся из Zod-схем */

import type { z } from 'zod';

import type {
    ConsistencyAnalysisSchema,
    ParallelTestParamsSchema,
    ParallelTestResultSchema,
    TestIterationResultSchema,
} from '../../services/workflows/testing/schemas';
import type {
    inputSourceSchema,
    validationInputSchema,
    validationResultSchema,
    validationTypeSchema,
} from '../schemas/validation-schema';
import type {
    verificationCheckResultSchema,
    verifyInfoInputSchema,
    verifyInfoResultSchema,
} from '../schemas/verify-info-schema';
import type {
    apiConfigSchema,
    appConfigSchema,
    consistencyThresholdsSchema,
    httpTransportConfigSchema,
    loggingConfigSchema,
    logLevelSchema,
    mcpConfigSchema,
    modelConfigSchema,
    pathsConfigSchema,
    runtimeConfigSchema,
    timeoutsConfigSchema,
    transportConfigSchema,
    transportTypeSchema,
    validationLimitsSchema,
} from './schemas';

// ========== КОНФИГУРАЦИЯ ПРИЛОЖЕНИЯ ==========

/** Уровни логирования для системы */
export type LogLevel = z.infer<typeof logLevelSchema>;

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

/** Тип транспорта для MCP сервера */
export type TransportType = z.infer<typeof transportTypeSchema>;

/** Настройки HTTP транспорта */
export type HttpTransportConfig = z.infer<typeof httpTransportConfigSchema>;

/** Настройки транспорта */
export type TransportConfig = z.infer<typeof transportConfigSchema>;

/** Настройки MCP сервера */
export type McpConfig = z.infer<typeof mcpConfigSchema>;

/** Конфигурация приложения */
export type AppConfig = z.infer<typeof appConfigSchema>;

// ========== ВАЛИДАЦИЯ ==========

/** Типы валидации */
export type ValidationType = z.infer<typeof validationTypeSchema>;

/** Источник входных данных */
export type InputSource = z.infer<typeof inputSourceSchema>;

/** Источник входных данных без encoding (для тестов) */
export type InputSourceWithoutEncoding = Omit<InputSource, 'encoding'> & {
    encoding?: InputSource['encoding'];
};

/** Входные данные для валидации */
export type ValidationInput = z.infer<typeof validationInputSchema>;

/** Входные данные для валидации без encoding (для тестов) */
export type ValidationInputWithoutEncoding = Omit<ValidationInput, 'input'> & {
    input: InputSourceWithoutEncoding;
};

/** Результат валидации */
export type ValidationResult = z.infer<typeof validationResultSchema>;

// ========== ТЕСТИРОВАНИЕ ==========

/** Параметры параллельного тестирования */
export type ParallelTestParams = z.infer<typeof ParallelTestParamsSchema>;

/** Результат одной итерации тестирования */
export type TestIterationResult = z.infer<typeof TestIterationResultSchema>;

/** Анализ консистентности */
export type ConsistencyAnalysis = z.infer<typeof ConsistencyAnalysisSchema>;

/** Результат параллельного тестирования */
export type ParallelTestResult = z.infer<typeof ParallelTestResultSchema>;

// ========== ВСПОМОГАТЕЛЬНЫЕ ТИПЫ ==========

/** Результат параллельного тестирования (legacy) */
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

/** Входные данные для тестирования промпта (legacy) */
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

/** Результат параллельного тестирования промпта (legacy) */
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

// ========== ПРОВЕРКА ИНФОРМАЦИИ ==========

/** Входные данные для проверки информации */
export type VerifyInfoInput = z.infer<typeof verifyInfoInputSchema>;

/** Результат одной проверки */
export type VerificationCheckResult = z.infer<typeof verificationCheckResultSchema>;

/** Результат проверки информации */
export type VerifyInfoResult = z.infer<typeof verifyInfoResultSchema>;
