import { readFileSync as readFileSyncFS, statSync as statSyncFS } from 'node:fs';
import { resolve } from 'node:path';

import type { FileInput, FileResult } from './types';

// Максимальный размер файла для чтения (1MB)
const MAX_FILE_SIZE = 1024 * 1024;

/** Безопасное чтение файлов с валидацией (синхронная версия) */
export function readFileSync(input: FileInput): FileResult {
    const { path, encoding = 'utf8' } = input;

    const normalizedPath = resolve(path);

    try {
        const stats = statSyncFS(normalizedPath);
        if (stats.size > MAX_FILE_SIZE) {
            throw new Error(`Файл слишком большой: ${stats.size} байт (максимум ${MAX_FILE_SIZE})`);
        }

        const content = readFileSyncFS(normalizedPath, encoding);

        return {
            content,
            encoding,
            size: stats.size,
        };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Ошибка чтения файла ${path}: ${error.message}`);
        }
        throw new Error(`Неизвестная ошибка при чтении файла ${path}`);
    }
}
