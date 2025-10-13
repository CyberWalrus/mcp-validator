import type { Tool } from '@modelcontextprotocol/sdk/types.js';

/** MCP инструмент для параллельного тестирования промптов */
export const TEST_PROMPT_TOOL: Tool = {
    description:
        'Параллельное тестирование промптов на консистентность с 3-10 итерациями для проверки стабильности AI ответов',
    inputSchema: {
        properties: {
            context: {
                description: 'Дополнительный контекст для тестирования (опционально)',
                type: 'string',
            },
            iterations: {
                default: 5,
                description: 'Количество параллельных итераций (по умолчанию 5)',
                maximum: 10,
                minimum: 3,
                type: 'number',
            },
            models: {
                description: 'Список моделей для тестирования (опционально, по умолчанию из config)',
                items: {
                    type: 'string',
                },
                type: 'array',
            },
            prompt: {
                description: 'Промпт для тестирования',
                type: 'string',
            },
            timeout: {
                description: 'Timeout для каждого запроса в миллисекундах (по умолчанию из config)',
                minimum: 1000,
                type: 'number',
            },
        },
        required: ['prompt'],
        type: 'object',
    },
    name: 'test-prompt',
};
