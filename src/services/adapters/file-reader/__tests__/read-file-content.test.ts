import { readFile as readFileAsync } from 'node:fs/promises';

import { readFileContent } from '../read-file-content';

vi.mock('node:fs/promises', () => ({
    readFile: vi.fn(),
}));

const mockReadFile = vi.mocked(readFileAsync);

describe('readFileContent', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('должен асинхронно читать файл с правильной кодировкой', async () => {
        const fileContent = 'Test file content';
        mockReadFile.mockResolvedValue(fileContent);

        const result = await readFileContent({
            encoding: 'utf8',
            path: 'test.txt',
        });

        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('content', fileContent);
        expect(result).toHaveProperty('encoding', 'utf8');
        expect(result).toHaveProperty('path', 'test.txt');
        expect(result).toHaveProperty('size', fileContent.length);
    });

    it('должен возвращать размер файла', async () => {
        const fileContent = 'Test content for size check';
        mockReadFile.mockResolvedValue(fileContent);

        const result = await readFileContent({
            path: 'test.txt',
        });

        expect(result).toHaveProperty('size');
        expect(typeof result.size).toBe('number');
        expect(result.size).toBe(fileContent.length);
    });

    it('должен обрабатывать ошибки чтения', async () => {
        const error = new Error('ENOENT: no such file or directory');
        mockReadFile.mockRejectedValue(error);

        const result = await readFileContent({
            path: 'nonexistent-file.txt',
        });

        expect(result.success).toBe(false);
        expect(result).toHaveProperty('error');
        expect(typeof result.error).toBe('string');
        expect(result.error).toContain('ENOENT');
    });

    it('должен использовать кодировку по умолчанию utf8', async () => {
        const fileContent = 'Default encoding test';
        mockReadFile.mockResolvedValue(fileContent);

        const result = await readFileContent({
            path: 'test.txt',
        });

        expect(result.encoding).toBe('utf8');
        expect(mockReadFile).toHaveBeenCalledWith('test.txt', 'utf8');
    });
});
