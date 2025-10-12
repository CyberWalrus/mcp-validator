import { log } from '../log';
import { shouldLog } from '../should-log';

// Мокируем shouldLog функцию
vi.mock('../should-log', () => ({
    shouldLog: vi.fn(),
}));

// Мокируем console.log
const mockedConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
const mockedShouldLog = vi.mocked(shouldLog);

describe('log', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Мокируем Date.prototype.toISOString для предсказуемых тестов
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2024-01-15T12:00:00.000Z'));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('должен выводить сообщение когда shouldLog возвращает true', () => {
        mockedShouldLog.mockReturnValue(true);

        log('INFO', 'Test message');

        expect(shouldLog).toHaveBeenCalledWith('INFO');
        expect(mockedConsoleLog).toHaveBeenCalledWith('[2024-01-15T12:00:00.000Z] [INFO] Test message');
    });

    it('не должен выводить сообщение когда shouldLog возвращает false', () => {
        mockedShouldLog.mockReturnValue(false);

        log('DEBUG', 'Debug message');

        expect(shouldLog).toHaveBeenCalledWith('DEBUG');
        expect(mockedConsoleLog).not.toHaveBeenCalled();
    });

    it('должен выводить сообщение с метаданными', () => {
        mockedShouldLog.mockReturnValue(true);
        const meta = { action: 'login', userId: 123 };

        log('INFO', 'User action', meta);

        expect(mockedConsoleLog).toHaveBeenCalledWith('[2024-01-15T12:00:00.000Z] [INFO] User action', meta);
    });

    it('должен правильно форматировать сообщения для разных уровней', () => {
        mockedShouldLog.mockReturnValue(true);

        const testCases = [
            { level: 'DEBUG', message: 'Debug info' },
            { level: 'INFO', message: 'Information' },
            { level: 'WARN', message: 'Warning message' },
            { level: 'ERROR', message: 'Error occurred' },
        ] as const;

        testCases.forEach((testCase) => {
            log(testCase.level, testCase.message);

            expect(mockedConsoleLog).toHaveBeenCalledWith(
                `[2024-01-15T12:00:00.000Z] [${testCase.level}] ${testCase.message}`,
            );
        });
    });

    it('должен использовать актуальное время для каждого вызова', () => {
        mockedShouldLog.mockReturnValue(true);

        log('INFO', 'First message');

        // Передвигаем время на 1 секунду
        vi.setSystemTime(new Date('2024-01-15T12:00:01.000Z'));

        log('INFO', 'Second message');

        expect(mockedConsoleLog).toHaveBeenCalledWith('[2024-01-15T12:00:00.000Z] [INFO] First message');
        expect(mockedConsoleLog).toHaveBeenCalledWith('[2024-01-15T12:00:01.000Z] [INFO] Second message');
    });

    it('должен обрабатывать пустые сообщения', () => {
        mockedShouldLog.mockReturnValue(true);

        log('INFO', '');

        expect(mockedConsoleLog).toHaveBeenCalledWith('[2024-01-15T12:00:00.000Z] [INFO] ');
    });

    it('должен обрабатывать сообщения с специальными символами', () => {
        mockedShouldLog.mockReturnValue(true);

        log('INFO', 'Message with "quotes" and \n newlines');

        expect(mockedConsoleLog).toHaveBeenCalledWith(
            '[2024-01-15T12:00:00.000Z] [INFO] Message with "quotes" and \n newlines',
        );
    });

    it('должен обрабатывать сложные метаданные', () => {
        mockedShouldLog.mockReturnValue(true);
        const complexMeta = {
            nested: { items: [1, 2, 3], level: 2 },
            timestamp: '2024-01-15',
            user: { id: 123, name: 'John' },
        };

        log('INFO', 'Complex meta', complexMeta);

        expect(mockedConsoleLog).toHaveBeenCalledWith('[2024-01-15T12:00:00.000Z] [INFO] Complex meta', complexMeta);
    });

    it('должен проверять shouldLog перед выводом', () => {
        mockedShouldLog.mockReturnValue(false);

        log('DEBUG', 'Should not log');

        expect(shouldLog).toHaveBeenCalledWith('DEBUG');
        expect(mockedConsoleLog).not.toHaveBeenCalled();
    });
});
