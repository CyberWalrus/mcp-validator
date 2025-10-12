export {};

if (!process.env.OPENROUTER_API_KEY) {
    process.env.OPENROUTER_API_KEY = 'test-api-key';
}

if (!process.env.LOG_LEVEL) {
    process.env.LOG_LEVEL = 'INFO';
}

// Инициализируем конфигурацию и кэш промптов
import { reloadAppConfig } from './model/config';
import { initializePromptCache } from './lib/cache';

// Сначала инициализируем конфигурацию
await reloadAppConfig();

// Затем инициализируем кэш промптов
initializePromptCache();
