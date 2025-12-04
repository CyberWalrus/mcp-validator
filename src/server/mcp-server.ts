import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { initializePromptCache } from '../lib/cache';
import { error, info } from '../lib/helpers/logger/index';
import { createMcpServer } from './create-mcp-server';
import { setupGracefulShutdown } from './setup-graceful-shutdown';

/** Запуск MCP сервера в постоянном режиме */
export async function startMcpServer(): Promise<void> {
    try {
        info('🔄 Инициализация кэша промптов...');
        const cacheResult = initializePromptCache();
        info(`✅ Загружено ${cacheResult.loaded} промптов в кэш`);

        info('📦 Создание MCP сервера...');
        const server = createMcpServer();

        info('🔌 Создание stdio transport...');
        const transport = new StdioServerTransport();

        info('🚀 Подключение к transport...');
        await server.server.connect(transport);

        info('✅ MCP сервер запущен и готов к работе');

        setupGracefulShutdown();

        await new Promise<void>((resolve, reject) => {
            process.on('SIGINT', resolve);
            if (process.platform !== 'win32') {
                process.on('SIGTERM', resolve);
            }
            process.on('uncaughtException', reject);
            process.on('unhandledRejection', reject);
        });
    } catch (err: unknown) {
        error('💥 Критическая ошибка MCP сервера:', {
            error: err,
            stack: err instanceof Error ? err.stack : 'No stack trace',
        });
        process.exit(1);
    }
}
