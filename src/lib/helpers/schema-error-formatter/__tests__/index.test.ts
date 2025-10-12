import { ZodError } from 'zod';

import { formatSchemaError } from '..';

describe('formatSchemaError', () => {
    it('должен форматировать ошибку неизвестного поля с подсказкой', () => {
        const zodError = new ZodError([
            {
                code: 'unrecognized_keys',
                keys: ['path'],
                message: "Unrecognized key(s) in object: 'path'",
                path: ['input'],
            },
        ]);

        const result = formatSchemaError(zodError);

        expect(result).toContain('Неизвестное поле "path" в объекте input');
        expect(result).toContain('Возможно вы имели в виду поле "data"?');
    });

    it('должен форматировать ошибку обязательного поля', () => {
        const zodError = new ZodError([
            {
                code: 'invalid_type',
                expected: 'string',
                message: 'Required',
                path: ['input', 'data'],
            },
        ]);

        const result = formatSchemaError(zodError);

        expect(result).toContain('Required');
    });

    it('должен форматировать ошибку неправильного значения enum', () => {
        const zodError = new ZodError([
            {
                code: 'invalid_value',
                message: 'Invalid enum value',
                path: ['input', 'type'],
                values: ['content', 'file', 'url'],
            },
        ]);

        const result = formatSchemaError(zodError);

        expect(result).toContain('Неправильное значение для поля "type"');
        expect(result).toContain('Допустимые значения: content, file, url');
    });
});
