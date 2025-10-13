import { z } from 'zod';

/** Схема валидации уровня логирования */
export const logLevelSchema = z.enum(['DEBUG', 'INFO', 'WARN', 'ERROR']);

/** Схема валидации конфигурации AI модели */
export const modelConfigSchema = z.object({
    maxTokens: z.coerce.number().positive('AI_MAX_TOKENS must be a positive number').default(100000),
    name: z.string().default('openai/gpt-oss-120b'),
    temperature: z.coerce.number().min(0).max(2).default(0.5),
});

/** Схема валидации конфигурации API провайдера */
export const apiConfigSchema = z.object({
    key: z.string({ message: 'API_KEY is required' }).min(1, 'API_KEY is required'),
    mockClientPath: z.string().default('end-to-end/mocks/openrouter-test-client'),
    provider: z.literal('openrouter'),
    url: z.string().url('API_URL must be a valid URL').default('https://openrouter.ai/api/v1'),
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
    nodePath: z.string().default(''),
});

/** Схема валидации конфигурации таймаутов */
export const timeoutsConfigSchema = z.object({
    apiRequest: z.coerce.number().positive('TIMEOUT_API_REQUEST must be a positive number').default(30000),
    validation: z.coerce.number().positive('TIMEOUT_VALIDATION must be a positive number').default(30000),
});

/** Схема валидации полной конфигурации приложения */
export const appConfigSchema = z.object({
    api: apiConfigSchema,
    logging: loggingConfigSchema,
    model: modelConfigSchema,
    paths: pathsConfigSchema,
    runtime: runtimeConfigSchema,
    timeouts: timeoutsConfigSchema,
});
