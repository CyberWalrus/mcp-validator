/** Конфигурация для форматирования ошибок */
export type ErrorFormatterConfig = {
    /** Локализованные сообщения */
    messages: {
        invalidEnum: string;
        requiredField: string;
        suggestion: string;
        unrecognizedKey: string;
    };
    /** Мапа подсказок для частых ошибок */
    suggestionMap: Record<string, string>;
};
