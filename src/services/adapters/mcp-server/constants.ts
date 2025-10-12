import type { MCPToolDefinition } from './types';

/** Версия протокола MCP */
export const MCP_PROTOCOL_VERSION = '2024-11-05';

/** Информация о сервере */
export const MCP_SERVER_INFO = {
    name: 'mcp-validator',
    version: process.env['MCP_SERVER_VERSION'] || '2.0.0',
} as const;

/** JSON-RPC коды ошибок */
export const JSON_RPC_ERROR_CODES = {
    INTERNAL_ERROR: -32603,
    INVALID_PARAMS: -32602,
    INVALID_REQUEST: -32600,
    METHOD_NOT_FOUND: -32601,
    PARSE_ERROR: -32700,
} as const;

/** Определения доступных MCP инструментов */
export const MCP_TOOLS: Record<string, MCPToolDefinition> = {
    'test-prompt': {
        description: 'Параллельное тестирование промптов на консистентность',
        inputSchema: {
            properties: {
                context: {
                    description: 'Дополнительный контекст промпта (опционально)',
                    type: 'string',
                },
                iterations: {
                    description: 'Количество параллельных итераций (по умолчанию 5)',
                    maximum: 10,
                    minimum: 3,
                    type: 'number',
                },
                models: {
                    description: 'Список моделей для тестирования (опционально)',
                    items: { type: 'string' },
                    type: 'array',
                },
                prompt: {
                    description: 'Промпт для тестирования',
                    type: 'string',
                },
                timeout: {
                    description: 'Timeout для каждого запроса в миллисекундах',
                    minimum: 1000,
                    type: 'number',
                },
            },
            required: ['prompt'],
            type: 'object',
        },
    },
    validate: {
        description: 'Валидация кода с различными типами проверок',
        inputSchema: {
            properties: {
                additionalFiles: {
                    description: 'Дополнительные файлы для контекста (опционально)',
                    items: { type: 'string' },
                    type: 'array',
                },
                context: {
                    description: 'Дополнительный контекст для валидации (опционально)',
                    type: 'string',
                },
                customPrompt: {
                    description: 'Кастомный промпт (только для validationType=custom)',
                    type: 'string',
                },
                input: {
                    properties: {
                        data: {
                            description: 'Данные для валидации или путь к файлу',
                            type: 'string',
                        },
                        encoding: {
                            description: 'Кодировка файла (опционально)',
                            enum: ['utf8', 'utf16le', 'ascii'],
                            type: 'string',
                        },
                        type: {
                            description: 'Источник входных данных',
                            enum: ['content', 'file', 'url'],
                            type: 'string',
                        },
                    },
                    required: ['type', 'data'],
                    type: 'object',
                },
                language: {
                    description: 'Язык программирования (опционально)',
                    type: 'string',
                },
                validationType: {
                    description: 'Тип валидации для выполнения',
                    enum: [
                        'code',
                        'tests',
                        'architecture',
                        'security',
                        'performance',
                        'documentation',
                        'prompts',
                        'tasks',
                        'custom',
                    ],
                    type: 'string',
                },
            },
            required: ['validationType', 'input'],
            type: 'object',
        },
    },
} as const;

/** Timeout для MCP операций в миллисекундах */
export const MCP_OPERATION_TIMEOUT = 60000;
