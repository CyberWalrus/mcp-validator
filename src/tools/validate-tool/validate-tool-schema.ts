import type { Tool } from '@modelcontextprotocol/sdk/types.js';

/** MCP инструмент для универсальной валидации через AI */
export const validateTool: Tool = {
    description:
        'Универсальная валидация кода, тестов, архитектуры и других типов контента через AI с детальными отчетами',
    inputSchema: {
        properties: {
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
                        default: 'utf8',
                        description: 'Кодировка файла (опционально)',
                        enum: ['utf8', 'utf16le', 'ascii'],
                        type: 'string',
                    },
                    type: {
                        description: 'Тип входных данных',
                        enum: ['content', 'file', 'url'],
                        type: 'string',
                    },
                },
                required: ['type', 'data'],
                type: 'object',
            },
            language: {
                default: 'typescript',
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
    name: 'validate',
};
