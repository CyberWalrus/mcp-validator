// Инициализируем конфигурацию и кэш промптов
import { initializePromptCache } from './lib/cache';
import { reloadAppConfig } from './model/config';

export {};

if (!process.env.OPENROUTER_API_KEY) {
    process.env.OPENROUTER_API_KEY = 'test-api-key';
}

if (!process.env.LOG_LEVEL) {
    process.env.LOG_LEVEL = 'INFO';
}

await reloadAppConfig();

initializePromptCache();
