import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { randomUUID } from 'node:crypto';
import type { IncomingMessage, Server, ServerResponse } from 'node:http';
import { createServer } from 'node:http';

import { error, info } from '../../../lib/helpers/logger';
import type { HttpTransportConfig } from '../types';

/** Запускает сервер с Streamable HTTP транспортом */
export async function startHttpTransport(server: McpServer, config: HttpTransportConfig): Promise<Server> {
    const { port, host = '0.0.0.0' } = config;

    info(`🌐 Запуск HTTP транспорта на ${host}:${port}...`);

    const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
    });

    const httpServer = createServer();

    /** Обработчик HTTP запросов */
    const handleRequest = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
        if (req.method === 'POST' && req.url === '/mcp') {
            await transport.handleRequest(req, res);

            return;
        }

        if (req.method === 'GET' && req.url === '/mcp') {
            await transport.handleRequest(req, res);

            return;
        }

        if (req.method === 'DELETE' && req.url === '/mcp') {
            await transport.handleRequest(req, res);

            return;
        }

        if (req.method === 'GET' && req.url === '/health') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'ok', transport: 'http' }));

            return;
        }

        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    };

    httpServer.on('request', (req, res) => {
        handleRequest(req, res).catch((err: unknown) => {
            error('❌ Ошибка обработки HTTP запроса:', { error: err });
            if (!res.headersSent) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
            }
        });
    });

    await server.connect(transport);

    return new Promise((resolve, reject) => {
        httpServer.listen(port, host, () => {
            info(`✅ HTTP сервер запущен на http://${host}:${port}/mcp`);
            resolve(httpServer);
        });

        httpServer.on('error', (err) => {
            error('❌ Ошибка HTTP сервера:', { error: err });
            reject(err);
        });
    });
}
