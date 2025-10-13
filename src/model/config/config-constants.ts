import type { AppConfig } from './types';

/** Кэшированная конфигурация приложения */
export const CACHED_CONFIG: AppConfig = {
    api: {
        key: '',
        mockClientPath: 'end-to-end/mocks/openrouter-test-client',
        provider: 'openrouter',
        url: 'https://openrouter.ai/api/v1',
    },
    logging: {
        level: 'INFO',
    },
    model: {
        maxTokens: 100000,
        name: 'openai/gpt-oss-120b',
        temperature: 0.5,
    },
    paths: {
        errors: '',
        prompts: '',
    },
    runtime: {
        environment: 'development',
        isE2ETest: false,
        nodePath: '',
    },
    testing: {
        consistencyThresholds: {
            anomalyLengthMultiplier: 0.5,
            anomalyLongMultiplier: 2.0,
            anomalySlowMultiplier: 1.5,
            timeLow: 0.3,
            varianceHigh: 0.7,
            varianceLow: 0.2,
            varianceMedium: 0.5,
        },
    },
    timeouts: {
        apiRequest: 30000,
        validation: 30000,
    },
    validation: {
        limits: {
            contextMaxLength: 5000,
            timeoutMax: 120000,
            timeoutMin: 1000,
        },
    },
};

/** Состояние конфигурации */
export const CONFIG_STATE = {
    error: null as Error | null,
};

/** Конфигурация приложения по умолчанию */
export const APP_CONFIG = CACHED_CONFIG;
