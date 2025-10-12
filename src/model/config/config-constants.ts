import type { AppConfig } from '../types/main';

/** Кэшированная конфигурация приложения */
export const CACHED_CONFIG: AppConfig = {
    ai: {
        defaultModel: 'openai/gpt-oss-120b',
        maxTokens: 100000,
        temperature: 0.5,
    },
    logging: {
        level: 'INFO',
    },
    openRouter: {
        apiKey: '',
        apiUrl: 'https://openrouter.ai/api/v1',
        mockClientPath: 'end-to-end/mocks/openrouter-test-client',
        timeout: 30000,
    },
    paths: {
        errors: '',
        prompts: '',
    },
    runtime: {
        environment: 'development',
        isE2ETest: false,
        isTestMode: false,
        nodePath: '',
    },
    validation: {
        timeout: 30000,
    },
};

/** Состояние конфигурации */
export const CONFIG_STATE = {
    error: null as Error | null,
};

/** Конфигурация приложения по умолчанию */
export const APP_CONFIG = CACHED_CONFIG;
