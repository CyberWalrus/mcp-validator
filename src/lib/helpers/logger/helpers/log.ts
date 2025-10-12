import type { LogLevel } from '../../../../model/types/main';
import { shouldLog } from './should-log';

/** Выводит сообщение в консоль если уровень логирования позволяет */
export function log(level: LogLevel, message: string, meta?: object): void {
    if (!shouldLog(level)) {
        return;
    }

    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level}] ${message}`;

    if (meta) {
        console.log(formattedMessage, meta);
    } else {
        console.log(formattedMessage);
    }
}
