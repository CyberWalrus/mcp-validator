import { createErrorResult, createSuccessResult } from '../result-builders';

describe('createSuccessResult', () => {
    it('должен создавать успешный результат с корректными полями', () => {
        const content = 'Test file content';
        const encoding = 'utf8';
        const path = '/path/to/file.txt';

        const result = createSuccessResult(content, encoding, path);

        expect(result).toEqual({
            content,
            encoding,
            path,
            size: content.length,
            success: true,
        });
    });

    it('должен правильно вычислять размер файла', () => {
        const content = 'Hello World!';
        const encoding = 'ascii';
        const path = '/test.txt';

        const result = createSuccessResult(content, encoding, path);

        expect(result.size).toBe(12);
        expect(result.success).toBe(true);
    });

    it('должен обрабатывать пустой контент', () => {
        const content = '';
        const encoding = 'utf8';
        const path = '/empty.txt';

        const result = createSuccessResult(content, encoding, path);

        expect(result.content).toBe('');
        expect(result.size).toBe(0);
        expect(result.success).toBe(true);
    });
});

describe('createErrorResult', () => {
    it('должен создавать результат с ошибкой с корректными полями', () => {
        const error = 'File not found';
        const encoding = 'utf8';
        const path = '/nonexistent/file.txt';

        const result = createErrorResult(error, encoding, path);

        expect(result).toEqual({
            encoding,
            error,
            path,
            success: false,
        });
    });

    it('должен не иметь поля content и size при ошибке', () => {
        const error = 'Permission denied';
        const encoding = 'ascii';
        const path = '/restricted/file.txt';

        const result = createErrorResult(error, encoding, path);

        expect(result.success).toBe(false);
        expect(result).not.toHaveProperty('content');
        expect(result).not.toHaveProperty('size');
    });

    it('должен обрабатывать различные сообщения об ошибках', () => {
        const longError = 'This is a very detailed error message about what went wrong';
        const encoding = 'utf16le';
        const path = '/complex/path/to/file.txt';

        const result = createErrorResult(longError, encoding, path);

        expect(result.error).toBe(longError);
        expect(result.encoding).toBe(encoding);
        expect(result.path).toBe(path);
    });
});
