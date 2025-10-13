/** Константы конфигурации */
export { DEFAULT_LOGGING_CONFIG, DEFAULT_OPENROUTER_CONFIG, PACKAGE_RESOURCE_PATHS } from './constants';

/** Схемы валидации конфигурации */
export {
    apiConfigSchema,
    appConfigSchema,
    consistencyThresholdsSchema,
    logLevelSchema,
    modelConfigSchema,
    runtimeConfigSchema,
    timeoutsConfigSchema,
    validationLimitsSchema,
} from './schemas';

/** Типы конфигурации */
export type {
    ApiConfig,
    AppConfig,
    ConsistencyThresholdsConfig,
    LoggingConfig,
    LogLevel,
    ModelConfig,
    PathsConfig,
    RuntimeConfig,
    TimeoutsConfig,
    ValidationLimitsConfig,
} from './types';

/** Типы валидации и тестирования */
export type {
    ConsistencyAnalysis,
    InputSource,
    InputSourceWithoutEncoding,
    ParallelTestParams,
    ParallelTestResult,
    TestIterationResult,
    TestPromptInput,
    TestPromptResult,
    TestResult,
    ValidationInput,
    ValidationInputWithoutEncoding,
    ValidationResult,
    ValidationType,
} from './types';

/** Конфигурация приложения и функция инициализации */
export { APP_CONFIG, initializeAppConfig } from './initialize-app-config';
