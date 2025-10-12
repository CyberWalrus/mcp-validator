/** Глобальная настройка для E2E тестов */
export function setup() {
    if (process.env.NODE_ENV !== 'test' || process.env.MCP_E2E_TEST !== 'true') {
        throw new Error('E2E тесты должны запускаться только в тестовом окружении');
    }

    if (typeof process !== 'undefined' && process.env) {
        process.env.CHILD_PROCESS_TIMEOUT = '30000';
    }
}

export function teardown() {
    console.log('🧹 Очистка после E2E тестов');
}
