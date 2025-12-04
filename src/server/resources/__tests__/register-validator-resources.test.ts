import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

vi.mock('../../../lib/cache', () => ({
    getPrompt: vi.fn((id: string) => {
        if (id === 'validate-code.md') {
            return '# Code Validation Prompt';
        }
        if (id === 'validate-tests.md') {
            return '# Tests Validation Prompt';
        }
        throw new Error(`Промпт "${id}" не найден в кэше`);
    }),
}));

vi.mock('../../../model/config', () => ({
    APP_CONFIG: {
        mcp: { name: 'mcp-validator', protocolVersion: '2024-11-05', version: '1.0.0' },
        model: { maxTokens: 100000, name: 'openai/gpt-4', temperature: 0.5 },
        timeouts: { apiRequest: 30000, validation: 30000 },
    },
}));

/** Извлекает шаблон URI из ResourceTemplate */
function extractUriTemplate(resourceTemplate: unknown): string {
    const template = resourceTemplate as { _uriTemplate?: { template?: string } };

    // eslint-disable-next-line no-underscore-dangle
    return template._uriTemplate?.template ?? '';
}

describe('registerValidatorResources', () => {
    beforeEach(() => {
        vi.resetModules();
    });

    it('должен регистрировать ресурс config', async () => {
        const { registerValidatorResources } = await import('../register-validator-resources');

        const mockServer = {
            registerResource: vi.fn(),
        } as unknown as McpServer;

        registerValidatorResources(mockServer);

        expect(mockServer.registerResource).toHaveBeenCalledWith(
            'config',
            'validator://config',
            expect.objectContaining({
                mimeType: 'application/json',
                title: 'Конфигурация валидатора',
            }),
            expect.any(Function),
        );
    });

    it('должен регистрировать ресурс validation-prompt с ResourceTemplate', async () => {
        const { registerValidatorResources } = await import('../register-validator-resources');

        const mockServer = {
            registerResource: vi.fn(),
        } as unknown as McpServer;

        registerValidatorResources(mockServer);

        const call = vi.mocked(mockServer.registerResource).mock.calls.find((args) => args[0] === 'validation-prompt');

        expect(call).toBeDefined();
        expect(extractUriTemplate(call![1])).toBe('validator://prompts/{type}');
    });

    it('должен регистрировать ресурс languages', async () => {
        const { registerValidatorResources } = await import('../register-validator-resources');

        const mockServer = {
            registerResource: vi.fn(),
        } as unknown as McpServer;

        registerValidatorResources(mockServer);

        expect(mockServer.registerResource).toHaveBeenCalledWith(
            'languages',
            'validator://languages',
            expect.objectContaining({
                mimeType: 'application/json',
                title: 'Поддерживаемые языки',
            }),
            expect.any(Function),
        );
    });

    it('должен регистрировать ресурс help', async () => {
        const { registerValidatorResources } = await import('../register-validator-resources');

        const mockServer = {
            registerResource: vi.fn(),
        } as unknown as McpServer;

        registerValidatorResources(mockServer);

        expect(mockServer.registerResource).toHaveBeenCalledWith(
            'help',
            'validator://help',
            expect.objectContaining({
                mimeType: 'text/markdown',
                title: 'Справка по инструментам',
            }),
            expect.any(Function),
        );
    });

    it('должен регистрировать все 4 ресурса', async () => {
        const { registerValidatorResources } = await import('../register-validator-resources');

        const mockServer = {
            registerResource: vi.fn(),
        } as unknown as McpServer;

        registerValidatorResources(mockServer);

        expect(mockServer.registerResource).toHaveBeenCalledTimes(4);
    });
});

