import { z } from 'zod';

/** Схема валидации уровня логирования */
export const logLevelSchema = z.enum(['DEBUG', 'INFO', 'WARN', 'ERROR']);

/** Схема валидации настроек AI моделей */
export const aiConfigSchema = z.object({
    defaultModel: z.string().default('openai/gpt-oss-120b'),
    maxTokens: z.coerce.number().positive('AI_MAX_TOKENS must be a positive number').default(100000),
    temperature: z.coerce.number().min(0).max(2, 'AI_TEMPERATURE must be between 0 and 2').default(0.5),
});

/** Схема валидации настроек валидации */
export const validationConfigSchema = z.object({
    timeout: z.coerce.number().positive('VALIDATION_TIMEOUT must be a positive number').default(30000),
});

/** Схема валидации конфигурации OpenRouter */
export const openRouterConfigSchema = z.object({
    apiKey: z.string({ message: 'OPENROUTER_API_KEY is required' }).min(1, 'OPENROUTER_API_KEY is required'),
    apiUrl: z.string().url('OPENROUTER_API_URL must be a valid URL').default('https://openrouter.ai/api/v1'),
    timeout: z.coerce.number().positive('OPENROUTER_TIMEOUT must be a positive number').default(30000),
});

/** Схема валидации конфигурации логирования */
export const loggingConfigSchema = z.object({
    level: logLevelSchema.default('INFO'),
});

/** Схема валидации путей к ресурсам */
export const pathsConfigSchema = z.object({
    errors: z.string().min(1, 'Errors path is required'),
    prompts: z.string().min(1, 'Prompts path is required'),
});

/** Схема валидации настроек среды выполнения */
export const runtimeConfigSchema = z.object({
    environment: z.string().default('development'),
    isE2ETest: z.boolean().default(false),
    isTestMode: z.boolean().default(false),
    nodePath: z.string().default(''),
});

/** Схема валидации полной конфигурации приложения */
export const appConfigSchema = z.object({
    ai: aiConfigSchema,
    logging: loggingConfigSchema,
    openRouter: openRouterConfigSchema,
    paths: pathsConfigSchema,
    runtime: runtimeConfigSchema,
    validation: validationConfigSchema,
});
