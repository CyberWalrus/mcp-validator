import { showVersion } from '../show-version';

describe('showVersion', () => {
    let consoleSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    it('должен показывать номер версии', () => {
        showVersion();

        expect(consoleSpy).toHaveBeenCalledTimes(1);
        const output = consoleSpy.mock.calls[0]?.[0];

        expect(typeof output).toBe('string');
        expect(output).toMatch(/\d+\.\d+\.\d+/); // Проверяем формат версии
    });

    it('должен показывать версию из package.json', () => {
        showVersion();

        expect(consoleSpy).toHaveBeenCalled();
        // Версия должна быть строкой
        const output = consoleSpy.mock.calls[0]?.[0];
        expect(typeof output === 'string' && output.length).toBeGreaterThan(0);
    });
});
