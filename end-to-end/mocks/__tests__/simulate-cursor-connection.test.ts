import { simulateCursorConnection } from '../simulate-cursor-connection';

describe('simulateCursorConnection', () => {
    it('должен возвращать Promise с MCPTestClient', async () => {
        const result = await simulateCursorConnection();

        expect(result).toBeDefined();
        expect(typeof result.connectToProcess).toBe('function');
        expect(typeof result.sendRequest).toBe('function');
        expect(typeof result.initialize).toBe('function');
        expect(typeof result.callTool).toBe('function');
        expect(typeof result.listTools).toBe('function');
    });

    it('должен создавать корректный симулятор клиента', async () => {
        const client = await simulateCursorConnection();

        expect(client).toHaveProperty('connectToProcess');
        expect(client).toHaveProperty('sendRequest');
        expect(client).toHaveProperty('initialize');
        expect(client).toHaveProperty('callTool');
        expect(client).toHaveProperty('listTools');
    });
});

