/** Константы конфигурации */
export { DEFAULT_LOGGING_CONFIG, DEFAULT_OPENROUTER_CONFIG, PACKAGE_RESOURCE_PATHS } from '../constants/main';

/** Схемы валидации конфигурации */
export {
    aiConfigSchema,
    appConfigSchema,
    logLevelSchema,
    runtimeConfigSchema,
    validationConfigSchema,
} from '../schemas/main';

/** Типы конфигурации */
export type { AiConfig, AppConfig, LogLevel, RuntimeConfig, ValidationConfig } from '../types/main';

/** Константы конфигурации приложения */
export { APP_CONFIG, CACHED_CONFIG, CONFIG_STATE } from './config-constants';

/** Функции работы с конфигурацией */
export { createAppConfig } from './create-app-config';
export { getAppConfigError } from './get-app-config-error';
export { reloadAppConfig } from './reload-app-config';
