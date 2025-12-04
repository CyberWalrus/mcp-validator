import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import type { ConfirmationContent, ElicitationResult } from './types';

/** Запрашивает подтверждение у пользователя через MCP elicitation */
export async function elicitConfirmation(mcpServer: McpServer, message: string): Promise<boolean> {
    const result = (await mcpServer.server.elicitInput({
        message,
        requestedSchema: {
            properties: {
                confirm: {
                    description: 'Подтвердите действие',
                    title: 'Подтверждение',
                    type: 'boolean',
                },
            },
            required: ['confirm'],
            type: 'object',
        },
    })) as ElicitationResult<ConfirmationContent>;

    return result.action === 'accept' && result.content?.confirm === true;
}
