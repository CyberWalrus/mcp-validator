export {};

if (!process.env.OPENROUTER_API_KEY) {
    process.env.OPENROUTER_API_KEY = 'test-api-key';
}

if (!process.env.LOG_LEVEL) {
    process.env.LOG_LEVEL = 'INFO';
}

async function initializePromptCacheForTests(): Promise<void> {
    const { initializePromptCache } = await import('./lib/cache/prompt-cache');

    initializePromptCache();
}

await initializePromptCacheForTests();

async function initializeAppConfigForTests(): Promise<void> {
    const { reloadAppConfig } = await import('./model/config');

    reloadAppConfig();
}

await initializeAppConfigForTests();
