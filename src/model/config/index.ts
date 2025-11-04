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
