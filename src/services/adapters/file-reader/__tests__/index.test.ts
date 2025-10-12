import { readFile } from 'node:fs/promises';

import { readFileContent } from '..';

vi.mock('node:fs/promises', () => ({
    readFile: vi.fn(),
}));

const mockReadFile = vi.mocked(readFile);

describe('readFileContent', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('должен успешно читать файл с UTF8 кодировкой', async () => {
        const filePath = '/test/file.txt';
        const fileContent = 'Test content';
        mockReadFile.mockResolvedValue(fileContent);

        const result = await readFileContent({
            encoding: 'utf8',
            path: filePath,
        });

        expect(result).toEqual({
            content: fileContent,
            encoding: 'utf8',
            path: filePath,
            size: fileContent.length,
            success: true,
        });

        expect(mockReadFile).toHaveBeenCalledWith(filePath, 'utf8');
    });

    it('должен использовать UTF8 по умолчанию', async () => {
        const filePath = '/test/file.txt';
        const fileContent = 'Default encoding test';
        mockReadFile.mockResolvedValue(fileContent);

        const result = await readFileContent({
            path: filePath,
        });

        expect(result).toEqual({
            content: fileContent,
            encoding: 'utf8',
            path: filePath,
            size: fileContent.length,
            success: true,
        });

        expect(mockReadFile).toHaveBeenCalledWith(filePath, 'utf8');
    });

    it('должен читать файл с UTF16LE кодировкой', async () => {
        const filePath = '/test/unicode.txt';
        const fileContent = 'Unicode content';
        mockReadFile.mockResolvedValue(fileContent);

        const result = await readFileContent({
            encoding: 'utf16le',
            path: filePath,
        });

        expect(result).toEqual({
            content: fileContent,
            encoding: 'utf16le',
            path: filePath,
            size: fileContent.length,
            success: true,
        });

        expect(mockReadFile).toHaveBeenCalledWith(filePath, 'utf16le');
    });

    it('должен читать файл с ASCII кодировкой', async () => {
        const filePath = '/test/ascii.txt';
        const fileContent = 'ASCII content';
        mockReadFile.mockResolvedValue(fileContent);

        const result = await readFileContent({
            encoding: 'ascii',
            path: filePath,
        });

        expect(result).toEqual({
            content: fileContent,
            encoding: 'ascii',
            path: filePath,
            size: fileContent.length,
            success: true,
        });

        expect(mockReadFile).toHaveBeenCalledWith(filePath, 'ascii');
    });

    it('должен обрабатывать ошибки чтения файла', async () => {
        const filePath = '/test/nonexistent.txt';
        const error = new Error('ENOENT: no such file or directory');
        mockReadFile.mockRejectedValue(error);

        const result = await readFileContent({
            path: filePath,
        });

        expect(result).toEqual({
            encoding: 'utf8',
            error: 'Ошибка чтения файла: ENOENT: no such file or directory',
            path: filePath,
            success: false,
        });

        expect(mockReadFile).toHaveBeenCalledWith(filePath, 'utf8');
    });

    it('должен обрабатывать пустые файлы', async () => {
        const filePath = '/test/empty.txt';
        const fileContent = '';
        mockReadFile.mockResolvedValue(fileContent);

        const result = await readFileContent({
            path: filePath,
        });

        expect(result).toEqual({
            content: '',
            encoding: 'utf8',
            path: filePath,
            size: 0,
            success: true,
        });
    });

    it('должен обрабатывать очень большие файлы', async () => {
        const filePath = '/test/large.txt';
        const fileContent = 'A'.repeat(100000); // 100KB
        mockReadFile.mockResolvedValue(fileContent);

        const result = await readFileContent({
            path: filePath,
        });

        expect(result).toEqual({
            content: fileContent,
            encoding: 'utf8',
            path: filePath,
            size: 100000,
            success: true,
        });
    });

    it('должен корректно обрабатывать специальные символы', async () => {
        const filePath = '/test/special.txt';
        const fileContent = 'Текст с эмодзи 🚀 и символами ñáéíóú';
        mockReadFile.mockResolvedValue(fileContent);

        const result = await readFileContent({
            path: filePath,
        });

        expect(result).toEqual({
            content: fileContent,
            encoding: 'utf8',
            path: filePath,
            size: fileContent.length,
            success: true,
        });
    });
});
