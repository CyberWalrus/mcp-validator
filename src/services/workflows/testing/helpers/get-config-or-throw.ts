import { APP_CONFIG, getAppConfigError } from '../../../../model/config';
import type { AppConfig } from '../../../../model/types/main';

/** Получает конфигурацию или выбрасывает ошибку */
export function getConfigOrThrow(): AppConfig {
    const config = APP_CONFIG;
    const configError = getAppConfigError();

    if (!config || configError) {
        const message = configError?.message ?? 'Конфигурация приложения недоступна';
        throw new Error(message);
    }

    return config;
}
