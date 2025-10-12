import type { ValidationParams } from '../types';

/** Валидирует параметры валидации */
// eslint-disable-next-line sonarjs/cognitive-complexity
export function validateParams(params: ValidationParams): void {
    if (!params.input) {
        throw new Error('Входные данные обязательны');
    }

    if (!params.input.type) {
        throw new Error('Тип входных данных обязателен');
    }

    if (!params.input.data || params.input.data.trim().length === 0) {
        throw new Error('Данные для валидации не могут быть пустыми');
    }

    if (!params.validationType) {
        throw new Error('Тип валидации обязателен');
    }

    const validTypes = [
        'code',
        'tests',
        'architecture',
        'security',
        'performance',
        'documentation',
        'prompts',
        'tasks',
        'custom',
    ];

    if (!validTypes.includes(params.validationType)) {
        throw new Error(
            `Неизвестный тип валидации: ${params.validationType}. Доступные типы: ${validTypes.join(', ')}`,
        );
    }

    const validInputTypes = ['content', 'file', 'url'];
    if (!validInputTypes.includes(params.input.type)) {
        throw new Error(
            `Неизвестный тип источника: ${params.input.type}. Доступные типы: ${validInputTypes.join(', ')}`,
        );
    }

    if (params.input.encoding) {
        const validEncodings = ['utf8', 'utf16le', 'ascii'];
        if (!validEncodings.includes(params.input.encoding)) {
            throw new Error(`Неизвестная кодировка: ${params.input.encoding}. Доступные: ${validEncodings.join(', ')}`);
        }
    }

    if (params.additionalFiles) {
        if (!Array.isArray(params.additionalFiles)) {
            throw new Error('additionalFiles должен быть массивом строк');
        }

        if (params.additionalFiles.length > 10) {
            throw new Error('Максимальное количество дополнительных файлов: 10');
        }

        for (const file of params.additionalFiles) {
            if (typeof file !== 'string' || file.trim().length === 0) {
                throw new Error('Все пути к дополнительным файлам должны быть непустыми строками');
            }
        }
    }

    if (params.context && params.context.length > 10000) {
        throw new Error('Максимальная длина контекста: 10000 символов');
    }

    if (params.customPrompt && params.customPrompt.length > 20000) {
        throw new Error('Максимальная длина кастомного промпта: 20000 символов');
    }
}
