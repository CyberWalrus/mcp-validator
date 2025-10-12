/** Удаление ведущих разделителей из пути для фолбэка */
export function stripLeadingSeparator(path: string): string {
    return path.replace(/^([/\\]+|\.\/|\.\\)/, '');
}
