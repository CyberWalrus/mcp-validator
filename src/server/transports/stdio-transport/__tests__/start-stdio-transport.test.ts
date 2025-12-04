import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { info } from '../../../../lib/helpers/logger';
import { startStdioTransport } from '../start-stdio-transport';

const mockTransportInstance = { mockTransport: true };

vi.mock('@modelcontextprotocol/sdk/server/stdio.js', () => ({
    // eslint-disable-next-line @typescript-eslint/no-extraneous-class
    StdioServerTransport: vi.fn().mockImplementation(function MockStdioServerTransport(this: Record<string, unknown>) {
        Object.assign(this, mockTransportInstance);
    }),
}));

vi.mock('../../../../lib/helpers/logger', () => ({
    info: vi.fn(),
}));

describe('startStdioTransport', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('должен создать StdioServerTransport и подключить сервер', async () => {
        const mockServer = {
            connect: vi.fn().mockResolvedValue(undefined),
        } as unknown as McpServer;

        await startStdioTransport(mockServer);

        expect(mockServer.connect).toHaveBeenCalledOnce();
    });

    it('должен логировать запуск и успешное подключение', async () => {
        const mockServer = {
            connect: vi.fn().mockResolvedValue(undefined),
        } as unknown as McpServer;

        await startStdioTransport(mockServer);

        expect(vi.mocked(info)).toHaveBeenCalledWith('🔌 Запуск stdio транспорта...');
        expect(vi.mocked(info)).toHaveBeenCalledWith('✅ Stdio транспорт подключен');
    });

    it('должен пробросить ошибку при неудачном подключении', async () => {
        const mockError = new Error('Connection failed');
        const mockServer = {
            connect: vi.fn().mockRejectedValue(mockError),
        } as unknown as McpServer;

        await expect(startStdioTransport(mockServer)).rejects.toThrow('Connection failed');
    });
});
