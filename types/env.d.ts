/* eslint-disable @typescript-eslint/consistent-type-definitions */
/** Расширение типов для переменных окружения Node.js */
declare namespace NodeJS {
    interface ProcessEnv {
        /** Максимальное количество токенов для AI запросов */
        AI_MAX_TOKENS?: string;
        /** Модель AI для использования */
        AI_MODEL?: string;
        /** Температура для AI модели (0-2) */
        AI_TEMPERATURE?: string;
        /** API ключ для OpenRouter */
        API_KEY?: string;
        /** Путь к mock клиенту для тестирования */
        API_MOCK_CLIENT_PATH?: string;
        /** URL API провайдера (по умолчанию OpenRouter) */
        API_URL?: string;
        /** Уровень логирования (DEBUG, INFO, WARN, ERROR) */
        LOG_LEVEL?: 'DEBUG' | 'ERROR' | 'INFO' | 'WARN';
        /** Флаг для E2E тестирования */
        MCP_E2E_TEST?: 'false' | 'true';
        /** Окружение приложения */
        NODE_ENV?: 'development' | 'production' | 'test';
        /** Путь к Node.js исполняемому файлу */
        NODE_PATH?: string;
        /** Путь к директории с промптами */
        PROMPTS_PATH?: string;
        /** Таймаут для API запросов в миллисекундах */
        TIMEOUT_API_REQUEST?: string;
        /** Таймаут для валидации в миллисекундах */
        TIMEOUT_VALIDATION?: string;
    }
}
