import { z } from 'zod';

import { VALIDATION_TYPES } from './constants';

/** Схема для источника входных данных */
export const InputSourceSchema = z.object({
    data: z.string().min(1, 'Данные не могут быть пустыми. Используйте поле "data", а не "path"'),
    encoding: z
        .enum(['utf8', 'utf16le', 'ascii'], {
            message: 'Кодировка должна быть: utf8, utf16le или ascii',
        })
        .optional()
        .default('utf8'),
    type: z.enum(['content', 'file', 'url'], {
        message: 'Тип должен быть: content, file или url',
    }),
});

/** Схема для параметров валидации */
export const ValidationParamsSchema = z.object({
    additionalFiles: z.array(z.string()).default([]),
    context: z.string().default(''),
    customPrompt: z.string().default(''),
    input: InputSourceSchema,
    language: z.string().default(''),
    validationType: z.enum(['code', 'tests', 'architecture', 'documentation', 'prompts', 'custom'], {
        message: `Поддерживаемые типы: ${VALIDATION_TYPES.join(', ')}`,
    }),
});

/** Схема для результата валидации */
export const ValidationResultSchema = z.object({
    issues: z.array(z.string()),
    metadata: z.record(z.string(), z.unknown()).optional(),
    success: z.boolean(),
});

/** Схема для ответа валидации */
export const ValidationResponseSchema = ValidationResultSchema.extend({
    duration: z.number().nonnegative(),
    promptUsed: z.string(),
    tokensUsed: z.number().nonnegative().optional(),
});
