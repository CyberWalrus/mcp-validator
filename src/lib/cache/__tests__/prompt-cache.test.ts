import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import type { GetPromptFn, InitializePromptCacheFn } from '../prompt-cache';

const originalApiKey = process.env.OPENROUTER_API_KEY;
let getPrompt: GetPromptFn;
let initializePromptCache: InitializePromptCacheFn;

beforeEach(async () => {
    vi.resetModules();
    process.env.OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || 'test-key';

    const cacheModule = await import('../prompt-cache');

    getPrompt = cacheModule.getPrompt;
    initializePromptCache = cacheModule.initializePromptCache;
});

afterAll(() => {
    if (originalApiKey === undefined) {
        delete process.env.OPENROUTER_API_KEY;
    } else {
        process.env.OPENROUTER_API_KEY = originalApiKey;
    }
});

describe('initializePromptCache', () => {
    it('должен успешно инициализировать кэш промптов', () => {
        expect(() => initializePromptCache()).not.toThrow();
    });

    it('должен загрузить все промпты валидации в кэш', () => {
        initializePromptCache();

        const validationPrompts = [
            'validate-code.md',
            'validate-architecture.md',
            'validate-documentation.md',
            'validate-prompts.md',
            'validate-tests.md',
        ];

        validationPrompts.forEach((promptId) => {
            expect(() => getPrompt(promptId)).not.toThrow();
            const content = getPrompt(promptId);
            expect(typeof content).toBe('string');
            expect(content.length).toBeGreaterThan(0);
        });
    });

    it('должен загрузить все промпты тестирования в кэш', () => {
        initializePromptCache();

        const testingPrompts = ['test-prompt.md', 'execute-prompt-test.md'];

        testingPrompts.forEach((promptId) => {
            expect(() => getPrompt(promptId)).not.toThrow();
            const content = getPrompt(promptId);
            expect(typeof content).toBe('string');
            expect(content.length).toBeGreaterThan(0);
        });
    });

    it('должен загрузить все шаблоны ошибок в кэш', () => {
        initializePromptCache();

        const errorTemplates = ['file-error.md', 'system-error.md', 'validation-error.md'];

        errorTemplates.forEach((templateId) => {
            expect(() => getPrompt(templateId)).not.toThrow();
            const content = getPrompt(templateId);
            expect(typeof content).toBe('string');
            expect(content.length).toBeGreaterThan(0);
        });
    });
});

describe('getPrompt', () => {
    it('должен выбросить ошибку для несуществующего промпта до инициализации', () => {
        expect(() => getPrompt('nonexistent.md')).toThrow('Промпт "nonexistent.md" не найден в кэше');
    });

    it('должен выбросить ошибку для несуществующего промпта после инициализации', () => {
        initializePromptCache();

        expect(() => getPrompt('nonexistent.md')).toThrow('Промпт "nonexistent.md" не найден в кэше');
    });

    it('должен вернуть кэшированный контент для существующего промпта', () => {
        initializePromptCache();

        const content = getPrompt('validate-code.md');
        expect(typeof content).toBe('string');
        expect(content.length).toBeGreaterThan(0);

        const contentSecondCall = getPrompt('validate-code.md');
        expect(contentSecondCall).toBe(content);
    });

    it('должен корректно работать с промптами содержащими специальные символы', () => {
        initializePromptCache();

        const promptPath = resolve(__dirname, '../../../../prompts/validation/validate-code.md');
        const fileExists = existsSync(promptPath);

        if (fileExists) {
            const content = getPrompt('validate-code.md');
            expect(content).toBeDefined();
            expect(typeof content).toBe('string');
        }
    });
});
