import type { Tool } from '@modelcontextprotocol/sdk/types.js';

/** MCP инструмент для проверки информации через AI с 3 параллельными проверками */
export const verifyInfoTool: Tool = {
    description:
        'Проверка информации через AI с 3 параллельными проверками. Поддерживает текст и файлы. Возвращает комбинированный отчет с оценкой достоверности',
    inputSchema: {
        properties: {
            context: {
                description: 'Дополнительный контекст для проверки (опционально)',
                type: 'string',
            },
            encoding: {
                default: 'utf8',
                description: 'Кодировка файла (опционально, применяется только для файлов)',
                enum: ['utf8', 'utf16le', 'ascii'],
                type: 'string',
            },
            input: {
                description: 'Источник данных для проверки: текст или файл',
                properties: {
                    data: {
                        description: 'Текст для проверки или абсолютный путь к файлу',
                        type: 'string',
                    },
                    type: {
                        description: 'Тип входных данных: content (текст) или file (файл)',
                        enum: ['content', 'file'],
                        type: 'string',
                    },
                },
                required: ['type', 'data'],
                type: 'object',
            },
        },
        required: ['input'],
        type: 'object',
    },
    name: 'verify-info',
};
