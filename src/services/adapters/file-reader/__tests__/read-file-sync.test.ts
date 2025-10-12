import type { Stats } from 'node:fs';
import { readFileSync as readFileSyncFS, statSync as statSyncFS } from 'node:fs';

import { readFileSync } from '../read-file-sync';

vi.mock('node:fs', () => ({
    readFileSync: vi.fn(),
    statSync: vi.fn(),
}));

const mockReadFileSync = vi.mocked(readFileSyncFS);
const mockStatSync = vi.mocked(statSyncFS);

describe('readFileSync', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('должен синхронно читать файл', () => {
        const fileContent = 'Test file content';
        const fileSize = 1000;

        mockStatSync.mockReturnValue({ size: fileSize } as unknown as Stats);
        mockReadFileSync.mockReturnValue(fileContent);

        const result = readFileSync({
            encoding: 'utf8',
            path: 'test.txt',
        });

        expect(result).toHaveProperty('content', fileContent);
        expect(result).toHaveProperty('encoding', 'utf8');
        expect(result).toHaveProperty('size', fileSize);
        expect(typeof result.size).toBe('number');
    });

    it('должен проверять размер файла на превышение лимита', () => {
        const largeSize = 50 * 1024 * 1024; // 50MB - больше чем MAX_FILE_SIZE
        mockStatSync.mockReturnValue({ size: largeSize } as unknown as Stats);

        expect(() => {
            readFileSync({
                encoding: 'utf8',
                path: 'large-file.txt',
            });
        }).toThrow('Файл слишком большой');
    });

    it('должен использовать кодировку по умолчанию utf8', () => {
        const fileContent = 'Default encoding content';
        const fileSize = 500;

        mockStatSync.mockReturnValue({ size: fileSize } as unknown as Stats);
        mockReadFileSync.mockReturnValue(fileContent);

        const result = readFileSync({
            path: 'test.txt',
        });

        expect(result.encoding).toBe('utf8');
        expect(mockReadFileSync).toHaveBeenCalledWith(expect.any(String), 'utf8');
    });

    it('должен выбрасывать ошибку для несуществующего файла', () => {
        const error = new Error('ENOENT: no such file or directory');
        mockStatSync.mockImplementation(() => {
            throw error;
        });

        expect(() => {
            readFileSync({
                path: 'nonexistent-file.txt',
            });
        }).toThrow('Ошибка чтения файла');
    });
});
