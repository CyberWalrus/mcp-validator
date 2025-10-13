import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('Logger', () => {
    let consoleLogSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        vi.resetModules();
        consoleLogSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.clearAllMocks();

        // Устанавливаем переменные окружения
        process.env.API_KEY = 'test-key';
        process.env.LOG_LEVEL = process.env.LOG_LEVEL || 'INFO';
    });

    afterEach(() => {
        consoleLogSpy.mockRestore();
        delete process.env.API_KEY;
        delete process.env.LOG_LEVEL;
    });

    /** Загружает модуль логгера с мокированием shouldLog */
    async function loadLogger() {
        // Мокируем shouldLog функцию
        vi.doMock('../helpers/should-log', () => ({
            shouldLog: (level: string) => {
                const levels = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
                const currentLevel = process.env.LOG_LEVEL || 'INFO';
                const currentLevelIndex = levels.indexOf(currentLevel);
                const messageLevelIndex = levels.indexOf(level);

                // Если currentLevel неизвестен, используем INFO как fallback
                if (currentLevelIndex === -1) {
                    return messageLevelIndex >= levels.indexOf('INFO');
                }

                return messageLevelIndex >= currentLevelIndex;
            },
        }));

        return import('..');
    }

    /** Проверяет логирование WARN сообщений по умолчанию */
    it('должен логировать сообщения WARN по умолчанию', async () => {
        const { warn } = await loadLogger();
        warn('Test warn message');

        expect(consoleLogSpy).toHaveBeenCalledWith(
            expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[WARN\] Test warn message/),
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

        const { log } = await loadLogger();
        log('DEBUG', 'Test debug message');

        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringMatching(/\[.*\] \[DEBUG\] Test debug message/));
    });

    /** Проверяет логирование сообщений с метаданными */
    it('должен логировать сообщения с метаданными', async () => {
        const { info } = await loadLogger();
        const metadata = { action: 'test', userId: 123 };
        info('Test message with metadata', metadata);

        expect(consoleLogSpy).toHaveBeenCalledWith(
            expect.stringMatching(/\[.*\] \[INFO\] Test message with metadata/),
            metadata,
        );
    });

    /** Проверяет что сообщения ниже установленного уровня не логируются */
    it('не должен логировать сообщения ниже установленного уровня', async () => {
        process.env.LOG_LEVEL = 'WARN';

        const { log } = await loadLogger();
        log('INFO', 'This should not be logged');
        log('DEBUG', 'This should not be logged');
        log('WARN', 'This should be logged');
        log('ERROR', 'This should be logged');

        expect(consoleLogSpy).toHaveBeenCalledTimes(2);
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringMatching(/\[.*\] \[WARN\] This should be logged/));
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringMatching(/\[.*\] \[ERROR\] This should be logged/));
    });

    /** Проверяет использование INFO уровня для неизвестного LOG_LEVEL */
    it('должен использовать INFO уровень для неизвестного LOG_LEVEL', async () => {
        process.env.LOG_LEVEL = 'UNKNOWN_LEVEL' as any;

        const { log } = await loadLogger();
        log('DEBUG', 'This should not be logged');
        log('INFO', 'This should be logged');

        // Мокированная функция shouldLog всегда возвращает true для INFO и выше
        expect(consoleLogSpy).toHaveBeenCalledTimes(1);
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringMatching(/\[.*\] \[INFO\] This should be logged/));
    });

    /** Проверяет обработку пустого сообщения */
    it('должен обрабатывать пустое сообщение', async () => {
        const { info } = await loadLogger();
        info('');

        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringMatching(/\[.*\] \[INFO\] /));
    });

    /** Проверяет обработку undefined метаданных */
    it('должен обрабатывать undefined метаданные', async () => {
        const { info } = await loadLogger();
        info('Test message', undefined);

        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringMatching(/\[.*\] \[INFO\] Test message/));
    });
});
