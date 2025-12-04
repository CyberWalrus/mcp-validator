import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import type { ValidationType } from '../../model/config';
import type { ElicitationResult, ValidationTypeContent } from './types';

/** Запрашивает у пользователя тип валидации через MCP elicitation */
export async function elicitValidationType(mcpServer: McpServer, filePath: string): Promise<ValidationType | null> {
    const result = (await mcpServer.server.elicitInput({
        message: `Какой тип валидации применить к файлу "${filePath}"?`,
        requestedSchema: {
            properties: {
                validationType: {
                    description: 'Выберите тип проверки',
                    enum: ['code', 'tests', 'architecture', 'prompts', 'documentation'],
                    enumNames: ['Качество кода', 'Тесты', 'Архитектура', 'Промпты', 'Документация'],
                    title: 'Тип валидации',
                    type: 'string',
                },
            },
            required: ['validationType'],
            type: 'object',
        },
    })) as ElicitationResult<ValidationTypeContent>;

    if (result.action === 'accept' && result.content?.validationType) {
        return result.content.validationType;
    }

    return null;
}
