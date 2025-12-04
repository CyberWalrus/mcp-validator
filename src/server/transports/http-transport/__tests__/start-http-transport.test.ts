import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { createServer } from 'node:http';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { error, info } from '../../../../lib/helpers/logger';
import { startHttpTransport } from '../start-http-transport';

const mockTransportInstance = {
    handleRequest: vi.fn(),
};

const mockHttpServer = {
    listen: vi.fn(),
    on: vi.fn(),
};

vi.mock('@modelcontextprotocol/sdk/server/streamableHttp.js', () => ({
    // eslint-disable-next-line @typescript-eslint/no-extraneous-class
    StreamableHTTPServerTransport: vi.fn().mockImplementation(function MockStreamableHTTPServerTransport(
        this: Record<string, unknown>,
    ) {
        Object.assign(this, mockTransportInstance);
    }),
}));

vi.mock('../../../../lib/helpers/logger', () => ({
    error: vi.fn(),
    info: vi.fn(),
}));

vi.mock('node:http', () => ({
    createServer: vi.fn(() => mockHttpServer),
}));

vi.mock('node:crypto', () => ({
    randomUUID: vi.fn(() => 'test-uuid-123'),
}));

type RequestHandler = (req: IncomingMessage, res: ServerResponse) => Promise<void>;

