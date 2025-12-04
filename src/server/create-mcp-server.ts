import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { APP_CONFIG } from '../model/config';
import { handleTestPromptTool } from '../tools/test-prompt-tool';
import { createValidateInteractiveHandler } from '../tools/validate-interactive-tool';
import { handleValidateTool } from '../tools/validate-tool';
import { handleVerifyInfoTool } from '../tools/verify-info-tool';
import { registerValidatorPrompts } from './prompts';
import { registerValidatorResources } from './resources';
import type { ToolResponse } from './types';

/** Обработчик инструмента validate */
async function executeValidateTool(params: unknown): Promise<ToolResponse> {
    const result = await handleValidateTool(params);

    return {
        content: [{ text: result.content, type: 'text' as const }],
        isError: result.isError ?? false,
    };
}

/** Обработчик инструмента test-prompt */
async function executeTestPromptTool(params: unknown): Promise<ToolResponse> {
    const result = await handleTestPromptTool(params);

    return {
        content: [{ text: result.content, type: 'text' as const }],
        isError: result.isError ?? false,
    };
}

/** Обработчик инструмента verify-info */
async function executeVerifyInfoTool(params: unknown): Promise<ToolResponse> {
    const result = await handleVerifyInfoTool(params);

    return {
        content: [{ text: result.content, type: 'text' as const }],
        isError: result.isError ?? false,
    };
}

/** Создание и инициализация MCP сервера с высокоуровневым API McpServer */
export function createMcpServer(): McpServer {
    const config = APP_CONFIG;

    const server = new McpServer({
        name: config.mcp.name,
        version: config.mcp.version,
    });

    server.registerTool(
        'validate',
        {
            description:
                'Универсальная валидация кода, тестов, архитектуры и других типов контента через AI с детальными отчетами',
            inputSchema: z.object({
                context: z.string().describe('Дополнительный контекст для валидации (опционально)').optional(),
                input: z.object({
                    data: z.string().describe('Данные для валидации или абсолютный путь к файлу'),
                    encoding: z
                        .enum(['utf8', 'utf16le', 'ascii'])
                        .describe('Кодировка файла (опционально)')
                        .default('utf8'),
                    type: z
                        .enum(['content', 'file', 'url'])
                        .describe('Тип входных данных: content (текст), file (файл), url (ссылка)'),
                }),
                language: z.string().describe('Язык программирования (опционально)').default('typescript'),
                validationType: z
                    .enum(['code', 'tests', 'architecture', 'prompts', 'documentation'])
                    .describe(
                        'Тип валидации: code (качество кода/стиль), tests (покрытие/моки), architecture (структура/паттерны), prompts (YAML/XML), documentation (шаблоны/формат)',
                    ),
            }),
            title: 'Валидация кода',
        },
        executeValidateTool,
    );

    server.registerTool(
        'test-prompt',
        {
            description:
                'Параллельное тестирование промптов на консистентность с 3-10 итерациями для проверки стабильности AI ответов',
            inputSchema: z.object({
                context: z.string().describe('Дополнительный контекст для тестирования (опционально)').optional(),
                iterations: z
                    .number()
                    .min(3)
                    .max(10)
                    .describe('Количество параллельных итераций (по умолчанию 5)')
                    .default(5),
                models: z
                    .array(z.string())
                    .describe('Список моделей для тестирования (опционально, по умолчанию из config)')
                    .optional(),
                prompt: z.string().describe('Промпт для тестирования'),
                timeout: z
                    .number()
                    .min(1000)
                    .describe('Timeout для каждого запроса в миллисекундах (по умолчанию из config)')
                    .optional(),
            }),
            title: 'Тестирование промптов',
        },
        executeTestPromptTool,
    );

    server.registerTool(
        'verify-info',
        {
            description:
                'Проверка информации через AI с 3 параллельными проверками. Поддерживает текст и файлы. Возвращает комбинированный отчет с оценкой достоверности',
            inputSchema: z.object({
                context: z.string().describe('Дополнительный контекст для проверки (опционально)').optional(),
                encoding: z
                    .enum(['utf8', 'utf16le', 'ascii'])
                    .describe('Кодировка файла (опционально, применяется только для файлов)')
                    .default('utf8'),
                input: z.object({
                    data: z.string().describe('Текст для проверки или абсолютный путь к файлу'),
                    type: z.enum(['content', 'file']).describe('Тип входных данных: content (текст) или file (файл)'),
                }),
            }),
            title: 'Проверка информации',
        },
        executeVerifyInfoTool,
    );

    const executeValidateInteractiveTool = createValidateInteractiveHandler(server);

    server.registerTool(
        'validate-interactive',
        {
            description:
                'Интерактивная валидация с уточнением параметров через диалог. Если тип валидации не указан — будет запрошен у пользователя',
            inputSchema: z.object({
                context: z.string().describe('Дополнительный контекст для валидации (опционально)').optional(),
                filePath: z.string().describe('Путь к файлу для валидации'),
                language: z.string().describe('Язык программирования (опционально)').default('typescript'),
                validationType: z
                    .enum(['code', 'tests', 'architecture', 'prompts', 'documentation'])
                    .describe('Тип валидации (если не указан — будет запрошен)')
                    .optional(),
            }),
            title: 'Интерактивная валидация',
        },
        async (params) => {
            const result = await executeValidateInteractiveTool(params);

            return {
                content: [{ text: result.content, type: 'text' as const }],
                isError: result.isError ?? false,
            };
        },
    );

    registerValidatorPrompts(server);
    registerValidatorResources(server);

    return server;
}
