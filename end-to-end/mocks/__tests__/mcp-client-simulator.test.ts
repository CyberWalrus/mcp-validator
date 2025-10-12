import { createMcpClientSimulator } from '../mcp-client-simulator';

describe('createMcpClientSimulator', () => {
    it('должен создавать симулятор MCP клиента с правильным интерфейсом', () => {
        const simulator = createMcpClientSimulator();

        expect(simulator).toBeDefined();
        expect(typeof simulator.connectToProcess).toBe('function');
        expect(typeof simulator.sendRequest).toBe('function');
        expect(typeof simulator.initialize).toBe('function');
        expect(typeof simulator.callTool).toBe('function');
        expect(typeof simulator.listTools).toBe('function');
    });

    it('должен иметь все необходимые методы для MCPTestClient интерфейса', () => {
        const simulator = createMcpClientSimulator();

        expect(simulator.connectToProcess).toBeDefined();
        expect(simulator.sendRequest).toBeDefined();
        expect(simulator.initialize).toBeDefined();
        expect(simulator.callTool).toBeDefined();
        expect(simulator.listTools).toBeDefined();
    });

    it('должен возвращать объект с правильной структурой', () => {
        const simulator = createMcpClientSimulator();

        expect(simulator).toHaveProperty('connectToProcess');
        expect(simulator).toHaveProperty('sendRequest');
        expect(simulator).toHaveProperty('initialize');
        expect(simulator).toHaveProperty('callTool');
        expect(simulator).toHaveProperty('listTools');
    });
});
