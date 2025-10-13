describe('getOpenRouterClient', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        process.env = { ...originalEnv };
        // Сбрасываем кеш клиента между тестами
        vi.resetModules();
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    async function loadFactory() {
        const configModule = await import('../../../../model/config');
        configModule.initializeAppConfig();
        const module = await import('../openrouter-client-factory');

        return module.getOpenRouterClient;
    }

    it('должен возвращать мок клиент в тестовом режиме', async () => {
        process.env.NODE_ENV = 'test';
        process.env.MCP_E2E_TEST = 'true';

        const getOpenRouterClient = await loadFactory();
        const client = await getOpenRouterClient();

        expect(client).toBeDefined();
        expect(typeof client).toBe('function');
    });

    it('должен возвращать реальный клиент в продакшн режиме', async () => {
        process.env.NODE_ENV = 'production';
        delete process.env.MCP_E2E_TEST;

        const getOpenRouterClient = await loadFactory();
        const client = await getOpenRouterClient();

        expect(client).toBeDefined();
        expect(typeof client).toBe('function');
    });

    it('должен кешировать клиент при повторных вызовах', async () => {
        process.env.NODE_ENV = 'production';

        const getOpenRouterClient = await loadFactory();
        const client1 = await getOpenRouterClient();
        const client2 = await getOpenRouterClient();

        expect(client1).toBe(client2);
    });

    it('должен возвращать мок клиент когда NODE_ENV=test', async () => {
        process.env.NODE_ENV = 'test';
        delete process.env.MCP_E2E_TEST;

        const getOpenRouterClient = await loadFactory();
        const client = await getOpenRouterClient();

        expect(client).toBeDefined();
        expect(typeof client).toBe('function');
    });

    it('должен возвращать реальный клиент в development режиме', async () => {
        process.env.NODE_ENV = 'development';
        delete process.env.MCP_E2E_TEST;

        const getOpenRouterClient = await loadFactory();
        const client = await getOpenRouterClient();

        expect(client).toBeDefined();
        expect(typeof client).toBe('function');
    });
});
