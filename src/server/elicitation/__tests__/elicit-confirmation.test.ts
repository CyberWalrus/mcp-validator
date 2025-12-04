import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { elicitConfirmation } from '../elicit-confirmation';

/** Создает мок McpServer с заданным результатом elicitInput */
function createMockMcpServer(elicitInputResult: {
    action: 'accept' | 'cancel' | 'decline';
    content?: { confirm?: boolean };
}): McpServer {
    return {
        server: {
            elicitInput: vi.fn().mockResolvedValue(elicitInputResult),
        },
    } as unknown as McpServer;
}

describe('elicitConfirmation', () => {
    it('должен вернуть true при accept с confirm: true', async () => {
        const mockServer = createMockMcpServer({
            action: 'accept',
            content: { confirm: true },
        });

        const result = await elicitConfirmation(mockServer, 'Подтвердите действие?');

        expect(result).toBe(true);
    });

    it('должен вернуть false при accept с confirm: false', async () => {
        const mockServer = createMockMcpServer({
            action: 'accept',
            content: { confirm: false },
        });

        const result = await elicitConfirmation(mockServer, 'Подтвердите действие?');

        expect(result).toBe(false);
    });

    it('должен вернуть false при decline', async () => {
        const mockServer = createMockMcpServer({
            action: 'decline',
        });

        const result = await elicitConfirmation(mockServer, 'Подтвердите действие?');

        expect(result).toBe(false);
    });

    it('должен вернуть false при cancel', async () => {
        const mockServer = createMockMcpServer({
            action: 'cancel',
        });

        const result = await elicitConfirmation(mockServer, 'Подтвердите действие?');

        expect(result).toBe(false);
    });

    it('должен вернуть false при accept без confirm в content', async () => {
        const mockServer = createMockMcpServer({
            action: 'accept',
            content: {},
        });

        const result = await elicitConfirmation(mockServer, 'Подтвердите действие?');

        expect(result).toBe(false);
    });

    it('должен вернуть false при accept без content', async () => {
        const mockServer = createMockMcpServer({
            action: 'accept',
        });

        const result = await elicitConfirmation(mockServer, 'Подтвердите действие?');

        expect(result).toBe(false);
    });

    it('должен вызвать elicitInput с корректными параметрами', async () => {
        const mockServer = createMockMcpServer({
            action: 'decline',
        });
        const message = 'Вы уверены что хотите продолжить?';

        await elicitConfirmation(mockServer, message);

        expect(mockServer.server.elicitInput).toHaveBeenCalledWith({
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
        });
    });

    it('должен передать пользовательское сообщение в elicitInput', async () => {
        const mockServer = createMockMcpServer({
            action: 'accept',
            content: { confirm: true },
        });
        const customMessage = 'Удалить файл безвозвратно?';

        await elicitConfirmation(mockServer, customMessage);

        expect(mockServer.server.elicitInput).toHaveBeenCalledWith(
            expect.objectContaining({
                message: customMessage,
            }),
        );
    });
});
