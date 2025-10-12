import type { ZodError } from 'zod';

import type { ErrorFormatterConfig } from './types';

/** Конфигурация по умолчанию для форматирования ошибок */
const DEFAULT_CONFIG: ErrorFormatterConfig = {
    messages: {
        invalidEnum: 'Неправильное значение для поля "{field}"',
        requiredField: 'Обязательное поле "{field}" отсутствует в {path}',
        suggestion: 'Возможно вы имели в виду поле "{suggestion}"?',
        unrecognizedKey: 'Неизвестное поле "{key}" в объекте {path}',
    },
    suggestionMap: {
        content: 'data',
        file: 'data',
        path: 'data',
        url: 'data',
    },
};

/** Форматирует ошибки Zod схемы в понятные сообщения на русском языке */
export function formatSchemaError(error: ZodError, config = DEFAULT_CONFIG): string {
    const messages = error.issues.map((issue) => {
        const pathString = issue.path.length > 0 ? issue.path.join('.') : 'объект';

        if (issue.code === 'unrecognized_keys' && 'keys' in issue && Array.isArray(issue.keys)) {
            const key = String(issue.keys[0]);
            const suggestion = config.suggestionMap[key];
            let message = config.messages.unrecognizedKey.replace('{key}', key).replace('{path}', pathString);

            if (suggestion) {
                message += `\n${config.messages.suggestion.replace('{suggestion}', suggestion)}`;
            }

            return message;
        }

        if (issue.code === 'invalid_type' && 'received' in issue && issue.received === 'undefined') {
            const field = issue.path[issue.path.length - 1];
            let message = config.messages.requiredField.replace('{field}', String(field)).replace('{path}', pathString);

            if ('expected' in issue && issue.expected) {
                message += `\nОжидается: ${String(issue.expected)}`;
            }

            return message;
        }

        if (issue.code === 'invalid_value' && 'values' in issue && Array.isArray(issue.values)) {
            const field = (issue.path as unknown[])[(issue.path as unknown[]).length - 1] as string;
            let message = config.messages.invalidEnum.replace('{field}', String(field));
            message += `\nДопустимые значения: ${(issue.values as unknown[]).map(String).join(', ')}`;

            return message;
        }

        return issue.message;
    });

    return messages.join('\n\n');
}
