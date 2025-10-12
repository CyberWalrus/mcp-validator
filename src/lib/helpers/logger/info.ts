import { log } from './helpers/log';

/** Логирует info сообщения */
export function info(message: string, meta?: object): void {
    log('INFO', message, meta);
}
