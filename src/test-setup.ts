import { initializePromptCache } from './lib/cache';
import { reloadAppConfig } from './model/config';

/** Инициализирует тестовое окружение */
export async function initTestEnvironment(): Promise<void> {
    if (!process.env.API_KEY) {
        process.env.API_KEY = 'test-api-key';
    }

    if (!process.env.LOG_LEVEL) {
        process.env.LOG_LEVEL = 'INFO';
    }

    await reloadAppConfig();
    initializePromptCache();
}

await initTestEnvironment();
