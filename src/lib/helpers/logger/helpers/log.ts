import type { LogLevel } from '../../../../model/types/main';
import { shouldLog } from './should-log';

/** Выводит сообщение в консоль если уровень логирования позволяет */
export function log(level: LogLevel, message: string, meta?: object): void {
    if (!shouldLog(level)) {
        return;
    }

    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level}] ${message}`;

    // Используем console.error для всех уровней, так как это стандартная практика
    // для логирования в Node.js приложениях
    if (meta) {
        console.error(formattedMessage, meta);
    } else {
        console.error(formattedMessage);
    }
}
