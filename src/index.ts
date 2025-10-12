import { main } from './lib/cli/main';
import { error } from './lib/helpers/logger/index';

main().catch((err: unknown) => {
    error('💥 Необработанная ошибка:', { error: err });
    process.exit(1);
});
