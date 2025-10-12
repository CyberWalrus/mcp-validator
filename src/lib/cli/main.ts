import { setupGracefulShutdown } from '../../server/setup-graceful-shutdown';
import { error } from '../helpers/logger/index';
import { ensureConfiguration } from './ensure-configuration';
import { showHelp, showVersion, startMcpServer } from './index';

/** Основная функция приложения */
export async function main(): Promise<void> {
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.includes('-h')) {
        showHelp();
        process.exit(0);
    }

    if (args.includes('--version') || args.includes('-v')) {
        showVersion();
        process.exit(0);
    }

    ensureConfiguration();

    setupGracefulShutdown();

    error('🚀 MCP Validator 2.0 запускается...');
    error('🔧 Официальный MCP SDK + упрощенная архитектура');
    error('📝 Все функции v1.x сохранены');
    error('');

    try {
        await startMcpServer();

        error('❌ MCP сервер неожиданно завершился');
        process.exit(1);
    } catch (err) {
        error('💥 Критическая ошибка при запуске:', { error: err });
        process.exit(1);
    }
}

