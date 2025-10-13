import { showHelp } from '../show-help';

describe('showHelp', () => {
    let consoleSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    it('должен показывать справку о доступных командах', () => {
        showHelp();

        expect(consoleSpy).toHaveBeenCalled();
        const output = consoleSpy.mock.calls.join('\n');

        expect(output).toContain('MCP Validator 2.0');
        expect(output).toContain('yarn start');
        expect(output).toContain('--help');
        expect(output).toContain('--version');
    });

    it('должен показывать информацию о возможностях', () => {
        showHelp();

        expect(consoleSpy).toHaveBeenCalled();
        const output = consoleSpy.mock.calls.join('\n');

        expect(output).toContain('9 типов валидации');
        expect(output).toContain('Параллельное тестирование промптов');
        expect(output).toContain('Интеграция с Cursor IDE');
    });

    it('должен показывать примеры MCP использования', () => {
        showHelp();

        expect(consoleSpy).toHaveBeenCalled();
        const output = consoleSpy.mock.calls.join('\n');

        expect(output).toContain('validate инструмент');
        expect(output).toContain('test-prompt инструмент');
        expect(output).toContain('validationType');
    });
});
