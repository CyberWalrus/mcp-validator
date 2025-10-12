describe('Logger', () => {
    let consoleLogSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        vi.resetModules();
        consoleLogSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.clearAllMocks();

        delete process.env.LOG_LEVEL;
        process.env.OPENROUTER_API_KEY = 'test-key';
    });

    afterEach(() => {
        consoleLogSpy.mockRestore();
        delete process.env.OPENROUTER_API_KEY;
    });

    async function loadLogger() {
        return import('..');
    }

    it('должен логировать сообщения INFO по умолчанию', async () => {
        const { info } = await loadLogger();
        info('Test info message');

        expect(consoleLogSpy).toHaveBeenCalledWith(
            expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[INFO\] Test info message/),
        );
    });

    it('должен логировать сообщения ERROR по умолчанию', async () => {
        const { error } = await loadLogger();
        error('Test error message');

        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringMatching(/\[.*\] \[ERROR\] Test error message/));
    });

    it('не должен логировать DEBUG сообщения по умолчанию', async () => {
        const { debug } = await loadLogger();
        debug('Test debug message');

        expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it('должен логировать DEBUG сообщения когда LOG_LEVEL=DEBUG', async () => {
        process.env.LOG_LEVEL = 'DEBUG';

        const { debug } = await loadLogger();
        debug('Test debug message');

        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringMatching(/\[.*\] \[DEBUG\] Test debug message/));
    });

    it('должен логировать сообщения с метаданными', async () => {
        const { info } = await loadLogger();
        const metadata = { action: 'test', userId: 123 };

        info('Test with metadata', metadata);

        expect(consoleLogSpy).toHaveBeenCalledWith(
            expect.stringMatching(/\[.*\] \[INFO\] Test with metadata/),
            metadata,
        );
    });

    it('не должен логировать сообщения ниже установленного уровня', async () => {
        process.env.LOG_LEVEL = 'ERROR';

        const { debug, info, warn, error } = await loadLogger();
        debug('Debug message');
        info('Info message');
        warn('Warn message');

        expect(consoleLogSpy).not.toHaveBeenCalled();

        error('Error message');

        expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    });

    it('должен использовать INFO уровень для неизвестного LOG_LEVEL', async () => {
        // @ts-expect-error - тест на неизвестный уровень логирования
        process.env.LOG_LEVEL = 'UNKNOWN_LEVEL';

        const { debug, info } = await loadLogger();
        debug('Debug message');
        info('Info message');

        expect(consoleLogSpy).toHaveBeenCalledTimes(1);
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringMatching(/\[.*\] \[INFO\] Info message/));
    });

    it('должен обрабатывать пустое сообщение', async () => {
        const { info } = await loadLogger();
        info('');

        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringMatching(/\[.*\] \[INFO\] $/));
    });

    it('должен обрабатывать undefined метаданные', async () => {
        const { info } = await loadLogger();
        info('Test message', undefined);

        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringMatching(/\[.*\] \[INFO\] Test message/));
    });
});