describe('startHttpTransport', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockTransportInstance.handleRequest.mockResolvedValue(undefined);
        mockHttpServer.listen.mockImplementation((_port: number, _host: string, callback: () => void) => {
            callback();
        });
        mockHttpServer.on.mockImplementation(() => mockHttpServer);
    });

    it('должен создать StreamableHTTPServerTransport с sessionIdGenerator', async () => {
        const mockServer = {
            connect: vi.fn().mockResolvedValue(undefined),
        } as unknown as McpServer;

        await startHttpTransport(mockServer, { port: 8000 });

        expect(StreamableHTTPServerTransport).toHaveBeenCalledWith({
            sessionIdGenerator: expect.any(Function),
        });
    });

    it('должен создать HTTP сервер и слушать на указанном порту', async () => {
        const mockServer = {
            connect: vi.fn().mockResolvedValue(undefined),
        } as unknown as McpServer;

        await startHttpTransport(mockServer, { host: '127.0.0.1', port: 9000 });

        expect(createServer).toHaveBeenCalledOnce();
        expect(mockHttpServer.listen).toHaveBeenCalledWith(9000, '127.0.0.1', expect.any(Function));
    });

    it('должен использовать хост по умолчанию 0.0.0.0', async () => {
        const mockServer = {
            connect: vi.fn().mockResolvedValue(undefined),
        } as unknown as McpServer;

        await startHttpTransport(mockServer, { port: 8000 });

        expect(mockHttpServer.listen).toHaveBeenCalledWith(8000, '0.0.0.0', expect.any(Function));
    });

    it('должен подключить transport к серверу', async () => {
        const mockServer = {
            connect: vi.fn().mockResolvedValue(undefined),
        } as unknown as McpServer;

        await startHttpTransport(mockServer, { port: 8000 });

        expect(mockServer.connect).toHaveBeenCalledOnce();
    });

    it('должен логировать запуск и успешное подключение', async () => {
        const mockServer = {
            connect: vi.fn().mockResolvedValue(undefined),
        } as unknown as McpServer;

        await startHttpTransport(mockServer, { host: 'localhost', port: 8000 });

        expect(vi.mocked(info)).toHaveBeenCalledWith('🌐 Запуск HTTP транспорта на localhost:8000...');
        expect(vi.mocked(info)).toHaveBeenCalledWith('✅ HTTP сервер запущен на http://localhost:8000/mcp');
    });

    it('должен вернуть HTTP сервер', async () => {
        const mockServer = {
            connect: vi.fn().mockResolvedValue(undefined),
        } as unknown as McpServer;

        const result = await startHttpTransport(mockServer, { port: 8000 });

        expect(result).toBe(mockHttpServer);
    });

    it('должен обрабатывать ошибку при запуске сервера', async () => {
        const mockServer = {
            connect: vi.fn().mockResolvedValue(undefined),
        } as unknown as McpServer;

        const serverError = new Error('Port in use');
        mockHttpServer.on.mockImplementation((event: string, handler: (err: Error) => void) => {
            if (event === 'error') {
                setTimeout(() => handler(serverError), 0);
            }

            return mockHttpServer;
        });
        mockHttpServer.listen.mockImplementation(() => {
            // Не вызываем callback
        });

        await expect(startHttpTransport(mockServer, { port: 8000 })).rejects.toThrow('Port in use');
        expect(vi.mocked(error)).toHaveBeenCalledWith('❌ Ошибка HTTP сервера:', { error: serverError });
    });

    describe('обработка HTTP запросов', () => {
        it('должен обрабатывать POST /mcp', async () => {
            const mockServer = {
                connect: vi.fn().mockResolvedValue(undefined),
            } as unknown as McpServer;

            let requestHandler: RequestHandler = () => Promise.resolve();
            mockHttpServer.on.mockImplementation((event: string, handler: unknown) => {
                if (event === 'request') {
                    requestHandler = handler as RequestHandler;
                }

                return mockHttpServer;
            });

            await startHttpTransport(mockServer, { port: 8000 });

            const mockReq = { method: 'POST', url: '/mcp' } as IncomingMessage;
            const mockRes = {} as ServerResponse;

            await requestHandler(mockReq, mockRes);

            expect(mockTransportInstance.handleRequest).toHaveBeenCalledWith(mockReq, mockRes);
        });

        it('должен обрабатывать GET /mcp', async () => {
            const mockServer = {
                connect: vi.fn().mockResolvedValue(undefined),
            } as unknown as McpServer;

            let requestHandler: RequestHandler = () => Promise.resolve();
            mockHttpServer.on.mockImplementation((event: string, handler: unknown) => {
                if (event === 'request') {
                    requestHandler = handler as RequestHandler;
                }

                return mockHttpServer;
            });

            await startHttpTransport(mockServer, { port: 8000 });

            const mockReq = { method: 'GET', url: '/mcp' } as IncomingMessage;
            const mockRes = {} as ServerResponse;

            await requestHandler(mockReq, mockRes);

            expect(mockTransportInstance.handleRequest).toHaveBeenCalledWith(mockReq, mockRes);
        });

        it('должен обрабатывать DELETE /mcp', async () => {
            const mockServer = {
                connect: vi.fn().mockResolvedValue(undefined),
            } as unknown as McpServer;

            let requestHandler: RequestHandler = () => Promise.resolve();
            mockHttpServer.on.mockImplementation((event: string, handler: unknown) => {
                if (event === 'request') {
                    requestHandler = handler as RequestHandler;
                }

                return mockHttpServer;
            });

            await startHttpTransport(mockServer, { port: 8000 });

            const mockReq = { method: 'DELETE', url: '/mcp' } as IncomingMessage;
            const mockRes = {} as ServerResponse;

            await requestHandler(mockReq, mockRes);

            expect(mockTransportInstance.handleRequest).toHaveBeenCalledWith(mockReq, mockRes);
        });

        it('должен возвращать health status на GET /health', async () => {
            const mockServer = {
                connect: vi.fn().mockResolvedValue(undefined),
            } as unknown as McpServer;

            let requestHandler: RequestHandler = () => Promise.resolve();
            mockHttpServer.on.mockImplementation((event: string, handler: unknown) => {
                if (event === 'request') {
                    requestHandler = handler as RequestHandler;
                }

                return mockHttpServer;
            });

            await startHttpTransport(mockServer, { port: 8000 });

            const mockReq = { method: 'GET', url: '/health' } as IncomingMessage;
            const mockRes = {
                end: vi.fn(),
                writeHead: vi.fn(),
            } as unknown as ServerResponse;

            await requestHandler(mockReq, mockRes);

            expect(mockRes.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'application/json' });
            expect(mockRes.end).toHaveBeenCalledWith(JSON.stringify({ status: 'ok', transport: 'http' }));
        });

        it('должен возвращать 404 для неизвестных маршрутов', async () => {
            const mockServer = {
                connect: vi.fn().mockResolvedValue(undefined),
            } as unknown as McpServer;

            let requestHandler: RequestHandler = () => Promise.resolve();
            mockHttpServer.on.mockImplementation((event: string, handler: unknown) => {
                if (event === 'request') {
                    requestHandler = handler as RequestHandler;
                }

                return mockHttpServer;
            });

            await startHttpTransport(mockServer, { port: 8000 });

            const mockReq = { method: 'GET', url: '/unknown' } as IncomingMessage;
            const mockRes = {
                end: vi.fn(),
                writeHead: vi.fn(),
            } as unknown as ServerResponse;

            await requestHandler(mockReq, mockRes);

            expect(mockRes.writeHead).toHaveBeenCalledWith(404, { 'Content-Type': 'application/json' });
            expect(mockRes.end).toHaveBeenCalledWith(JSON.stringify({ error: 'Not Found' }));
        });
    });
});
