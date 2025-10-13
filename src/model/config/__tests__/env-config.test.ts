import { APP_CONFIG, createAppConfig, getAppConfigError, reloadAppConfig } from '../index';

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
        process.env.API_KEY = 'test-api-key';
        process.env.API_URL = 'https://api.openrouter.ai/api/v1';
        process.env.TIMEOUT_API_REQUEST = '30000';
        process.env.LOG_LEVEL = 'INFO';

        const config = createAppConfig();

        expect(config).toEqual({
            api: {
                key: 'test-api-key',
                mockClientPath: 'end-to-end/mocks/openrouter-test-client',
                provider: 'openrouter',
                url: 'https://api.openrouter.ai/api/v1',
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
                errors: expect.any(String),
                prompts: expect.any(String),
            },
            runtime: {
                environment: process.env.NODE_ENV ?? 'development',
                isE2ETest: false,
                nodePath: '',
            },
            timeouts: {
                apiRequest: 30000,
                validation: 30000,
            },
        });
    });

    it('должен использовать значения по умолчанию для необязательных переменных', () => {
        process.env.OPENROUTER_API_KEY = 'test-key';
        delete process.env.OPENROUTER_API_URL;
        delete process.env.TIMEOUT_API_REQUEST;

        const config = createAppConfig();

        expect(config.model.name).toBe('openai/gpt-oss-120b');
        expect(config.model.maxTokens).toBe(100000);
        expect(config.model.temperature).toBe(0.5);
        expect(config.api.url).toBe('https://openrouter.ai/api/v1');
        expect(config.timeouts.apiRequest).toBe(30000);
        expect(config.timeouts.validation).toBe(30000);
        expect(config.api.mockClientPath).toBe('end-to-end/mocks/openrouter-test-client');
        expect(config.logging.level).toBe('INFO');
        expect(config.runtime).toEqual({
            environment: process.env.NODE_ENV ?? 'development',
            isE2ETest: false,
            nodePath: '',
        });
    });

    it('должен выбрасывать ошибку при отсутствии обязательной переменной API_KEY', () => {
        delete process.env.API_KEY;

        expect(() => createAppConfig()).toThrow('API_KEY is required');
    });

    it('должен выбрасывать ошибку при некорректном значении LOG_LEVEL', () => {
        process.env.OPENROUTER_API_KEY = 'test-key';
        process.env.LOG_LEVEL = 'invalid-level' as unknown as 'DEBUG' | 'ERROR' | 'INFO' | 'WARN';

        expect(() => createAppConfig()).toThrow();
    });

    it('должен выбрасывать ошибку при некорректном значении TIMEOUT_API_REQUEST', () => {
        process.env.OPENROUTER_API_KEY = 'test-key';
        process.env.TIMEOUT_API_REQUEST = 'not-a-number';

        expect(() => createAppConfig()).toThrow();
    });

    it('должен использовать кастомный путь к мок клиенту из переменной окружения', () => {
        process.env.API_KEY = 'test-key';
        process.env.API_MOCK_CLIENT_PATH = 'custom/mock/path';

        const config = createAppConfig();

        expect(config.api.mockClientPath).toBe('custom/mock/path');
    });
});

describe('APP_CONFIG', () => {
    it('должен быть доступен и содержать корректную структуру', () => {
        expect(APP_CONFIG).toBeDefined();
        expect(APP_CONFIG.model).toBeDefined();
        expect(APP_CONFIG.api).toBeDefined();
        expect(APP_CONFIG.timeouts).toBeDefined();
        expect(APP_CONFIG.logging).toBeDefined();
        expect(APP_CONFIG.paths).toBeDefined();
        expect(APP_CONFIG.runtime).toBeDefined();
    });
});

describe('getAppConfigError', () => {
    it('должен возвращать null при отсутствии ошибок', () => {
        expect(getAppConfigError()).toBeNull();
    });
});
