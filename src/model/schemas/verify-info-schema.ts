import { z } from 'zod';

import { inputSourceSchema } from './validation-schema';

/** Схема источника входных данных для проверки информации (только content и file) */
const verifyInfoInputSourceSchema = inputSourceSchema.refine(
    (data) => data.type === 'content' || data.type === 'file',
    {
        message: 'Тип должен быть content или file',
    },
);

/** Схема входных данных для проверки информации */
export const verifyInfoInputSchema = z.object({
    context: z.string().optional(),
    encoding: z.enum(['utf8', 'utf16le', 'ascii']).optional(),
    input: verifyInfoInputSourceSchema,
});

/** Схема результата одной проверки */
export const verificationCheckResultSchema = z.object({
    checkType: z.enum(['check1', 'check2', 'check3']),
    content: z.string(),
    duration: z.number(),
    error: z.string().optional(),
    isSuccess: z.boolean(),
    tokensUsed: z.number(),
});

/** Схема результата проверки информации */
export const verifyInfoResultSchema = z.object({
    checks: z.array(verificationCheckResultSchema),
    combinedReport: z.string(),
    error: z.string().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
    overallScore: z.number().min(0).max(100).optional(),
    success: z.boolean(),
    totalDuration: z.number(),
    totalTokensUsed: z.number(),
});
