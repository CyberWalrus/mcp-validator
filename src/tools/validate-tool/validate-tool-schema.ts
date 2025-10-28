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
            input: {
                description: 'Источник данных для валидации: файл, содержимое или URL',
                properties: {
                    data: {
                        description: 'Данные для валидации или абсолютный путь к файлу',
                        type: 'string',
                    },
                    encoding: {
                        default: 'utf8',
                        description: 'Кодировка файла (опционально)',
                        enum: ['utf8', 'utf16le', 'ascii'],
                        type: 'string',
                    },
                    type: {
                        description: 'Тип входных данных: content (текст), file (файл), url (ссылка)',
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
                description:
                    'Тип валидации: code (качество кода/стиль), tests (покрытие/моки), architecture (структура/паттерны), prompts (YAML/XML), documentation (шаблоны/формат)',
                enum: ['code', 'tests', 'architecture', 'prompts', 'documentation'],
                type: 'string',
            },
        },
        required: ['validationType', 'input'],
        type: 'object',
    },
    name: 'validate',
};
