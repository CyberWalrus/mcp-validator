import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockStdin = {
    on: vi.fn(),
    setEncoding: vi.fn(),
};

const mockProcess = {
    exit: vi.fn(),
    on: vi.fn(),
    stdin: mockStdin,
};

vi.stubGlobal('process', {
    ...process,
    ...mockProcess,
});

describe('initializeMCPServer', () => {
    beforeEach(() => {
        vi.resetModules();
        vi.clearAllMocks();
        delete process.env.OPENROUTER_API_KEY;
    });

    async function loadModule() {
        const configModule = await import('../../../../model/config');
        configModule.reloadAppConfig();

        return import('../initialize-mcp-server');
    }

    it('должен успешно инициализировать MCP сервер', async () => {
        process.env.OPENROUTER_API_KEY = 'test-key';

        const { initializeMCPServer } = await loadModule();
        const serverInfo = initializeMCPServer();

        expect(serverInfo).toEqual({
            name: 'mcp-validator',
            startTime: expect.any(Date),
            status: 'ready',
            version: '2.0.0',
        });

        expect(mockStdin.setEncoding).toHaveBeenCalledWith('utf8');
        expect(mockStdin.on).toHaveBeenCalledWith('data', expect.any(Function));
        expect(mockStdin.on).toHaveBeenCalledWith('error', expect.any(Function));
        // Signal handlers теперь устанавливаются в main index.ts, не здесь
    });

    it('должен предупреждать об отсутствующих переменных окружения', async () => {
        const consoleWarnSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

        const { initializeMCPServer } = await loadModule();
        const serverInfo = initializeMCPServer();

        expect(serverInfo.status).toBe('ready');
        expect(consoleWarnSpy).toHaveBeenCalledWith(
            expect.stringMatching(/\[WARN\].*Отсутствуют обязательные переменные окружения/),
            expect.objectContaining({
                missing: ['OPENROUTER_API_KEY'],
            }),
        );

        consoleWarnSpy.mockRestore();
    });

    it('должен возвращать информацию о сервере', async () => {
        process.env.OPENROUTER_API_KEY = 'test-key';

        const { getMCPServerInfo, initializeMCPServer } = await loadModule();
        const serverInfo = initializeMCPServer();
        const retrievedInfo = getMCPServerInfo();

        expect(retrievedInfo).toEqual(serverInfo);
        expect(retrievedInfo).not.toBe(serverInfo);
    });
});
