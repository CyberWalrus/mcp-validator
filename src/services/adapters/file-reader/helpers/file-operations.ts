import { readFile as readFileAsync } from 'node:fs/promises';

/** Читает файл и возвращает содержимое или ошибку */
export async function tryReadFile(
    filePath: string,
    encoding: 'ascii' | 'utf8' | 'utf16le',
): Promise<{ content: string | null; error: unknown }> {
    try {
        const content = await readFileAsync(filePath, encoding);

        return { content, error: null };
    } catch (error) {
        return { content: null, error };
    }
}
