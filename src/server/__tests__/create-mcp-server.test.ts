import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

vi.mock('../../tools/validate-tool', () => ({
    handleValidateTool: vi.fn().mockResolvedValue({ content: 'validate result', isError: false }),
}));

vi.mock('../../tools/test-prompt-tool', () => ({
    handleTestPromptTool: vi.fn().mockResolvedValue({ content: 'test-prompt result', isError: false }),
}));

vi.mock('../../tools/verify-info-tool', () => ({
    handleVerifyInfoTool: vi.fn().mockResolvedValue({ content: 'verify-info result', isError: false }),
}));

type RegisteredTool = {
    description: string;
    inputSchema: {
        '~standard'?: { vendor: string; version: number };
        def?: { type: string; shape?: Record<string, unknown> };
        type?: string;
    };
};

/** Хелпер для получения зарегистрированных инструментов */
function getRegisteredTools(server: McpServer): Record<string, RegisteredTool> {
    // eslint-disable-next-line no-underscore-dangle
    return (server as unknown as { _registeredTools: Record<string, RegisteredTool> })._registeredTools;
}

/** Проверяет что inputSchema была создана через z.object() */
function isZodObjectSchema(schema: RegisteredTool['inputSchema']): boolean {
    return schema?.['~standard']?.vendor === 'zod' && schema?.type === 'object';
}

describe('createMcpServer', () => {
    beforeEach(async () => {
        vi.resetModules();

        const { initializeAppConfig } = await import('../../model/config');
        initializeAppConfig();
    });

    it('должен создать экземпляр McpServer', async () => {
        const { createMcpServer } = await import('../create-mcp-server');

        const server = createMcpServer();

        expect(server).toBeDefined();
        expect(server.server).toBeDefined();
    });

    it('должен иметь метод connect на верхнем уровне (не server.server.connect)', async () => {
        const { createMcpServer } = await import('../create-mcp-server');

        const server = createMcpServer();

        expect(typeof server.connect).toBe('function');
    });

    it('должен регистрировать инструмент validate с корректной Zod схемой', async () => {
        const { createMcpServer } = await import('../create-mcp-server');

        const server = createMcpServer();
        const tools = getRegisteredTools(server);

        expect(tools.validate).toBeDefined();
        expect(isZodObjectSchema(tools.validate.inputSchema)).toBe(true);
    });

    it('должен регистрировать инструмент test-prompt с корректной Zod схемой', async () => {
        const { createMcpServer } = await import('../create-mcp-server');

        const server = createMcpServer();
        const tools = getRegisteredTools(server);

        expect(tools['test-prompt']).toBeDefined();
        expect(isZodObjectSchema(tools['test-prompt'].inputSchema)).toBe(true);
    });

    it('должен регистрировать инструмент verify-info с корректной Zod схемой', async () => {
        const { createMcpServer } = await import('../create-mcp-server');

        const server = createMcpServer();
        const tools = getRegisteredTools(server);

        expect(tools['verify-info']).toBeDefined();
        expect(isZodObjectSchema(tools['verify-info'].inputSchema)).toBe(true);
    });

    it('должен регистрировать все 3 инструмента', async () => {
        const { createMcpServer } = await import('../create-mcp-server');

        const server = createMcpServer();
        const tools = getRegisteredTools(server);
        const toolNames = Object.keys(tools);

        expect(toolNames).toHaveLength(3);
        expect(toolNames).toContain('validate');
        expect(toolNames).toContain('test-prompt');
        expect(toolNames).toContain('verify-info');
    });

    it('должен содержать validationType в схеме validate', async () => {
        const { createMcpServer } = await import('../create-mcp-server');

        const server = createMcpServer();
        const tools = getRegisteredTools(server);
        const validateSchema = tools.validate.inputSchema;

        expect(validateSchema.def?.shape?.validationType).toBeDefined();
    });

    it('должен содержать input в схеме validate', async () => {
        const { createMcpServer } = await import('../create-mcp-server');

        const server = createMcpServer();
        const tools = getRegisteredTools(server);
        const validateSchema = tools.validate.inputSchema;

        expect(validateSchema.def?.shape?.input).toBeDefined();
    });

    it('должен содержать prompt в схеме test-prompt', async () => {
        const { createMcpServer } = await import('../create-mcp-server');

        const server = createMcpServer();
        const tools = getRegisteredTools(server);
        const testPromptSchema = tools['test-prompt'].inputSchema;

        expect(testPromptSchema.def?.shape?.prompt).toBeDefined();
    });

    it('должен содержать iterations в схеме test-prompt', async () => {
        const { createMcpServer } = await import('../create-mcp-server');

        const server = createMcpServer();
        const tools = getRegisteredTools(server);
        const testPromptSchema = tools['test-prompt'].inputSchema;

        expect(testPromptSchema.def?.shape?.iterations).toBeDefined();
    });

    it('должен содержать input в схеме verify-info', async () => {
        const { createMcpServer } = await import('../create-mcp-server');

        const server = createMcpServer();
        const tools = getRegisteredTools(server);
        const verifyInfoSchema = tools['verify-info'].inputSchema;

        expect(verifyInfoSchema.def?.shape?.input).toBeDefined();
    });
});
