import { APP_CONFIG, createAppConfig, getAppConfigError, reloadAppConfig } from '../env-config';

describe('createAppConfig', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        process.env = { ...originalEnv };
    });

    afterEach(() => {
        process.env = originalEnv;
        reloadAppConfig();
    });

    it('должен возвращать корректную конфигурацию с валидными env переменными', () => {
        process.env.OPENROUTER_API_KEY = 'test-api-key';
        process.env.OPENROUTER_API_URL = 'https://api.openrouter.ai/api/v1';
        process.env.OPENROUTER_TIMEOUT = '30000';
        process.env.LOG_LEVEL = 'INFO';

        const config = createAppConfig();

        expect(config).toEqual({
            ai: {
                defaultModel: 'openai/gpt-oss-120b',
                maxTokens: 100000,
                temperature: 0.5,
            },
            logging: {
                level: 'INFO',
            },
            openRouter: {
                apiKey: 'test-api-key',
                apiUrl: 'https://api.openrouter.ai/api/v1',
                mockClientPath: 'end-to-end/mocks/openrouter-test-client',
                timeout: 30000,
            },
            paths: {
                errors: expect.any(String),
                prompts: expect.any(String),
            },
            runtime: {
                environment: process.env.NODE_ENV ?? 'development',
                isE2ETest: false,
                isTestMode: process.env.NODE_ENV === 'test',
                nodePath: '',
            },
            validation: {
                timeout: 30000,
            },
        });
    });

    it('должен использовать значения по умолчанию для необязательных переменных', () => {
        process.env.OPENROUTER_API_KEY = 'test-key';
        delete process.env.OPENROUTER_API_URL;
        delete process.env.OPENROUTER_TIMEOUT;
        delete process.env.LOG_LEVEL;

        const config = createAppConfig();

        expect(config.ai.defaultModel).toBe('openai/gpt-oss-120b');
        expect(config.ai.maxTokens).toBe(100000);
        expect(config.ai.temperature).toBe(0.5);
        expect(config.openRouter.apiUrl).toBe('https://openrouter.ai/api/v1');
        expect(config.openRouter.timeout).toBe(30000);
        expect(config.openRouter.mockClientPath).toBe('end-to-end/mocks/openrouter-test-client');
        expect(config.logging.level).toBe('INFO');
        expect(config.runtime).toEqual({
            environment: process.env.NODE_ENV ?? 'development',
            isE2ETest: false,
            isTestMode: process.env.NODE_ENV === 'test',
            nodePath: '',
        });
        expect(config.validation.timeout).toBe(30000);
    });

    it('должен выбрасывать ошибку при отсутствии обязательной переменной OPENROUTER_API_KEY', () => {
        delete process.env.OPENROUTER_API_KEY;

        expect(() => createAppConfig()).toThrow('OPENROUTER_API_KEY is required');
    });

    it('должен выбрасывать ошибку при некорректном значении LOG_LEVEL', () => {
        process.env.OPENROUTER_API_KEY = 'test-key';
        process.env.LOG_LEVEL = 'invalid-level' as any;

        expect(() => createAppConfig()).toThrow();
    });

    it('должен выбрасывать ошибку при некорректном значении OPENROUTER_TIMEOUT', () => {
        process.env.OPENROUTER_API_KEY = 'test-key';
        process.env.OPENROUTER_TIMEOUT = 'not-a-number';

        expect(() => createAppConfig()).toThrow();
    });

    it('должен использовать кастомный путь к мок клиенту из переменной окружения', () => {
        process.env.OPENROUTER_API_KEY = 'test-key';
        process.env.OPENROUTER_MOCK_CLIENT_PATH = 'custom/path/to/mock-client';

        const config = createAppConfig();

        expect(config.openRouter.mockClientPath).toBe('custom/path/to/mock-client');
    });
});

describe('reloadAppConfig', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        process.env = { ...originalEnv };
        process.env.OPENROUTER_API_KEY = 'test-key';
        reloadAppConfig();
    });

    afterEach(() => {
        process.env = originalEnv;
        reloadAppConfig();
    });

    it('должен обновлять конфигурацию при изменении переменных окружения', () => {
        process.env.OPENROUTER_API_KEY = 'updated-key';
        process.env.OPENROUTER_API_URL = 'https://api.openrouter.ai/api/v2';
        process.env.OPENROUTER_TIMEOUT = '15000';
        process.env.LOG_LEVEL = 'DEBUG';

        reloadAppConfig();

        expect(getAppConfigError()).toBeNull();
        expect(APP_CONFIG.ai).toEqual(
            expect.objectContaining({
                defaultModel: 'openai/gpt-oss-120b',
                maxTokens: 100000,
                temperature: 0.5,
            }),
        );
        expect(APP_CONFIG.openRouter).toEqual(
            expect.objectContaining({
                apiKey: 'updated-key',
                apiUrl: 'https://api.openrouter.ai/api/v2',
                mockClientPath: 'end-to-end/mocks/openrouter-test-client',
                timeout: 15000,
            }),
        );
        expect(APP_CONFIG.logging.level).toBe('DEBUG');
        expect(APP_CONFIG.validation.timeout).toBe(30000);
    });

    it('должен устанавливать ошибку при отсутствии обязательных переменных', () => {
        delete process.env.OPENROUTER_API_KEY;

        reloadAppConfig();

        const configError = getAppConfigError();
        expect(configError).toBeInstanceOf(Error);
        expect(configError?.message).toBe('OPENROUTER_API_KEY is required');
    });
});
