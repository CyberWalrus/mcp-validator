import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { registerValidatorPrompts } from '../register-validator-prompts';

type RegisteredPrompt = {
    argsSchema: Record<string, unknown>;
    description: string;
    title: string;
};

/** Хелпер для получения зарегистрированных промптов */
function getRegisteredPrompts(server: McpServer): Record<string, RegisteredPrompt> {
    // eslint-disable-next-line no-underscore-dangle
    return (server as unknown as { _registeredPrompts: Record<string, RegisteredPrompt> })._registeredPrompts;
}

/** Создаёт мок MCP сервера */
function createMockServer(): McpServer {
    const registeredPrompts: Record<string, RegisteredPrompt> = {};

    return {
        _registeredPrompts: registeredPrompts,
        registerPrompt: vi.fn((name: string, options: RegisteredPrompt) => {
            registeredPrompts[name] = options;
        }),
    } as unknown as McpServer;
}

describe('registerValidatorPrompts', () => {
    it('должен регистрировать 5 промптов', () => {
        const server = createMockServer();

        registerValidatorPrompts(server);

        const prompts = getRegisteredPrompts(server);
        const promptNames = Object.keys(prompts);

        expect(promptNames).toHaveLength(5);
    });

    it('должен регистрировать промпт validate-code', () => {
        const server = createMockServer();

        registerValidatorPrompts(server);

        const prompts = getRegisteredPrompts(server);

        expect(prompts['validate-code']).toBeDefined();
        expect(prompts['validate-code'].title).toBe('Валидация кода');
    });

    it('должен регистрировать промпт validate-tests', () => {
        const server = createMockServer();

        registerValidatorPrompts(server);

        const prompts = getRegisteredPrompts(server);

        expect(prompts['validate-tests']).toBeDefined();
        expect(prompts['validate-tests'].title).toBe('Валидация тестов');
    });

    it('должен регистрировать промпт validate-architecture', () => {
        const server = createMockServer();

        registerValidatorPrompts(server);

        const prompts = getRegisteredPrompts(server);

        expect(prompts['validate-architecture']).toBeDefined();
        expect(prompts['validate-architecture'].title).toBe('Валидация архитектуры');
    });

    it('должен регистрировать промпт test-consistency', () => {
        const server = createMockServer();

        registerValidatorPrompts(server);

        const prompts = getRegisteredPrompts(server);

        expect(prompts['test-consistency']).toBeDefined();
        expect(prompts['test-consistency'].title).toBe('Тест консистентности промпта');
    });

    it('должен регистрировать промпт verify-facts', () => {
        const server = createMockServer();

        registerValidatorPrompts(server);

        const prompts = getRegisteredPrompts(server);

        expect(prompts['verify-facts']).toBeDefined();
        expect(prompts['verify-facts'].title).toBe('Проверка фактов');
    });

    it('должен вызывать server.registerPrompt для каждого промпта', () => {
        const server = createMockServer();

        registerValidatorPrompts(server);

        expect(server.registerPrompt).toHaveBeenCalledTimes(5);
    });

    it('должен содержать argsSchema с filePath в validate-code', () => {
        const server = createMockServer();

        registerValidatorPrompts(server);

        const prompts = getRegisteredPrompts(server);

        expect(prompts['validate-code'].argsSchema).toBeDefined();
        expect(prompts['validate-code'].argsSchema.filePath).toBeDefined();
    });

    it('должен содержать argsSchema с focus в validate-code', () => {
        const server = createMockServer();

        registerValidatorPrompts(server);

        const prompts = getRegisteredPrompts(server);

        expect(prompts['validate-code'].argsSchema.focus).toBeDefined();
    });

    it('должен содержать argsSchema с prompt в test-consistency', () => {
        const server = createMockServer();

        registerValidatorPrompts(server);

        const prompts = getRegisteredPrompts(server);

        expect(prompts['test-consistency'].argsSchema.prompt).toBeDefined();
    });

    it('должен содержать argsSchema с iterations в test-consistency', () => {
        const server = createMockServer();

        registerValidatorPrompts(server);

        const prompts = getRegisteredPrompts(server);

        expect(prompts['test-consistency'].argsSchema.iterations).toBeDefined();
    });

    it('должен содержать argsSchema с text в verify-facts', () => {
        const server = createMockServer();

        registerValidatorPrompts(server);

        const prompts = getRegisteredPrompts(server);

        expect(prompts['verify-facts'].argsSchema.text).toBeDefined();
    });

    it('должен содержать описание в каждом промпте', () => {
        const server = createMockServer();

        registerValidatorPrompts(server);

        const prompts = getRegisteredPrompts(server);

        expect(prompts['validate-code'].description).toBe(
            'Проверка качества TypeScript/JavaScript кода с детальным отчётом',
        );
        expect(prompts['validate-tests'].description).toBe('Анализ качества и полноты тестового покрытия');
        expect(prompts['validate-architecture'].description).toBe('Проверка архитектурных решений и паттернов');
        expect(prompts['test-consistency'].description).toBe(
            'Параллельное тестирование промпта на стабильность ответов',
        );
        expect(prompts['verify-facts'].description).toBe('Верификация информации через 3 параллельные проверки');
    });
});
