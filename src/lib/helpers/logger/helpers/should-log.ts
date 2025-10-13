import type { LogLevel } from '../../../../model/config';
import { APP_CONFIG } from '../../../../model/config';

/** Проверяет нужно ли логировать сообщение с данным уровнем */
export function shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
    const currentLogLevel = APP_CONFIG.logging.level;

    const currentLevelIndex = levels.indexOf(currentLogLevel);
    const messageLevelIndex = levels.indexOf(level);

    return messageLevelIndex >= currentLevelIndex;
}
