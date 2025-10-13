import { z } from 'zod';

/** Схема валидации уровня логирования */
export const logLevelSchema = z.enum(['DEBUG', 'INFO', 'WARN', 'ERROR']);

/** Схема валидации конфигурации AI модели */
export const modelConfigSchema = z.object({
    maxTokens: z.coerce.number().positive('AI_MAX_TOKENS must be a positive number').default(100000),
    name: z.string().default('openai/gpt-oss-20b:free'),
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

/** Схема валидации лимитов валидации */
export const validationLimitsSchema = z.object({
    contextMaxLength: z.number().positive('Context max length must be positive').default(5000),
    timeoutMax: z.number().positive('Timeout maximum must be positive').default(120000),
    timeoutMin: z.number().positive('Timeout minimum must be positive').default(1000),
});

/** Схема валидации порогов консистентности */
export const consistencyThresholdsSchema = z.object({
    anomalyLengthMultiplier: z.number().positive().default(0.5),
    anomalyLongMultiplier: z.number().positive().default(2.0),
    anomalySlowMultiplier: z.number().positive().default(1.5),
    timeLow: z.number().min(0).max(1).default(0.3),
    varianceHigh: z.number().min(0).max(1).default(0.7),
    varianceLow: z.number().min(0).max(1).default(0.2),
    varianceMedium: z.number().min(0).max(1).default(0.5),
});

/** Схема валидации конфигурации MCP сервера */
export const mcpConfigSchema = z.object({
    description: z.string().default('Production-ready MCP validator for Cursor IDE with 4 validation types'),
    name: z.string().default('mcp-validator'),
    protocolVersion: z.string().default('2024-11-05'),
    version: z.string().default('0.3.0'),
});

/** Схема валидации полной конфигурации приложения */
export const appConfigSchema = z.object({
    api: apiConfigSchema,
    logging: loggingConfigSchema,
    mcp: mcpConfigSchema,
    model: modelConfigSchema,
    paths: pathsConfigSchema,
    runtime: runtimeConfigSchema,
    testing: z
        .object({
            consistencyThresholds: consistencyThresholdsSchema,
        })
        .optional(),
    timeouts: timeoutsConfigSchema,
    validation: z.object({ limits: validationLimitsSchema }).optional(),
});
