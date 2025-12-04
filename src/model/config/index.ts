/** Типы конфигурации */
export type {
    ApiConfig,
    AppConfig,
    ConsistencyThresholdsConfig,
    HttpTransportConfig,
    LoggingConfig,
    LogLevel,
    ModelConfig,
    PathsConfig,
    RuntimeConfig,
    TimeoutsConfig,
    TransportConfig,
    TransportType,
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
    VerificationCheckResult,
    VerifyInfoInput,
    VerifyInfoResult,
} from './types';

/** Конфигурация приложения и функция инициализации */
export { APP_CONFIG, initializeAppConfig } from './initialize-app-config';
