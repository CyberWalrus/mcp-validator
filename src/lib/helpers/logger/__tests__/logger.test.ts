describe('Logger', () => {
    let consoleLogSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        vi.resetModules();
        consoleLogSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.clearAllMocks();

        delete process.env.LOG_LEVEL;
        process.env.API_KEY = 'test-key';
    });

    afterEach(() => {
        consoleLogSpy.mockRestore();
        delete process.env.API_KEY;
    });

    /** Загружает модуль логгера */
    async function loadLogger() {
        return import('..');
    }

    /** Проверяет логирование INFO сообщений по умолчанию */
    it('должен логировать сообщения INFO по умолчанию', async () => {
        const { info } = await loadLogger();
        info('Test info message');

        expect(consoleLogSpy).toHaveBeenCalledWith(
            expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[INFO\] Test info message/),
        );
    });

    /** Проверяет логирование ERROR сообщений по умолчанию */
    it('должен логировать сообщения ERROR по умолчанию', async () => {
        const { error } = await loadLogger();
        error('Test error message');

        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringMatching(/\[.*\] \[ERROR\] Test error message/));
    });

    /** Проверяет что DEBUG сообщения не логируются по умолчанию */
    it('не должен логировать DEBUG сообщения по умолчанию', async () => {
        const { log } = await loadLogger();
        log('DEBUG', 'Test debug message');

        expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    /** Проверяет логирование DEBUG сообщений при LOG_LEVEL=DEBUG */
    it('должен логировать DEBUG сообщения когда LOG_LEVEL=DEBUG', async () => {
        process.env.LOG_LEVEL = 'DEBUG';

        consoleLogSpy.mockClear();

        vi.resetModules();
        const { reloadAppConfig } = await import('../../../../model/config');
        await reloadAppConfig();

        const { log } = await loadLogger();
        log('DEBUG', 'Test debug message');

        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringMatching(/\[.*\] \[DEBUG\] Test debug message/));
    });

    /** Проверяет логирование сообщений с метаданными */
    it('должен логировать сообщения с метаданными', async () => {
        const { info } = await loadLogger();
        const metadata = { action: 'test', userId: 123 };

        info('Test with metadata', metadata);

        expect(consoleLogSpy).toHaveBeenCalledWith(
            expect.stringMatching(/\[.*\] \[INFO\] Test with metadata/),
            metadata,
        );
    });

    /** Проверяет фильтрацию сообщений по уровню логирования */
    it('не должен логировать сообщения ниже установленного уровня', async () => {
        process.env.LOG_LEVEL = 'ERROR';

        const { log, info, error } = await loadLogger();
        log('DEBUG', 'Debug message');
        info('Info message');
        log('WARN', 'Warn message');

        consoleLogSpy.mockClear();

        error('Error message');

        expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    });

    /** Проверяет использование INFO уровня для неизвестного LOG_LEVEL */
    it('должен использовать INFO уровень для неизвестного LOG_LEVEL', async () => {
        process.env.LOG_LEVEL = 'UNKNOWN_LEVEL' as any;

        const { log, info } = await loadLogger();
        log('DEBUG', 'Debug message');
        info('Info message');

        expect(consoleLogSpy).toHaveBeenCalledTimes(1);
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringMatching(/\[.*\] \[INFO\] Info message/));
    });

    /** Проверяет обработку пустого сообщения */
    it('должен обрабатывать пустое сообщение', async () => {
        const { info } = await loadLogger();
        info('');

        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringMatching(/\[.*\] \[INFO\] $/));
    });

    /** Проверяет обработку undefined метаданных */
    it('должен обрабатывать undefined метаданные', async () => {
        const { info } = await loadLogger();
        info('Test message', undefined);

        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringMatching(/\[.*\] \[INFO\] Test message/));
    });
});
