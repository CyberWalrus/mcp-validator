import { APP_CONFIG, initializeAppConfig } from '../index';

describe('initializeAppConfig', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        process.env = { ...originalEnv };
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    it('должен инициализировать конфигурацию с валидными env переменными', () => {
        process.env.API_KEY = 'test-api-key';
        process.env.API_URL = 'https://api.openrouter.ai/api/v1';
        process.env.TIMEOUT_API_REQUEST = '30000';
        process.env.LOG_LEVEL = 'INFO';

        initializeAppConfig();

        expect(APP_CONFIG).toEqual({
            api: {
                key: 'test-api-key',
                mockClientPath: 'end-to-end/mocks/openrouter-test-client',
                providers: undefined,
                url: 'https://api.openrouter.ai/api/v1',
            },
            logging: {
                level: 'INFO',
            },
            mcp: {
                description: 'Production-ready MCP validator for Cursor IDE with 4 validation types',
                name: 'mcp-validator',
                protocolVersion: '2024-11-05',
                version: '0.3.0',
            },
            model: {
                maxTokens: 100000,
                name: 'openai/gpt-oss-20b:free',
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
        });
    });

    it('должен использовать значения по умолчанию для необязательных переменных', () => {
        process.env.API_KEY = 'test-key';
        delete process.env.API_URL;
        delete process.env.TIMEOUT_API_REQUEST;
        delete process.env.LOG_LEVEL;

        initializeAppConfig();

        expect(APP_CONFIG.model.name).toBe('openai/gpt-oss-20b:free');
        expect(APP_CONFIG.model.maxTokens).toBe(100000);
        expect(APP_CONFIG.model.temperature).toBe(0.5);
        expect(APP_CONFIG.api.url).toBe('https://openrouter.ai/api/v1');
        expect(APP_CONFIG.timeouts.apiRequest).toBe(30000);
        expect(APP_CONFIG.timeouts.validation).toBe(30000);
        expect(APP_CONFIG.api.mockClientPath).toBe('end-to-end/mocks/openrouter-test-client');
        expect(APP_CONFIG.logging.level).toBe('INFO');
        expect(APP_CONFIG.runtime).toEqual({
            environment: process.env.NODE_ENV ?? 'development',
            isE2ETest: false,
            nodePath: '',
        });
    });

    it('должен выбрасывать ошибку при отсутствии обязательной переменной API_KEY', () => {
        delete process.env.API_KEY;

        expect(() => initializeAppConfig()).toThrow('API_KEY is required');
    });

    it('должен выбрасывать ошибку при некорректном значении LOG_LEVEL', () => {
        process.env.API_KEY = 'test-key';
        process.env.LOG_LEVEL = 'invalid-level' as unknown as 'DEBUG' | 'ERROR' | 'INFO' | 'WARN';

        expect(() => initializeAppConfig()).toThrow();
    });

    it('должен выбрасывать ошибку при некорректном значении TIMEOUT_API_REQUEST', () => {
        process.env.API_KEY = 'test-key';
        process.env.TIMEOUT_API_REQUEST = 'not-a-number';

        expect(() => initializeAppConfig()).toThrow();
    });

    it('должен использовать кастомный путь к мок клиенту из переменной окружения', () => {
        process.env.API_KEY = 'test-key';
        process.env.API_MOCK_CLIENT_PATH = 'custom/mock/path';

        initializeAppConfig();

        expect(APP_CONFIG.api.mockClientPath).toBe('custom/mock/path');
    });
});

describe('APP_CONFIG', () => {
    it('должен быть доступен и содержать корректную структуру после инициализации', () => {
        process.env.API_KEY = 'test-key';
        initializeAppConfig();

        expect(APP_CONFIG).toBeDefined();
        expect(APP_CONFIG.model).toBeDefined();
        expect(APP_CONFIG.api).toBeDefined();
        expect(APP_CONFIG.timeouts).toBeDefined();
        expect(APP_CONFIG.logging).toBeDefined();
        expect(APP_CONFIG.paths).toBeDefined();
        expect(APP_CONFIG.runtime).toBeDefined();
    });
});
