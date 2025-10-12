import { readFile as readFileAsync } from 'node:fs/promises';

import { tryReadFile } from '../file-operations';

vi.mock('node:fs/promises', () => ({
    readFile: vi.fn(),
}));

const mockReadFile = vi.mocked(readFileAsync);

describe('tryReadFile', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('должен возвращать содержимое файла при успешном чтении', async () => {
        const fileContent = 'Test file content';
        const filePath = '/path/to/file.txt';
        const encoding = 'utf8';

        mockReadFile.mockResolvedValue(fileContent);

        const result = await tryReadFile(filePath, encoding);

        expect(result.content).toBe(fileContent);
        expect(result.error).toBeNull();
        expect(mockReadFile).toHaveBeenCalledWith(filePath, encoding);
    });

    it('должен возвращать ошибку при неуспешном чтении', async () => {
        const error = new Error('File not found');
        const filePath = '/nonexistent/file.txt';
        const encoding = 'utf8';

        mockReadFile.mockRejectedValue(error);

        const result = await tryReadFile(filePath, encoding);

        expect(result.content).toBeNull();
        expect(result.error).toBe(error);
        expect(mockReadFile).toHaveBeenCalledWith(filePath, encoding);
    });

    it('должен работать с разными кодировками', async () => {
        const fileContent = 'ASCII content';
        const filePath = '/path/to/ascii.txt';
        const encoding = 'ascii';

        mockReadFile.mockResolvedValue(fileContent);

        const result = await tryReadFile(filePath, encoding);

        expect(result.content).toBe(fileContent);
        expect(result.error).toBeNull();
        expect(mockReadFile).toHaveBeenCalledWith(filePath, encoding);
    });

    it('должен обрабатывать пустой файл', async () => {
        const fileContent = '';
        const filePath = '/path/to/empty.txt';
        const encoding = 'utf8';

        mockReadFile.mockResolvedValue(fileContent);

        const result = await tryReadFile(filePath, encoding);

        expect(result.content).toBe('');
        expect(result.error).toBeNull();
    });
});
