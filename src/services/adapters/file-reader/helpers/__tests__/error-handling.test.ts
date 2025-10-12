import { isEnoentError } from '../error-handling';

describe('isEnoentError', () => {
    it('должен возвращать true для ENOENT ошибки', () => {
        const error = new Error('ENOENT: no such file or directory') as NodeJS.ErrnoException;
        error.code = 'ENOENT';

        const result = isEnoentError(error);

        expect(result).toBe(true);
    });

    it('должен возвращать false для не-ENOENT ошибки', () => {
        const error = new Error('EACCES: permission denied') as NodeJS.ErrnoException;
        error.code = 'EACCES';

        const result = isEnoentError(error);

        expect(result).toBe(false);
    });

    it('должен возвращать false для ошибки без кода', () => {
        const error = new Error('Regular error');

        const result = isEnoentError(error);

        expect(result).toBe(false);
    });

    it('должен возвращать false для не-Error объекта', () => {
        const error = 'String error';

        const result = isEnoentError(error);

        expect(result).toBe(false);
    });

    it('должен возвращать false для null', () => {
        const result = isEnoentError(null);

        expect(result).toBe(false);
    });

    it('должен возвращать false для undefined', () => {
        const result = isEnoentError(undefined);

        expect(result).toBe(false);
    });
});
