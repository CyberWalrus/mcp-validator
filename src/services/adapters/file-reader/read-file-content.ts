import { resolve } from 'node:path';

import { isEnoentError } from './helpers/error-handling';
import { tryReadFile } from './helpers/file-operations';
import { stripLeadingSeparator } from './helpers/path-utils';
import { createErrorResult, createSuccessResult } from './helpers/result-builders';
import type { ReadFileContentParams, ReadFileContentResult } from './types';

/** Асинхронное чтение файла с обработкой ошибок и фолбэком */
export async function readFileContent({
    path,
    encoding = 'utf8',
}: ReadFileContentParams): Promise<ReadFileContentResult> {
    const { content, error: firstError } = await tryReadFile(path, encoding);

    if (content !== null) {
        return createSuccessResult(content, encoding, path);
    }

    if (!isEnoentError(firstError)) {
        const errorMessage = firstError instanceof Error ? firstError.message : String(firstError);

        return createErrorResult(`Ошибка чтения файла: ${errorMessage}`, encoding, path);
    }

    const strippedPath = stripLeadingSeparator(path);
    const fallbackPath = resolve(process.cwd(), strippedPath);

    const { content: fallbackContent } = await tryReadFile(fallbackPath, encoding);

    if (fallbackContent !== null) {
        return createSuccessResult(fallbackContent, encoding, fallbackPath);
    }

    return createErrorResult(
        `Ошибка чтения файла: не найден ни по пути ${path}, ни по пути ${fallbackPath}. ENOENT: no such file or directory`,
        encoding,
        path,
    );
}
