import { initializePromptCache } from './lib/cache';
import { initializeAppConfig } from './model/config';

/** Инициализирует тестовое окружение */
export function initTestEnvironment(): void {
    if (!process.env.API_KEY) {
        process.env.API_KEY = 'test-api-key';
    }

    if (!process.env.LOG_LEVEL) {
        process.env.LOG_LEVEL = 'WARN';
    }

    initializeAppConfig();
    initializePromptCache();
}

initTestEnvironment();
