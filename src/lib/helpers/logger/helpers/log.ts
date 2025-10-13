import type { LogLevel } from '../../../../model/config';
import { shouldLog } from './should-log';

/** Выводит сообщение в консоль если уровень логирования позволяет */
export function log(level: LogLevel, message: string, meta?: object): void {
    if (shouldLog(level) === false) {
        return;
    }

    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level}] ${message}`;

    if (meta !== undefined) {
        console.error(formattedMessage, meta);
    } else {
        console.error(formattedMessage);
    }
}
