import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

import { handleTestPromptTool, testPromptTool } from '../tools/test-prompt-tool';
import { handleValidateTool, validateTool } from '../tools/validate-tool';

/** Создание и инициализация MCP сервера с официальным SDK */
export function createMcpServer(): Server {
    const server = new Server(
        {
            name: 'mcp-validator',
            version: '2.0.0',
        },
        {
            capabilities: {
                tools: {},
            },
        },
    );

    server.setRequestHandler(ListToolsRequestSchema, () => ({
        tools: [validateTool, testPromptTool],
    }));

    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;

        try {
            switch (name) {
                case 'validate': {
                    const result = await handleValidateTool(args);

                    return {
                        content: [
                            {
                                text: result.content,
                                type: 'text',
                            },
                        ],
                        isError: result.isError || false,
                    };
                }

                case 'test-prompt': {
                    const result = await handleTestPromptTool(args);

                    return {
                        content: [
                            {
                                text: result.content,
                                type: 'text',
                            },
                        ],
                        isError: result.isError || false,
                    };
                }

                default: {
                    throw new Error(`Unknown tool: ${name}`);
                }
            }
        } catch (err) {
            return {
                content: [
                    {
                        text: `# ❌ Ошибка выполнения инструмента\n\n**Инструмент:** ${name}\n**Ошибка:** ${err instanceof Error ? err.message : String(err)}`,
                        type: 'text',
                    },
                ],
                isError: true,
            };
        }
    });

    return server;
}
