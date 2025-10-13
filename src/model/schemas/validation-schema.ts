import { z } from 'zod';

/** Схема валидации входных данных для валидации */
export const validationInputSchema = z.object({
    data: z.string(),
    encoding: z.enum(['utf8', 'utf16le', 'ascii']).optional(),
    type: z.enum(['content', 'file']),
});

/** Схема валидации результата валидации */
export const validationResultSchema = z.object({
    issues: z.array(z.string()),
    metadata: z
        .object({
            duration: z.number(),
            fullResponse: z.string().optional(),
            model: z.string(),
            tokensUsed: z.number().optional(),
        })
        .optional(),
    recommendations: z.string().optional(),
    score: z.number().min(0).max(100),
    success: z.boolean(),
    type: z.string(),
});
