import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { elicitValidationType } from '../elicit-validation-type';

/** Создает мок McpServer с заданным результатом elicitInput */
function createMockMcpServer(elicitInputResult: {
    action: 'accept' | 'cancel' | 'decline';
    content?: { validationType?: string };
}): McpServer {
    return {
        server: {
            elicitInput: vi.fn().mockResolvedValue(elicitInputResult),
        },
    } as unknown as McpServer;
}

describe('elicitValidationType', () => {
    it('должен вернуть validationType при accept с корректным содержимым', async () => {
        const mockServer = createMockMcpServer({
            action: 'accept',
            content: { validationType: 'code' },
        });

        const result = await elicitValidationType(mockServer, '/path/to/file.ts');

        expect(result).toBe('code');
    });

    it('должен вернуть null при decline', async () => {
        const mockServer = createMockMcpServer({
            action: 'decline',
        });

        const result = await elicitValidationType(mockServer, '/path/to/file.ts');

        expect(result).toBeNull();
    });

    it('должен вернуть null при cancel', async () => {
        const mockServer = createMockMcpServer({
            action: 'cancel',
        });

        const result = await elicitValidationType(mockServer, '/path/to/file.ts');

        expect(result).toBeNull();
    });

    it('должен вернуть null при accept без validationType в content', async () => {
        const mockServer = createMockMcpServer({
            action: 'accept',
            content: {},
        });

        const result = await elicitValidationType(mockServer, '/path/to/file.ts');

        expect(result).toBeNull();
    });

    it('должен вернуть null при accept без content', async () => {
        const mockServer = createMockMcpServer({
            action: 'accept',
        });

        const result = await elicitValidationType(mockServer, '/path/to/file.ts');

        expect(result).toBeNull();
    });

    it('должен вызвать elicitInput с корректными параметрами', async () => {
        const mockServer = createMockMcpServer({
            action: 'decline',
        });

        await elicitValidationType(mockServer, '/test/path/file.ts');

        expect(mockServer.server.elicitInput).toHaveBeenCalledWith({
            message: 'Какой тип валидации применить к файлу "/test/path/file.ts"?',
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
        });
    });

    it('должен вернуть tests при выборе типа tests', async () => {
        const mockServer = createMockMcpServer({
            action: 'accept',
            content: { validationType: 'tests' },
        });

        const result = await elicitValidationType(mockServer, '/path/to/file.test.ts');

        expect(result).toBe('tests');
    });

    it('должен вернуть documentation при выборе типа documentation', async () => {
        const mockServer = createMockMcpServer({
            action: 'accept',
            content: { validationType: 'documentation' },
        });

        const result = await elicitValidationType(mockServer, '/path/to/README.md');

        expect(result).toBe('documentation');
    });
});
