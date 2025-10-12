/* eslint-disable @typescript-eslint/consistent-type-definitions */
/** Расширение типов для переменных окружения Node.js */
declare namespace NodeJS {
    interface ProcessEnv {
        /** Уровень логирования (DEBUG, INFO, WARN, ERROR) */
        LOG_LEVEL?: 'DEBUG' | 'ERROR' | 'INFO' | 'WARN';
        MCP_E2E_TEST?: 'false' | 'true';
        NODE_ENV?: 'development' | 'production' | 'test';
        OPENROUTER_API_KEY?: string;
        /** Путь к папке с промптами (опционально) */
        PROMPTS_PATH?: string;
    }
}
