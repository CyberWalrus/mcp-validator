import { assignConfig } from './helpers/assign-config';
import { createFallbackConfig } from './helpers/create-fallback-config';
import { toError } from './helpers/to-error';
import { CACHED_CONFIG, CONFIG_STATE } from './config-constants';

/** Переинициализирует конфигурацию приложения */
export async function reloadAppConfig(env: NodeJS.ProcessEnv = process.env): Promise<void> {
    const fallbackConfig = createFallbackConfig(env);
    assignConfig(CACHED_CONFIG, fallbackConfig);

    try {
        const { createAppConfig } = await import('./create-app-config');
        const resolvedConfig = createAppConfig(env);
        assignConfig(CACHED_CONFIG, resolvedConfig);
        CONFIG_STATE.error = null;
    } catch (error: unknown) {
        CONFIG_STATE.error = toError(error);
    }
}
