/** Форматирует результат валидации для отображения */
export function formatValidationResult(result: unknown): string {
    if (typeof result === 'string') {
        return result;
    }

    if (typeof result === 'object' && result !== null) {
        try {
            return JSON.stringify(result, null, 2);
        } catch {
            // eslint-disable-next-line @typescript-eslint/no-base-to-string
            return String(result);
        }
    }

    return String(result);
}
