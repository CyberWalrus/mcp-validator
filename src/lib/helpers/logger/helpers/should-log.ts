import { APP_CONFIG, getAppConfigError } from '../../../../model/config';
import type { LogLevel } from '../../../../model/types/main';

/** Проверяет нужно ли логировать сообщение с данным уровнем */
export function shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
    let currentLogLevel: LogLevel = 'INFO';

    const config = APP_CONFIG;

    const configError = getAppConfigError();

    if (config && !configError) {
        const configuredLevel = config.logging.level;

        if (levels.includes(configuredLevel)) {
            currentLogLevel = configuredLevel;
        }
    }

    const currentLevelIndex = levels.indexOf(currentLogLevel);
    const messageLevelIndex = levels.indexOf(level);

    return messageLevelIndex >= currentLevelIndex;
}
