import { z } from 'zod';

/** Схема валидации типов валидации */
export const validationTypeSchema = z.enum(['architecture', 'code', 'custom', 'documentation', 'prompts', 'tests']);

/** Схема валидации источника входных данных */
export const inputSourceSchema = z.object({
    data: z.string().min(1, 'Данные не могут быть пустыми'),
    encoding: z.enum(['utf8', 'utf16le', 'ascii']).default('utf8'),
    type: z.enum(['content', 'file', 'url'], {
        message: 'Тип должен быть: content, file или url',
    }),
});

/** Схема валидации входных данных для валидации */
export const validationInputSchema = z.object({
    context: z.string().optional(),
    input: inputSourceSchema,
    language: z.string().optional(),
    validationType: validationTypeSchema,
});

/** Схема валидации результата валидации */
export const validationResultSchema = z.object({
    issues: z.array(z.string()),
    metadata: z.record(z.string(), z.unknown()).optional(),
    recommendations: z.string().optional(),
    score: z.number().min(0).max(100).optional(),
    success: z.boolean(),
    type: validationTypeSchema,
});
