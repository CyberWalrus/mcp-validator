// ✅ Правильное мокирование ES модулей согласно документации
import type { MockedFunction } from 'vitest';

import type { readFileContent } from '../../../../adapters/file-reader';
import type { ValidationParams } from '../../types';
import { getContentFromInput } from '../get-content-from-input';

vi.mock('../../../../adapters/file-reader', () => ({
    readFileContent: vi.fn(),
}));

// Получаем мок через vi.mocked
let mockReadFileContent: MockedFunction<typeof readFileContent>;

describe('getContentFromInput', () => {
    beforeEach(async () => {
        const fileReaderModule = await import('../../../../adapters/file-reader');

        mockReadFileContent = vi.mocked(fileReaderModule.readFileContent);
        mockReadFileContent.mockReset();
    });

    it('должен возвращать содержимое для типа content', async () => {
        const params: ValidationParams = {
            input: {
                data: 'test content',
                type: 'content',
            },
            validationType: 'code',
        };

        const result = await getContentFromInput(params);

        expect(result).toEqual({
            main: 'test content',
        });
    });

    it('должен читать файл для типа file', async () => {
        mockReadFileContent.mockResolvedValue({
            content: 'file content',
            encoding: 'utf8',
            path: 'test.ts',
            size: 12,
            success: true,
        });

        const params: ValidationParams = {
            input: {
                data: 'test.ts',
                encoding: 'utf8',
                type: 'file',
            },
            validationType: 'code',
        };

        const result = await getContentFromInput(params);

        expect(mockReadFileContent).toHaveBeenCalledWith({
            encoding: 'utf8',
            path: 'test.ts',
        });
        expect(result).toEqual({
            main: 'file content',
        });
    });

    it('должен обрабатывать дополнительные файлы', async () => {
        mockReadFileContent
            .mockResolvedValueOnce({
                content: 'main content',
                encoding: 'utf8',
                path: 'main.ts',
                size: 12,
                success: true,
            })
            .mockResolvedValueOnce({
                content: 'helper content',
                encoding: 'utf8',
                path: 'helper.ts',
                size: 14,
                success: true,
            });

        const params: ValidationParams = {
            additionalFiles: ['helper.ts'],
            input: {
                data: 'main.ts',
                type: 'file',
            },
            validationType: 'code',
        };

        const result = await getContentFromInput(params);

        expect(result).toEqual({
            additional: ['// helper.ts\nhelper content'],
            main: 'main content',
        });
    });

    it('должен выбрасывать ошибку для неудачного чтения файла', async () => {
        mockReadFileContent.mockResolvedValue({
            encoding: 'utf8',
            error: 'Ошибка чтения файла: ENOENT: no such file or directory',
            path: 'missing.ts',
            success: false,
        });

        const params: ValidationParams = {
            input: {
                data: 'missing.ts',
                type: 'file',
            },
            validationType: 'code',
        };

        await expect(getContentFromInput(params)).rejects.toThrow('Ошибка чтения файла: ENOENT');
    });

    it('должен выбрасывать ошибку для URL источников', async () => {
        const params: ValidationParams = {
            input: {
                data: 'https://example.com',
                type: 'url',
            },
            validationType: 'code',
        };

        await expect(getContentFromInput(params)).rejects.toThrow('URL источники пока не поддерживаются');
    });

    it('должен выбрасывать ошибку для неизвестного типа', async () => {
        const params = {
            input: {
                data: 'test',
                type: 'unknown' as unknown as 'content',
            },
            validationType: 'code',
        } as ValidationParams;

        await expect(getContentFromInput(params)).rejects.toThrow('Неизвестный тип источника: unknown');
    });
});
