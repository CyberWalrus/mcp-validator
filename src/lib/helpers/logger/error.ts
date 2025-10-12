import { log } from './helpers/log';

/** Логирует ошибки */
export function error(message: string, meta?: object): void {
    log('ERROR', message, meta);
}
