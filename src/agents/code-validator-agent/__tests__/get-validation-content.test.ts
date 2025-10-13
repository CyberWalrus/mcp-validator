import { beforeEach, describe, expect, it, vi } from 'vitest';

import { readFileContent } from '../../../services/adapters/file-reader';
import { getValidationContent } from '../get-validation-content';

vi.mock('../../../services/adapters/file-reader', () => ({
    readFileContent: vi.fn(),
}));

describe('getValidationContent', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('должен вернуть контент из файла при успешном чтении', async () => {
        const mockContent = 'function test() {}';
        vi.mocked(readFileContent).mockResolvedValue({
            content: mockContent,
            encoding: 'utf8',
            path: '/test/file.ts',
            success: true,
        });

        const result = await getValidationContent({
            input: {
                data: '/test/file.ts',
                type: 'file',
            },
            validationType: 'code',
        });

        expect(result).toEqual({
            content: mockContent,
            success: true,
        });
    });

    it('должен вернуть ошибку при неудачном чтении файла', async () => {
        const mockError = 'File not found';
        vi.mocked(readFileContent).mockResolvedValue({
            encoding: 'utf8',
            error: mockError,
            path: '/test/file.ts',
            success: false,
        });

        const result = await getValidationContent({
            input: {
                data: '/test/file.ts',
                type: 'file',
            },
            validationType: 'code',
        });

        expect(result).toEqual({
            error: `Ошибка чтения файла: ${mockError}`,
            success: false,
        });
    });

    it('должен вернуть контент напрямую для типа content', async () => {
        const mockContent = 'const x = 1;';

        const result = await getValidationContent({
            input: {
                data: mockContent,
                type: 'content',
            },
            validationType: 'code',
        });

        expect(result).toEqual({
            content: mockContent,
            success: true,
        });
    });

    it('должен вернуть ошибку для неподдерживаемого типа входных данных', async () => {
        const result = await getValidationContent({
            input: {
                data: 'https://example.com',
                type: 'url' as never,
            },
            validationType: 'code',
        });

        expect(result).toEqual({
            error: 'Неподдерживаемый тип входных данных',
            success: false,
        });
    });

    it('должен использовать указанную кодировку при чтении файла', async () => {
        vi.mocked(readFileContent).mockResolvedValue({
            content: 'test',
            encoding: 'utf16le',
            path: '/test/file.ts',
            success: true,
        });

        await getValidationContent({
            input: {
                data: '/test/file.ts',
                encoding: 'utf16le',
                type: 'file',
            },
            validationType: 'code',
        });

        expect(readFileContent).toHaveBeenCalledWith({
            encoding: 'utf16le',
            path: '/test/file.ts',
        });
    });

    it('должен обработать исключение при чтении файла', async () => {
        const ioError = new Error('IO error');
        vi.mocked(readFileContent).mockRejectedValue(ioError);

        await expect(
            getValidationContent({
                input: {
                    data: '/test/file.ts',
                    type: 'file',
                },
                validationType: 'code',
            }),
        ).rejects.toThrow('IO error');
    });
});
