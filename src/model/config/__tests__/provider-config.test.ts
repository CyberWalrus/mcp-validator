import { describe, expect, it } from 'vitest';

import { APP_CONFIG, initializeAppConfig } from '../initialize-app-config';

describe('API Providers Configuration', () => {
    it('должен НЕ устанавливать providers если env не задана', () => {
        initializeAppConfig({ API_KEY: 'test-key' });
        expect(APP_CONFIG.api.providers).toBeUndefined();
    });

    it('должен парсить один провайдер из env переменной API_PROVIDERS', () => {
        initializeAppConfig({
            API_KEY: 'test-key',
            API_PROVIDERS: 'Cerebras',
        });
        expect(APP_CONFIG.api.providers).toEqual(['Cerebras']);
    });

    it('должен парсить несколько провайдеров через запятую', () => {
        initializeAppConfig({
            API_KEY: 'test-key',
            API_PROVIDERS: 'Cerebras, OpenAI, Qwen',
        });
        expect(APP_CONFIG.api.providers).toEqual(['Cerebras', 'OpenAI', 'Qwen']);
    });

    it('должен удалять пробелы вокруг имен провайдеров', () => {
        initializeAppConfig({
            API_KEY: 'test-key',
            API_PROVIDERS: '  Cerebras  ,  OpenAI  ',
        });
        expect(APP_CONFIG.api.providers).toEqual(['Cerebras', 'OpenAI']);
    });

    it('должен игнорировать пустые элементы', () => {
        initializeAppConfig({
            API_KEY: 'test-key',
            API_PROVIDERS: 'Cerebras,,OpenAI,',
        });
        expect(APP_CONFIG.api.providers).toEqual(['Cerebras', 'OpenAI']);
    });
});

