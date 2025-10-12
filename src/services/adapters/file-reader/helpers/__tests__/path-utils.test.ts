import { stripLeadingSeparator } from '../path-utils';

describe('stripLeadingSeparator', () => {
    it('должен удалять ведущие слэши Unix', () => {
        const path = '/some/absolute/path';

        const result = stripLeadingSeparator(path);

        expect(result).toBe('some/absolute/path');
    });

    it('должен удалять ведущие бэкслэши Windows', () => {
        const path = '\\some\\absolute\\path';

        const result = stripLeadingSeparator(path);

        expect(result).toBe('some\\absolute\\path');
    });

    it('должен удалять множественные ведущие разделители', () => {
        const path = '///multiple/slashes/path';

        const result = stripLeadingSeparator(path);

        expect(result).toBe('multiple/slashes/path');
    });

    it('должен удалять ведущие точки с слэшем', () => {
        const path = './relative/path';

        const result = stripLeadingSeparator(path);

        expect(result).toBe('relative/path');
    });

    it('должен удалять ведущие точки с бэкслэшем', () => {
        const path = '.\\relative\\path';

        const result = stripLeadingSeparator(path);

        expect(result).toBe('relative\\path');
    });

    it('должен не изменять путь без ведущих разделителей', () => {
        const path = 'relative/path/file.txt';

        const result = stripLeadingSeparator(path);

        expect(result).toBe('relative/path/file.txt');
    });

    it('должен обрабатывать пустую строку', () => {
        const path = '';

        const result = stripLeadingSeparator(path);

        expect(result).toBe('');
    });

    it('должен обрабатывать только разделители', () => {
        const path = '/';

        const result = stripLeadingSeparator(path);

        expect(result).toBe('');
    });
});
