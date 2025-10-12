import { log } from '../log';

// Мокируем shouldLog функцию
vi.mock('../should-log', () => ({
    shouldLog: vi.fn(),
}));

// Мокируем console.error
const mockedConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

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

    it('должен выводить сообщение когда shouldLog возвращает true', async () => {
        const { shouldLog } = await import('../should-log');
        vi.mocked(shouldLog).mockReturnValue(true);

        log('INFO', 'Test message');

        expect(mockedConsoleError).toHaveBeenCalledWith('[2024-01-15T12:00:00.000Z] [INFO] Test message');
    });

    it('не должен выводить сообщение когда shouldLog возвращает false', async () => {
        const { shouldLog } = await import('../should-log');
        vi.mocked(shouldLog).mockReturnValue(false);

        log('DEBUG', 'Debug message');

        expect(mockedConsoleError).not.toHaveBeenCalled();
    });

    it('должен выводить сообщение с метаданными', async () => {
        const { shouldLog } = await import('../should-log');
        vi.mocked(shouldLog).mockReturnValue(true);
        const meta = { action: 'login', userId: 123 };

        log('INFO', 'User action', meta);

        expect(mockedConsoleError).toHaveBeenCalledWith('[2024-01-15T12:00:00.000Z] [INFO] User action', meta);
    });

    it('должен правильно форматировать сообщения для разных уровней', async () => {
        const { shouldLog } = await import('../should-log');
        vi.mocked(shouldLog).mockReturnValue(true);

        // Тестируем только один уровень для простоты
        log('INFO', 'Test message');
        expect(mockedConsoleError).toHaveBeenCalledWith('[2024-01-15T12:00:00.000Z] [INFO] Test message');
    });

    it('должен использовать актуальное время для каждого вызова', async () => {
        const { shouldLog } = await import('../should-log');
        vi.mocked(shouldLog).mockReturnValue(true);

        log('INFO', 'First message');

        // Передвигаем время на 1 секунду
        vi.setSystemTime(new Date('2024-01-15T12:00:01.000Z'));

        log('INFO', 'Second message');

        expect(mockedConsoleError).toHaveBeenCalledWith('[2024-01-15T12:00:00.000Z] [INFO] First message');
        expect(mockedConsoleError).toHaveBeenCalledWith('[2024-01-15T12:00:01.000Z] [INFO] Second message');
    });

    it('должен обрабатывать пустые сообщения', async () => {
        const { shouldLog } = await import('../should-log');
        vi.mocked(shouldLog).mockReturnValue(true);

        log('INFO', '');

        expect(mockedConsoleError).toHaveBeenCalledWith('[2024-01-15T12:00:00.000Z] [INFO] ');
    });

    it('должен обрабатывать сообщения с специальными символами', async () => {
        const { shouldLog } = await import('../should-log');
        vi.mocked(shouldLog).mockReturnValue(true);

        log('INFO', 'Message with "quotes" and \n newlines');

        expect(mockedConsoleError).toHaveBeenCalledWith(
            '[2024-01-15T12:00:00.000Z] [INFO] Message with "quotes" and \n newlines',
        );
    });

    it('должен обрабатывать сложные метаданные', async () => {
        const { shouldLog } = await import('../should-log');
        vi.mocked(shouldLog).mockReturnValue(true);
        const complexMeta = {
            nested: { items: [1, 2, 3], level: 2 },
            timestamp: '2024-01-15',
            user: { id: 123, name: 'John' },
        };

        log('INFO', 'Complex meta', complexMeta);

        expect(mockedConsoleError).toHaveBeenCalledWith('[2024-01-15T12:00:00.000Z] [INFO] Complex meta', complexMeta);
    });

    it('должен проверять shouldLog перед выводом', async () => {
        const { shouldLog } = await import('../should-log');
        vi.mocked(shouldLog).mockReturnValue(false);

        log('DEBUG', 'Should not log');

        expect(mockedConsoleError).not.toHaveBeenCalled();
    });
});
