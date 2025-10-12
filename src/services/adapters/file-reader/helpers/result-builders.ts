import type { ReadFileContentResult } from '../types';

/** Создание успешного результата */
export function createSuccessResult(content: string, encoding: string, path: string): ReadFileContentResult {
    return {
        content,
        encoding,
        path,
        size: content.length,
        success: true,
    };
}

/** Создание результата с ошибкой */
export function createErrorResult(error: string, encoding: string, path: string): ReadFileContentResult {
    return {
        encoding,
        error,
        path,
        success: false,
    };
}
