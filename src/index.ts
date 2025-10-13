import { main } from './lib/cli/main';
import { error } from './lib/helpers/logger/index';
import { initializeAppConfig } from './model/config';

/** Запускает приложение и обрабатывает необработанные ошибки */
async function start(): Promise<void> {
    try {
        initializeAppConfig();

        await main();
    } catch (err: unknown) {
        error('💥 Необработанная ошибка:', { error: err });
        process.exit(1);
    }
}

start();
