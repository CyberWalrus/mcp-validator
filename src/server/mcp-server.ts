import { initializePromptCache } from '../lib/cache';
import { error, info } from '../lib/helpers/logger/index';
import { APP_CONFIG } from '../model/config';
import { createMcpServer } from './create-mcp-server';
import { setupGracefulShutdown } from './setup-graceful-shutdown';
import type { TransportType } from './transports';
import { startHttpTransport, startStdioTransport } from './transports';

/** Запуск MCP сервера с выбранным транспортом */
export async function startMcpServer(transport?: TransportType): Promise<void> {
    try {
        info('🔄 Инициализация кэша промптов...');
        const cacheResult = initializePromptCache();
        info(`✅ Загружено ${cacheResult.loaded} промптов в кэш`);

        info('📦 Создание MCP сервера...');
        const server = createMcpServer();

        const transportType = transport ?? APP_CONFIG.mcp.transport.type;
        info(`🚀 Запуск MCP сервера (транспорт: ${transportType})...`);

        if (transportType === 'http') {
            const { host, port } = APP_CONFIG.mcp.transport.http;
            await startHttpTransport(server, { host, port });
        } else {
            await startStdioTransport(server);
        }

        info('✅ MCP сервер готов к работе');

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
