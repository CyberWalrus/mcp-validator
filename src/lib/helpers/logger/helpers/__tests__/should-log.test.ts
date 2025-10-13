import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('shouldLog', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        vi.resetModules();
        process.env = { ...originalEnv };
        process.env.API_KEY = 'test-key';
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    /** Проверяет возврат true для DEBUG при уровне DEBUG */
    it('должен возвращать true для DEBUG при уровне DEBUG', async () => {
        process.env.LOG_LEVEL = 'DEBUG';

        // Мокируем APP_CONFIG
        vi.doMock('../../../../../model/config', () => ({
            APP_CONFIG: {
                logging: { level: 'DEBUG' },
            },
        }));

        const { shouldLog } = await import('../should-log');
        const result = shouldLog('DEBUG');

        expect(result).toBe(true);
    });

    /** Проверяет возврат true для INFO при уровне DEBUG */
    it('должен возвращать true для INFO при уровне DEBUG', async () => {
        process.env.LOG_LEVEL = 'DEBUG';

        // Мокируем APP_CONFIG
        vi.doMock('../../../../../model/config', () => ({
            APP_CONFIG: {
                logging: { level: 'DEBUG' },
            },
        }));

        const { shouldLog } = await import('../should-log');
        const result = shouldLog('INFO');

        expect(result).toBe(true);
    });

    /** Проверяет возврат false для DEBUG при уровне INFO */
    it('должен возвращать false для DEBUG при уровне INFO', async () => {
        process.env.LOG_LEVEL = 'INFO';

        // Мокируем APP_CONFIG
        vi.doMock('../../../../../model/config', () => ({
            APP_CONFIG: {
                logging: { level: 'INFO' },
            },
        }));

        const { shouldLog } = await import('../should-log');
        const result = shouldLog('DEBUG');

        expect(result).toBe(false);
    });

    /** Проверяет возврат true для INFO при уровне INFO */
    it('должен возвращать true для INFO при уровне INFO', async () => {
        process.env.LOG_LEVEL = 'INFO';

        // Мокируем APP_CONFIG
        vi.doMock('../../../../../model/config', () => ({
            APP_CONFIG: {
                logging: { level: 'INFO' },
            },
        }));

        const { shouldLog } = await import('../should-log');
        const result = shouldLog('INFO');

        expect(result).toBe(true);
    });

    /** Проверяет возврат true для WARN при уровне INFO */
    it('должен возвращать true для WARN при уровне INFO', async () => {
        process.env.LOG_LEVEL = 'INFO';

        // Мокируем APP_CONFIG
        vi.doMock('../../../../../model/config', () => ({
            APP_CONFIG: {
                logging: { level: 'INFO' },
            },
        }));

        const { shouldLog } = await import('../should-log');
        const result = shouldLog('WARN');

        expect(result).toBe(true);
    });

    /** Проверяет возврат true для ERROR при любом уровне */
    it('должен возвращать true для ERROR при любом уровне', async () => {
        const levels = ['DEBUG', 'INFO', 'WARN', 'ERROR'] as const;

        for (const level of levels) {
            process.env.LOG_LEVEL = level;

            // Мокируем APP_CONFIG
            vi.doMock('../../../../../model/config', () => ({
                APP_CONFIG: {
                    logging: { level },
                },
            }));

            const { shouldLog } = await import('../should-log');
            const result = shouldLog('ERROR');

            expect(result).toBe(true);
        }
    });

    /** Проверяет использование INFO как уровень по умолчанию */
    it('должен использовать INFO как уровень по умолчанию', async () => {
        delete process.env.LOG_LEVEL;

        // Мокируем APP_CONFIG с уровнем по умолчанию
        vi.doMock('../../../../../model/config', () => ({
            APP_CONFIG: {
                logging: { level: 'INFO' },
            },
        }));

        const { shouldLog } = await import('../should-log');
        const debugResult = shouldLog('DEBUG');
        const infoResult = shouldLog('INFO');

        expect(debugResult).toBe(false);
        expect(infoResult).toBe(true);
    });

    /** Проверяет использование INFO при некорректном уровне в переменной окружения */
    it('должен использовать INFO при некорректном уровне в переменной окружения', async () => {
        process.env.LOG_LEVEL = 'INVALID_LEVEL' as any;

        // Мокируем APP_CONFIG с уровнем по умолчанию
        vi.doMock('../../../../../model/config', () => ({
            APP_CONFIG: {
                logging: { level: 'INFO' },
            },
        }));

        const { shouldLog } = await import('../should-log');
        const debugResult = shouldLog('DEBUG');
        const infoResult = shouldLog('INFO');

        expect(debugResult).toBe(false);
        expect(infoResult).toBe(true);
    });

    /** Проверяет правильную работу с уровнем WARN */
    it('должен правильно работать с уровнем WARN', async () => {
        process.env.LOG_LEVEL = 'WARN';

        // Мокируем APP_CONFIG
        vi.doMock('../../../../../model/config', () => ({
            APP_CONFIG: {
                logging: { level: 'WARN' },
            },
        }));

        const { shouldLog } = await import('../should-log');
        const debugResult = shouldLog('DEBUG');
        const infoResult = shouldLog('INFO');
        const warnResult = shouldLog('WARN');
        const errorResult = shouldLog('ERROR');

        expect(debugResult).toBe(false);
        expect(infoResult).toBe(false);
        expect(warnResult).toBe(true);
        expect(errorResult).toBe(true);
    });

    /** Проверяет правильную работу с уровнем ERROR */
    it('должен правильно работать с уровнем ERROR', async () => {
        process.env.LOG_LEVEL = 'ERROR';

        // Мокируем APP_CONFIG
        vi.doMock('../../../../../model/config', () => ({
            APP_CONFIG: {
                logging: { level: 'ERROR' },
            },
        }));

        const { shouldLog } = await import('../should-log');
        const debugResult = shouldLog('DEBUG');
        const infoResult = shouldLog('INFO');
        const warnResult = shouldLog('WARN');
        const errorResult = shouldLog('ERROR');

        expect(debugResult).toBe(false);
        expect(infoResult).toBe(false);
        expect(warnResult).toBe(false);
        expect(errorResult).toBe(true);
    });
});
