import { error, info } from '../lib/helpers/logger/index';

/** Настройка graceful shutdown обработчика для MCP сервера */
export function setupGracefulShutdown(): void {
    /** Обрабатывает сигнал завершения и завершает процесс */
    const shutdown = (signal: string): void => {
        info(`Получен сигнал ${signal}, завершение MCP сервера...`);
        process.exit(0);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));

    if (process.platform !== 'win32') {
        process.on('SIGTERM', () => shutdown('SIGTERM'));
    }

    process.on('uncaughtException', (err) => {
        error('Uncaught Exception:', { error: err });
        process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
        error('Unhandled Rejection:', { promise, reason });
        process.exit(1);
    });
}
