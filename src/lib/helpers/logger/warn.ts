import { log } from './helpers/log';

/** Логирует предупреждения */
export function warn(message: string, meta?: object): void {
    log('WARN', message, meta);
}
