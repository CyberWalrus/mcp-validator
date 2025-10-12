/** Проверка является ли ошибка ENOENT */
export function isEnoentError(error: unknown): boolean {
    return error instanceof Error && 'code' in error && error.code === 'ENOENT';
}
