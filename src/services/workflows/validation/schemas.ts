import { z } from 'zod';

import { VALIDATION_TYPES } from './constants';

/** Схема для источника входных данных */
export const InputSourceSchema = z.object({
    /** Данные или путь */
    data: z.string().min(1, 'Данные не могут быть пустыми. Используйте поле "data", а не "path"'),

    /** Кодировка для файлов */
    encoding: z
        .enum(['utf8', 'utf16le', 'ascii'], {
            message: 'Кодировка должна быть: utf8, utf16le или ascii',
        })
        .optional()
        .default('utf8'),

    /** Тип источника */
    type: z.enum(['content', 'file', 'url'], {
        message: 'Тип должен быть: content, file или url',
    }),
});

/** Схема для параметров валидации */
export const ValidationParamsSchema = z.object({
    /** Дополнительные файлы для контекста */
    additionalFiles: z.array(z.string()).default([]),

    /** Дополнительный контекст */
    context: z.string().default(''),

    /** Кастомный промпт */
    customPrompt: z.string().default(''),

    /** Источник входных данных */
    input: InputSourceSchema,

    /** Язык программирования */
    language: z.string().default(''),

    /** Тип валидации */
    validationType: z.enum(['code', 'tests', 'architecture', 'documentation', 'prompts', 'custom'], {
        message: `Поддерживаемые типы: ${VALIDATION_TYPES.join(', ')}`,
    }),
});

/** Схема для результата валидации */
export const ValidationResultSchema = z.object({
    /** Список проблем */
    issues: z.array(z.string()),

    /** Дополнительные данные результата */
    metadata: z.record(z.string(), z.unknown()).optional(),

    /** Успешно ли прошла валидация */
    success: z.boolean(),
});

/** Схема для ответа валидации */
export const ValidationResponseSchema = ValidationResultSchema.extend({
    /** Время выполнения валидации в миллисекундах */
    duration: z.number().nonnegative(),
    /** Использованный промпт */
    promptUsed: z.string(),
    /** Токены использованные в запросе */
    tokensUsed: z.number().nonnegative().optional(),
});
