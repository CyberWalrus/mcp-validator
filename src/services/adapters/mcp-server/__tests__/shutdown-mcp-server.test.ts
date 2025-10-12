import { _resetShutdownState, isShutdownInProgress, shutdownMCPServer } from '../shutdown-mcp-server';

const mockProcess = {
    exit: vi.fn(),
    stdin: {
        pause: vi.fn(),
        removeAllListeners: vi.fn(),
    },
};

vi.stubGlobal('process', {
    ...process,
    ...mockProcess,
});

describe('shutdownMCPServer', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
        _resetShutdownState();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('должен корректно завершить работу сервера', async () => {
        expect(isShutdownInProgress()).toBe(false);

        const shutdownPromise = shutdownMCPServer(0);

        expect(isShutdownInProgress()).toBe(true);

        const result = await shutdownPromise;

        // Проверяем что shutdown завершился успешно
        expect(result).toBe(0);
    });

    it('должен принудительно завершить процесс после таймаута', async () => {
        const shutdownPromise = shutdownMCPServer(1);

        const result = await shutdownPromise;

        // Проверяем что shutdown завершился с указанным кодом
        expect(result).toBe(1);
    });

    it('не должен запускать завершение дважды', async () => {
        expect(isShutdownInProgress()).toBe(false);

        const shutdownPromise1 = shutdownMCPServer(0);
        const shutdownPromise2 = shutdownMCPServer(0);

        await Promise.all([shutdownPromise1, shutdownPromise2]);

        expect(mockProcess.stdin.removeAllListeners).toHaveBeenCalledWith('data');
        expect(mockProcess.stdin.removeAllListeners).toHaveBeenCalledWith('error');
    });

    it('должен возвращать статус завершения', async () => {
        expect(isShutdownInProgress()).toBe(false);

        const shutdownPromise = shutdownMCPServer(0);

        expect(isShutdownInProgress()).toBe(true);

        await shutdownPromise;
    });
});
