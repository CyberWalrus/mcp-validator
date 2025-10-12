describe('shouldLog', () => {
    const originalEnv = process.env;

    async function reloadConfig(): Promise<void> {
        const configModule = await import('../../../../../model/config');

        configModule.reloadAppConfig();
    }

    async function loadShouldLog() {
        await reloadConfig();
        const module = await import('../should-log');

        return module.shouldLog;
    }

    beforeEach(() => {
        vi.resetModules();
        process.env = { ...originalEnv };
        process.env.OPENROUTER_API_KEY = 'test-key';
    });

    afterAll(async () => {
        process.env = originalEnv;
        await reloadConfig();
    });

    it('должен возвращать true для DEBUG при уровне DEBUG', async () => {
        process.env.LOG_LEVEL = 'DEBUG';

        const shouldLog = await loadShouldLog();
        const result = shouldLog('DEBUG');

        expect(result).toBe(true);
    });

    it('должен возвращать true для INFO при уровне DEBUG', async () => {
        process.env.LOG_LEVEL = 'DEBUG';

        const shouldLog = await loadShouldLog();
        const result = shouldLog('INFO');

        expect(result).toBe(true);
    });

    it('должен возвращать false для DEBUG при уровне INFO', async () => {
        process.env.LOG_LEVEL = 'INFO';

        const shouldLog = await loadShouldLog();
        const result = shouldLog('DEBUG');

        expect(result).toBe(false);
    });

    it('должен возвращать true для INFO при уровне INFO', async () => {
        process.env.LOG_LEVEL = 'INFO';

        const shouldLog = await loadShouldLog();
        const result = shouldLog('INFO');

        expect(result).toBe(true);
    });

    it('должен возвращать true для WARN при уровне INFO', async () => {
        process.env.LOG_LEVEL = 'INFO';

        const shouldLog = await loadShouldLog();
        const result = shouldLog('WARN');

        expect(result).toBe(true);
    });

    it('должен возвращать true для ERROR при любом уровне', async () => {
        const levels = ['DEBUG', 'INFO', 'WARN', 'ERROR'] as const;

        for (const level of levels) {
            process.env.LOG_LEVEL = level;
            const shouldLog = await loadShouldLog();
            const result = shouldLog('ERROR');

            expect(result).toBe(true);
        }
    });

    it('должен использовать INFO как уровень по умолчанию', async () => {
        delete process.env.LOG_LEVEL;

        const shouldLog = await loadShouldLog();
        const debugResult = shouldLog('DEBUG');
        const infoResult = shouldLog('INFO');

        expect(debugResult).toBe(false);
        expect(infoResult).toBe(true);
    });

    it('должен использовать INFO при некорректном уровне в переменной окружения', async () => {
        // @ts-ignore
        process.env.LOG_LEVEL = 'INVALID_LEVEL';

        const shouldLog = await loadShouldLog();
        const debugResult = shouldLog('DEBUG');
        const infoResult = shouldLog('INFO');

        expect(debugResult).toBe(false);
        expect(infoResult).toBe(true);
    });

    it('должен правильно работать с уровнем WARN', async () => {
        process.env.LOG_LEVEL = 'WARN';

        const shouldLog = await loadShouldLog();
        const debugResult = shouldLog('DEBUG');
        const infoResult = shouldLog('INFO');
        const warnResult = shouldLog('WARN');
        const errorResult = shouldLog('ERROR');

        expect(debugResult).toBe(false);
        expect(infoResult).toBe(false);
        expect(warnResult).toBe(true);
        expect(errorResult).toBe(true);
    });

    it('должен правильно работать с уровнем ERROR', async () => {
        process.env.LOG_LEVEL = 'ERROR';

        const shouldLog = await loadShouldLog();
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
