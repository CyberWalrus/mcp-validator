import { APP_CONFIG } from '../../src/model/config';
import type { ConnectionConfig } from './types';

/** Получает конфигурацию для подключения к MCP серверу */
export function getConnectionConfig(): ConnectionConfig {
    return {
        timeout: APP_CONFIG.timeouts.validation,
        isE2ETest: APP_CONFIG.runtime.isE2ETest,
        environment: APP_CONFIG.runtime.environment,
    };
}
