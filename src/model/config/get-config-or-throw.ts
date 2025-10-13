import { APP_CONFIG } from './config-constants';
import { getAppConfigError } from './get-app-config-error';
import type { AppConfig } from './types';

/** Получение конфигурации с проверкой ошибок @throws {Error} При недоступности конфигурации */
export function getConfigOrThrow(): AppConfig {
    const config = APP_CONFIG;
    const configError = getAppConfigError();

    if (configError) {
        const message = configError?.message ?? 'Конфигурация приложения недоступна';
        throw new Error(message);
    }

    if (!config) {
        throw new Error('Конфигурация приложения не инициализирована');
    }

    return config;
}
