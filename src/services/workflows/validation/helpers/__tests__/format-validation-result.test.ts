import { formatValidationResult } from '../format-validation-result';

describe('formatValidationResult', () => {
    it('должен возвращать строку как есть', () => {
        const result = 'Это строковый результат';

        expect(formatValidationResult(result)).toBe(result);
    });

    it('должен форматировать объект в JSON', () => {
        const result = { score: 95, status: 'success' };

        const formatted = formatValidationResult(result);

        expect(formatted).toBe(JSON.stringify(result, null, 2));
        expect(formatted).toContain('"status": "success"');
        expect(formatted).toContain('"score": 95');
    });

    it('должен форматировать массив в JSON', () => {
        const result = ['item1', 'item2', 'item3'];

        const formatted = formatValidationResult(result);

        expect(formatted).toBe(JSON.stringify(result, null, 2));
        expect(formatted).toContain('"item1"');
    });

    it('должен обрабатывать вложенные объекты', () => {
        const result = {
            validation: {
                details: {
                    issues: [],
                    score: 85,
                },
                passed: true,
            },
        };

        const formatted = formatValidationResult(result);

        expect(formatted).toBe(JSON.stringify(result, null, 2));
        expect(formatted).toContain('"passed": true');
        expect(formatted).toContain('"score": 85');
    });

    it('должен конвертировать числа в строку', () => {
        expect(formatValidationResult(42)).toBe('42');
        expect(formatValidationResult(3.14)).toBe('3.14');
        expect(formatValidationResult(0)).toBe('0');
    });

    it('должен обрабатывать булевые значения', () => {
        expect(formatValidationResult(true)).toBe('true');
        expect(formatValidationResult(false)).toBe('false');
    });

    it('должен обрабатывать null и undefined', () => {
        expect(formatValidationResult(null)).toBe('null');
        expect(formatValidationResult(undefined)).toBe('undefined');
    });

    it('должен обрабатывать объекты с циклическими ссылками', () => {
        const obj: any = { name: 'test' };
        obj.self = obj; // Создаем циклическую ссылку

        const result = formatValidationResult(obj);

        // Должен вернуться результат String() так как JSON.stringify упадет
        expect(result).toBe('[object Object]');
    });

    it('должен обрабатывать пустую строку', () => {
        expect(formatValidationResult('')).toBe('');
    });

    it('должен обрабатывать пустой объект', () => {
        const result = formatValidationResult({});

        expect(result).toBe('{}');
    });

    it('должен обрабатывать пустой массив', () => {
        const result = formatValidationResult([]);

        expect(result).toBe('[]');
    });
});
