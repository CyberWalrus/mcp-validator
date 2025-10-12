import { CONFIG_STATE } from './config-constants';

/** Получает ошибку конфигурации приложения */
export function getAppConfigError(): Error | null {
    return CONFIG_STATE.error;
}
