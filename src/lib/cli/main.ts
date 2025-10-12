import { initializePromptCache } from '../cache';
import { error, info } from '../helpers/logger/index';
import { ensureConfiguration } from './ensure-configuration';
import { showHelp } from './show-help';
import { showVersion } from './show-version';
import { startMcpServer } from './start-mcp-server';

/** Основная функция приложения */
export async function main(): Promise<void> {
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.includes('-h')) {
        ensureConfiguration();
        initializePromptCache();
        showHelp();
        process.exit(0);
    }

    if (args.includes('--version') || args.includes('-v')) {
        showVersion();
        process.exit(0);
    }

    ensureConfiguration();

    info('🚀 MCP Validator 2.0 запускается...');
    info('🔧 Официальный MCP SDK + упрощенная архитектура');
    info('📝 Все функции v1.x сохранены');
    info('');

    try {
        await startMcpServer();

        error('❌ MCP сервер неожиданно завершился');
        process.exit(1);
    } catch (err) {
        error('💥 Критическая ошибка при запуске:', { error: err });
        process.exit(1);
    }
}