describe('registerValidatorResources callbacks', () => {
    beforeEach(() => {
        vi.resetModules();
    });

    it('должен возвращать конфигурацию при вызове callback config', async () => {
        const { registerValidatorResources } = await import('../register-validator-resources');

        let capturedCallback: ((uri: URL) => Promise<unknown>) | null = null;
        const mockServer = {
            registerResource: vi.fn((name, _uri, _meta, callback) => {
                if (name === 'config') {
                    capturedCallback = callback as (uri: URL) => Promise<unknown>;
                }
            }),
        } as unknown as McpServer;

        registerValidatorResources(mockServer);

        const result = (await capturedCallback!(new URL('validator://config'))) as {
            contents: Array<{ mimeType: string; text: string; uri: string }>;
        };

        expect(result.contents).toHaveLength(1);
        expect(result.contents[0].mimeType).toBe('application/json');
        expect(result.contents[0].uri).toBe('validator://config');

        const parsedContent = JSON.parse(result.contents[0].text) as Record<string, unknown>;
        expect(parsedContent).toHaveProperty('model');
        expect(parsedContent).toHaveProperty('timeouts');
        expect(parsedContent).toHaveProperty('mcp');
    });

    it('должен возвращать промпт при вызове callback validation-prompt', async () => {
        const { registerValidatorResources } = await import('../register-validator-resources');

        let capturedCallback: ((uri: URL, params: Record<string, unknown>) => Promise<unknown>) | null = null;
        const mockServer = {
            registerResource: vi.fn((name, _uri, _meta, callback) => {
                if (name === 'validation-prompt') {
                    capturedCallback = callback as (uri: URL, params: Record<string, unknown>) => Promise<unknown>;
                }
            }),
        } as unknown as McpServer;

        registerValidatorResources(mockServer);

        const result = (await capturedCallback!(new URL('validator://prompts/code'), { type: 'code' })) as {
            contents: Array<{ mimeType: string; text: string; uri: string }>;
        };

        expect(result.contents).toHaveLength(1);
        expect(result.contents[0].mimeType).toBe('text/markdown');
        expect(result.contents[0].text).toBe('# Code Validation Prompt');
    });

    it('должен возвращать сообщение об ошибке для несуществующего промпта', async () => {
        const { registerValidatorResources } = await import('../register-validator-resources');

        let capturedCallback: ((uri: URL, params: Record<string, unknown>) => Promise<unknown>) | null = null;
        const mockServer = {
            registerResource: vi.fn((name, _uri, _meta, callback) => {
                if (name === 'validation-prompt') {
                    capturedCallback = callback as (uri: URL, params: Record<string, unknown>) => Promise<unknown>;
                }
            }),
        } as unknown as McpServer;

        registerValidatorResources(mockServer);

        const result = (await capturedCallback!(new URL('validator://prompts/unknown'), { type: 'unknown' })) as {
            contents: Array<{ text: string }>;
        };

        expect(result.contents[0].text).toBe('Промпт для типа "unknown" не найден');
    });

    it('должен возвращать сообщение об ошибке для пустого типа промпта', async () => {
        const { registerValidatorResources } = await import('../register-validator-resources');

        let capturedCallback: ((uri: URL, params: Record<string, unknown>) => Promise<unknown>) | null = null;
        const mockServer = {
            registerResource: vi.fn((name, _uri, _meta, callback) => {
                if (name === 'validation-prompt') {
                    capturedCallback = callback as (uri: URL, params: Record<string, unknown>) => Promise<unknown>;
                }
            }),
        } as unknown as McpServer;

        registerValidatorResources(mockServer);

        const result = (await capturedCallback!(new URL('validator://prompts/'), {})) as {
            contents: Array<{ text: string }>;
        };

        expect(result.contents[0].text).toBe('Не указан тип промпта');
    });

    it('должен возвращать список языков при вызове callback languages', async () => {
        const { registerValidatorResources } = await import('../register-validator-resources');

        let capturedCallback: ((uri: URL) => Promise<unknown>) | null = null;
        const mockServer = {
            registerResource: vi.fn((name, _uri, _meta, callback) => {
                if (name === 'languages') {
                    capturedCallback = callback as (uri: URL) => Promise<unknown>;
                }
            }),
        } as unknown as McpServer;

        registerValidatorResources(mockServer);

        const result = (await capturedCallback!(new URL('validator://languages'))) as {
            contents: Array<{ mimeType: string; text: string }>;
        };

        expect(result.contents[0].mimeType).toBe('application/json');

        const languages = JSON.parse(result.contents[0].text) as string[];
        expect(languages).toContain('typescript');
        expect(languages).toContain('javascript');
        expect(languages).toContain('python');
    });

    it('должен возвращать справку при вызове callback help', async () => {
        const { registerValidatorResources } = await import('../register-validator-resources');

        let capturedCallback: ((uri: URL) => Promise<unknown>) | null = null;
        const mockServer = {
            registerResource: vi.fn((name, _uri, _meta, callback) => {
                if (name === 'help') {
                    capturedCallback = callback as (uri: URL) => Promise<unknown>;
                }
            }),
        } as unknown as McpServer;

        registerValidatorResources(mockServer);

        const result = (await capturedCallback!(new URL('validator://help'))) as {
            contents: Array<{ mimeType: string; text: string }>;
        };

        expect(result.contents[0].mimeType).toBe('text/markdown');
        expect(result.contents[0].text).toContain('# MCP Validator — Справка');
        expect(result.contents[0].text).toContain('### validate');
        expect(result.contents[0].text).toContain('### test-prompt');
        expect(result.contents[0].text).toContain('### verify-info');
    });
});
