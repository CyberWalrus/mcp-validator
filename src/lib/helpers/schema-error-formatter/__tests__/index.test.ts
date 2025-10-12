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
                received: 'undefined',
            },
        ]);

        const result = formatSchemaError(zodError);

        expect(result).toContain('Обязательное поле "data" отсутствует в input');
        expect(result).toContain('Ожидается: string');
    });

    it('должен форматировать ошибку неправильного значения enum', () => {
        const zodError = new ZodError([
            {
                code: 'invalid_enum_value',
                message: 'Invalid enum value',
                options: ['content', 'file', 'url'],
                path: ['input', 'type'],
                received: 'invalid',
            },
        ]);

        const result = formatSchemaError(zodError);

        expect(result).toContain('Неправильное значение для поля "type"');
        expect(result).toContain('Допустимые значения: content, file, url');
    });
});
