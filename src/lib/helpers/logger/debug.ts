import { log } from './helpers/log';

/** Логирует debug сообщения */
export function debug(message: string, meta?: object): void {
    log('DEBUG', message, meta);
}
