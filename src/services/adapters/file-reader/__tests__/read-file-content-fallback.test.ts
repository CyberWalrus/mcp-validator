import { readFile as readFileAsync } from 'node:fs/promises';
import { resolve } from 'node:path';

import { readFileContent } from '../read-file-content';

vi.mock('node:fs/promises', () => ({
    readFile: vi.fn(),
}));

vi.mock('node:path', async () => {
    const actual = await vi.importActual('node:path');
    const actualResolve = (actual as { resolve: typeof resolve }).resolve;

    return {
        ...actual,
        resolve: vi.fn((...segments: Parameters<typeof resolve>) => actualResolve(...segments)),
    };
});

const mockReadFile = vi.mocked(readFileAsync);
const mockResolve = vi.mocked(resolve);

describe('readFileContent фолбэк', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.cwd = vi.fn().mockReturnValue('/current/working/directory');
    });

    it('должен успешно читать файл через фолбэк при ENOENT на абсолютном пути', async () => {
        const fileContent = 'Fallback content';
        const absolutePath = '/non/existent/absolute/file.txt';
        const fallbackPath = '/current/working/directory/non/existent/absolute/file.txt';

        // Первая попытка - ENOENT
        const enoentError = new Error('ENOENT: no such file or directory') as NodeJS.ErrnoException;
        enoentError.code = 'ENOENT';

        // Вторая попытка - успех
        mockReadFile.mockRejectedValueOnce(enoentError).mockResolvedValueOnce(fileContent);

        mockResolve.mockReturnValue(fallbackPath);

        const result = await readFileContent({
            encoding: 'utf8',
            path: absolutePath,
        });

        expect(result.success).toBe(true);
        expect(result.content).toBe(fileContent);
        expect(result.path).toBe(fallbackPath);
        expect(result.encoding).toBe('utf8');
        expect(result.size).toBe(fileContent.length);

        // Проверяем что было две попытки чтения
        expect(mockReadFile).toHaveBeenCalledTimes(2);
        expect(mockReadFile).toHaveBeenNthCalledWith(1, absolutePath, 'utf8');
        expect(mockReadFile).toHaveBeenNthCalledWith(2, fallbackPath, 'utf8');
    });

    it('должен вернуть ошибку когда обе попытки неуспешны', async () => {
        const absolutePath = '/non/existent/file.txt';
        const fallbackPath = '/current/working/directory/non/existent/file.txt';

        const enoentError1 = new Error('ENOENT: no such file or directory') as NodeJS.ErrnoException;
        enoentError1.code = 'ENOENT';

        const enoentError2 = new Error('ENOENT: no such file or directory') as NodeJS.ErrnoException;
        enoentError2.code = 'ENOENT';

        mockReadFile.mockRejectedValueOnce(enoentError1).mockRejectedValueOnce(enoentError2);

        mockResolve.mockReturnValue(fallbackPath);

        const result = await readFileContent({
            path: absolutePath,
        });

        expect(result.success).toBe(false);
        expect(result.error).toContain('ENOENT');
        expect(result.error).toContain(absolutePath);
        expect(result.error).toContain(fallbackPath);
        expect(result.encoding).toBe('utf8');
        expect(result.path).toBe(absolutePath);

        // Проверяем что было две попытки чтения
        expect(mockReadFile).toHaveBeenCalledTimes(2);
    });

    it('должен вернуть ошибку для не-ENOENT ошибок без фолбэка', async () => {
        const filePath = '/some/file.txt';
        const permissionError = new Error('EACCES: permission denied') as NodeJS.ErrnoException;
        permissionError.code = 'EACCES';

        mockReadFile.mockRejectedValue(permissionError);

        const result = await readFileContent({
            path: filePath,
        });

        expect(result.success).toBe(false);
        expect(result.error).toContain('EACCES');
        expect(typeof result.error).toBe('string');
        expect(result.path).toBe(filePath);
        expect(result.encoding).toBe('utf8');

        // Проверяем что была только одна попытка чтения
        expect(mockReadFile).toHaveBeenCalledTimes(1);
        expect(mockResolve).not.toHaveBeenCalled();
    });

    it('должен успешно читать файл без фолбэка если файл существует', async () => {
        const fileContent = 'Success content';
        const filePath = '/existing/file.txt';

        mockReadFile.mockResolvedValue(fileContent);

        const result = await readFileContent({
            encoding: 'utf8',
            path: filePath,
        });

        expect(result.success).toBe(true);
        expect(result.content).toBe(fileContent);
        expect(typeof result.content).toBe('string');
        expect(result.path).toBe(filePath);
        expect(result.encoding).toBe('utf8');
        expect(result.size).toBe(fileContent.length);
        expect(typeof result.size).toBe('number');

        // Проверяем что фолбэк не применялся
        expect(mockReadFile).toHaveBeenCalledTimes(1);
        expect(mockReadFile).toHaveBeenCalledWith(filePath, 'utf8');
        expect(mockResolve).not.toHaveBeenCalled();
    });

    it('должен правильно обрабатывать относительные пути с фолбэком', async () => {
        const fileContent = 'Relative path content';
        const relativePath = './relative/file.txt';
        const fallbackPath = '/current/working/directory/relative/file.txt';

        const enoentError = new Error('ENOENT: no such file or directory') as NodeJS.ErrnoException;
        enoentError.code = 'ENOENT';

        mockReadFile.mockRejectedValueOnce(enoentError).mockResolvedValueOnce(fileContent);

        mockResolve.mockReturnValue(fallbackPath);

        const result = await readFileContent({
            path: relativePath,
        });

        expect(result.success).toBe(true);
        expect(result.content).toBe(fileContent);
        expect(result.path).toBe(fallbackPath);

        // Проверяем что resolve вызван правильно для фолбэка
        expect(mockResolve).toHaveBeenCalledWith('/current/working/directory', 'relative/file.txt');
    });
});
