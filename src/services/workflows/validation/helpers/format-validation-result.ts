/** Форматирует результат валидации для отображения */
export function formatValidationResult(result: unknown): string {
    if (typeof result === 'string') {
        return result;
    }

    if (typeof result === 'object' && result !== null) {
        try {
            return JSON.stringify(result, null, 2);
        } catch {
            return `[Object: ${result.constructor?.name || 'Unknown'}]`;
        }
    }

    return String(result);
}
