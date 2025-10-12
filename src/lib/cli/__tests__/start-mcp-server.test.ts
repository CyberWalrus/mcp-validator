import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { startMcpServer } from '../start-mcp-server';

// Мокируем зависимости ПЕРЕД импортом тестируемого модуля
vi.mock('../../../model/config');
vi.mock('../../../server/mcp-server');
vi.mock('../../helpers/logger');

const mockReloadAppConfig = vi.fn();
const mockStartMcpServerCore = vi.fn();
const mockLogError = vi.fn();
const mockInfo = vi.fn();

vi.mocked(await import('../../../model/config')).reloadAppConfig = mockReloadAppConfig;
vi.mocked(await import('../../../server/mcp-server')).startMcpServer = mockStartMcpServerCore;
vi.mocked(await import('../../helpers/logger')).error = mockLogError;
vi.mocked(await import('../../helpers/logger')).info = mockInfo;

describe('startMcpServer', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('должен успешно запустить MCP сервер', async () => {
        mockReloadAppConfig.mockReturnValue(undefined);
        mockStartMcpServerCore.mockResolvedValue(undefined);

        await startMcpServer();

        expect(mockReloadAppConfig).toHaveBeenCalledTimes(1);
        expect(mockInfo).toHaveBeenCalledWith('🚀 Starting MCP Server...');
        expect(mockStartMcpServerCore).toHaveBeenCalledTimes(1);
        expect(mockInfo).toHaveBeenCalledWith('✅ MCP Server started successfully');
        expect(mockLogError).not.toHaveBeenCalled();
    });

    it('должен логировать ошибку и пробрасывать исключение при ошибке конфига', async () => {
        const testError = new Error('Config loading failed');
        mockReloadAppConfig.mockImplementation(() => {
            throw testError;
        });

        await expect(startMcpServer()).rejects.toThrow('Config loading failed');

        expect(mockReloadAppConfig).toHaveBeenCalledTimes(1);
        expect(mockInfo).not.toHaveBeenCalledWith('🚀 Starting MCP Server...');
        expect(mockStartMcpServerCore).not.toHaveBeenCalled();
        expect(mockLogError).toHaveBeenCalledWith('❌ Failed to start MCP Server:', { error: testError });
    });

    it('должен логировать ошибку и пробрасывать исключение при ошибке инициализации сервера', async () => {
        const testError = new Error('Server initialization failed');
        mockReloadAppConfig.mockReturnValue(undefined);
        mockStartMcpServerCore.mockRejectedValue(testError);

        await expect(startMcpServer()).rejects.toThrow('Server initialization failed');

        expect(mockReloadAppConfig).toHaveBeenCalledTimes(1);
        expect(mockInfo).toHaveBeenCalledWith('🚀 Starting MCP Server...');
        expect(mockStartMcpServerCore).toHaveBeenCalledTimes(1);
        expect(mockInfo).not.toHaveBeenCalledWith('✅ MCP Server started successfully');
        expect(mockLogError).toHaveBeenCalledWith('❌ Failed to start MCP Server:', { error: testError });
    });
});
