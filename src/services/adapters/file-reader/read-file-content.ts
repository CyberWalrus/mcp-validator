import { isAbsolute, resolve } from 'node:path';

import { tryReadFile } from './helpers/file-operations';
import type { ReadFileContentParams, ReadFileContentResult } from './types';

/** Асинхронное чтение файла с обработкой ошибок и фолбэком */
export async function readFileContent({
    path,
    encoding = 'utf8',
}: ReadFileContentParams): Promise<ReadFileContentResult> {
    const { content, error: firstError } = await tryReadFile(path, encoding);

    if (content !== null) {
        return {
            content,
            encoding,
            path,
            size: content.length,
            success: true,
        };
    }

    const isEnoentError = firstError instanceof Error && 'code' in firstError && firstError.code === 'ENOENT';
    if (!isEnoentError) {
        const errorMessage = firstError instanceof Error ? firstError.message : String(firstError);

        return {
            encoding,
            error: `Ошибка чтения файла: ${errorMessage}`,
            path,
            success: false,
        };
    }

    const strippedPath = isAbsolute(path) ? path : path.replace(/^([/\\]+|\.\/|\.\\)/, '');
    const fallbackPath = resolve(process.cwd(), strippedPath);

    const { content: fallbackContent } = await tryReadFile(fallbackPath, encoding);

    if (fallbackContent !== null) {
        return {
            content: fallbackContent,
            encoding,
            path: fallbackPath,
            size: fallbackContent.length,
            success: true,
        };
    }

    return {
        encoding,
        error: `Ошибка чтения файла: не найден ни по пути ${path}, ни по пути ${fallbackPath}. ENOENT: no such file or directory`,
        path,
        success: false,
    };
}
