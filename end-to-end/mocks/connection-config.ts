import { APP_CONFIG } from '../../src/model/config';
import type { ConnectionConfig } from './types';

/** Получает конфигурацию для подключения к MCP серверу */
export function getConnectionConfig(): ConnectionConfig {
    return {
        timeout: 30000, // 30 секунд по умолчанию
        isE2ETest: true, // E2E тест
        environment: 'test',
    };
}
