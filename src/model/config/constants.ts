/** Объединенные константы из model/config - новая единая структура */

/** Значения по умолчанию для конфигурации OpenRouter */
export const DEFAULT_OPENROUTER_CONFIG = {
    /** URL API OpenRouter по умолчанию */
    API_URL: 'https://openrouter.ai/api/v1',
    /** Таймаут запросов по умолчанию в миллисекундах */
    TIMEOUT: 30000,
} as const;

/** Значения по умолчанию для логирования */
export const DEFAULT_LOGGING_CONFIG = {
    /** Уровень логирования по умолчанию */
    LEVEL: 'INFO',
} as const;

/** Относительные пути к ресурсам пакета */
export const PACKAGE_RESOURCE_PATHS = {
    /** Путь к директории с шаблонами ошибок */
    ERRORS: 'prompts/errors',
    /** Путь к директории с промптами */
    PROMPTS: 'prompts',
} as const;
