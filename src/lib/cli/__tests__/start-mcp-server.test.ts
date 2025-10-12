import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { startMcpServer } from '../start-mcp-server';

// Мокируем зависимости ПЕРЕД импортом тестируемого модуля
vi.mock('../../../model/config');
vi.mock('../../../services/adapters/mcp-server');
vi.mock('../../helpers/logger');

const mockReloadAppConfig = vi.fn();
const mockInitializeMCPServer = vi.fn();
const mockLogError = vi.fn();
const mockInfo = vi.fn();

vi.mocked(await import('../../../model/config')).reloadAppConfig = mockReloadAppConfig;
vi.mocked(await import('../../../services/adapters/mcp-server')).initializeMCPServer = mockInitializeMCPServer;
vi.mocked(await import('../../helpers/logger')).error = mockLogError;
vi.mocked(await import('../../helpers/logger')).info = mockInfo;

describe('startMcpServer', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('должен успешно запустить MCP сервер', () => {
        mockReloadAppConfig.mockReturnValue(undefined);
        mockInitializeMCPServer.mockReturnValue(undefined);

        startMcpServer();

        expect(mockReloadAppConfig).toHaveBeenCalledTimes(1);
        expect(mockInfo).toHaveBeenCalledWith('🚀 Starting MCP Server...');
        expect(mockInitializeMCPServer).toHaveBeenCalledTimes(1);
        expect(mockInfo).toHaveBeenCalledWith('✅ MCP Server started successfully');
        expect(mockLogError).not.toHaveBeenCalled();
    });

    it('должен логировать ошибку и пробрасывать исключение при ошибке конфига', () => {
        const testError = new Error('Config loading failed');
        mockReloadAppConfig.mockImplementation(() => {
            throw testError;
        });

        expect(() => startMcpServer()).toThrow('Config loading failed');

        expect(mockReloadAppConfig).toHaveBeenCalledTimes(1);
        expect(mockInfo).not.toHaveBeenCalledWith('🚀 Starting MCP Server...');
        expect(mockInitializeMCPServer).not.toHaveBeenCalled();
        expect(mockLogError).toHaveBeenCalledWith('❌ Failed to start MCP Server:', { error: testError });
    });

    it('должен логировать ошибку и пробрасывать исключение при ошибке инициализации сервера', () => {
        const testError = new Error('Server initialization failed');
        mockReloadAppConfig.mockReturnValue(undefined);
        mockInitializeMCPServer.mockImplementation(() => {
            throw testError;
        });

        expect(() => startMcpServer()).toThrow('Server initialization failed');

        expect(mockReloadAppConfig).toHaveBeenCalledTimes(1);
        expect(mockInfo).toHaveBeenCalledWith('🚀 Starting MCP Server...');
        expect(mockInitializeMCPServer).toHaveBeenCalledTimes(1);
        expect(mockInfo).not.toHaveBeenCalledWith('✅ MCP Server started successfully');
        expect(mockLogError).toHaveBeenCalledWith('❌ Failed to start MCP Server:', { error: testError });
    });
});
