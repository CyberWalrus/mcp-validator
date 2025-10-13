import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { startMcpServer } from '../start-mcp-server';

// Мокируем зависимости ПЕРЕД импортом тестируемого модуля
vi.mock('../../../server/mcp-server');
vi.mock('../../helpers/logger');

const mockStartMcpServerCore = vi.fn();
const mockLogError = vi.fn();
const mockInfo = vi.fn();

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
        mockStartMcpServerCore.mockResolvedValue(undefined);

        await startMcpServer();

        expect(mockInfo).toHaveBeenCalledWith('🚀 Starting MCP Server...');
        expect(mockStartMcpServerCore).toHaveBeenCalledTimes(1);
        expect(mockInfo).toHaveBeenCalledWith('✅ MCP Server started successfully');
        expect(mockLogError).not.toHaveBeenCalled();
    });

    it('должен логировать ошибку и пробрасывать исключение при ошибке инициализации сервера', async () => {
        const testError = new Error('Server initialization failed');
        mockStartMcpServerCore.mockRejectedValue(testError);

        await expect(startMcpServer()).rejects.toThrow('Server initialization failed');

        expect(mockInfo).toHaveBeenCalledWith('🚀 Starting MCP Server...');
        expect(mockStartMcpServerCore).toHaveBeenCalledTimes(1);
        expect(mockInfo).not.toHaveBeenCalledWith('✅ MCP Server started successfully');
        expect(mockLogError).toHaveBeenCalledWith('❌ Failed to start MCP Server:', { error: testError });
    });
});
