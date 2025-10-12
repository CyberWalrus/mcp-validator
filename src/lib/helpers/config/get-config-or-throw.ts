import { APP_CONFIG, getAppConfigError } from '../../../model/config';
import type { AppConfig } from '../../../model/types/main';

/** Получение конфигурации с проверкой ошибок @throws {Error} При недоступности конфигурации */
export function getConfigOrThrow(): AppConfig {
    const config = APP_CONFIG;

    const configError = getAppConfigError();

    if (config === null || config === undefined || configError) {
        const message = configError?.message ?? 'Конфигурация приложения недоступна';

        throw new Error(message);
    }

    return config;
}
