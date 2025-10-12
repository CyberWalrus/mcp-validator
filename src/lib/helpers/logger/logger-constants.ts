import { log } from './helpers/log';
import { shouldLog } from './helpers/should-log';
import { error } from './error';
import { info } from './info';

/** Модуль логирования приложения */
export const LOGGER = {
    error,
    info,
    log,
    shouldLog,
};
