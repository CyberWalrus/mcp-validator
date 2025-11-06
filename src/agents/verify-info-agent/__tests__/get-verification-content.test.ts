import { beforeEach, describe, expect, it, vi } from 'vitest';

import { readFileContent } from '../../../services/adapters/file-reader';
import { getVerificationContent } from '../get-verification-content';

vi.mock('../../../services/adapters/file-reader', () => ({
    readFileContent: vi.fn(),
}));

describe('getVerificationContent', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('должен вернуть контент из файла при успешном чтении', async () => {
        const mockContent = 'Информация для проверки';
        vi.mocked(readFileContent).mockResolvedValue({
            content: mockContent,
            encoding: 'utf8',
            path: '/test/file.txt',
            success: true,
        });

        const result = await getVerificationContent({
            input: {
                data: '/test/file.txt',
                encoding: 'utf8',
                type: 'file',
            },
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
            path: '/test/file.txt',
            success: false,
        });

        const result = await getVerificationContent({
            input: {
                data: '/test/file.txt',
                encoding: 'utf8',
                type: 'file',
            },
        });

        expect(result).toEqual({
            error: `Ошибка чтения файла: ${mockError}`,
            success: false,
        });
    });

    it('должен вернуть контент напрямую для типа content', async () => {
        const mockContent = 'Текст для проверки';

        const result = await getVerificationContent({
            input: {
                data: mockContent,
                encoding: 'utf8',
                type: 'content',
            },
        });

        expect(result).toEqual({
            content: mockContent,
            success: true,
        });
    });

    it('должен использовать указанную кодировку при чтении файла', async () => {
        vi.mocked(readFileContent).mockResolvedValue({
            content: 'test',
            encoding: 'utf16le',
            path: '/test/file.txt',
            success: true,
        });

        await getVerificationContent({
            encoding: 'utf16le',
            input: {
                data: '/test/file.txt',
                encoding: 'utf16le',
                type: 'file',
            },
        });

        expect(readFileContent).toHaveBeenCalledWith({
            encoding: 'utf16le',
            path: '/test/file.txt',
        });
    });

    it('должен использовать кодировку из input если encoding не указан на верхнем уровне', async () => {
        vi.mocked(readFileContent).mockResolvedValue({
            content: 'test',
            encoding: 'ascii',
            path: '/test/file.txt',
            success: true,
        });

        await getVerificationContent({
            input: {
                data: '/test/file.txt',
                encoding: 'ascii',
                type: 'file',
            },
        });

        expect(readFileContent).toHaveBeenCalledWith({
            encoding: 'ascii',
            path: '/test/file.txt',
        });
    });
});
