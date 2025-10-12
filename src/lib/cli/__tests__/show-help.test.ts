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

        expect(output).toContain('MCP Validator');
        expect(output).toContain('validate');
        expect(output).toContain('test-prompt');
    });

    it('должен показывать информацию о версии', () => {
        showHelp();

        expect(consoleSpy).toHaveBeenCalled();
        const output = consoleSpy.mock.calls.join('\n');

        expect(output).toContain('--version');
    });

    it('должен показывать примеры использования', () => {
        showHelp();

        expect(consoleSpy).toHaveBeenCalled();
        const output = consoleSpy.mock.calls.join('\n');

        expect(output).toContain('EXAMPLES');
        expect(output).toContain('npx');
    });
});
