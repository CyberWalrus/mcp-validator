import type { JSONRPCRequest } from '../../types';
import { handleInitialize } from '../handle-initialize';

// Мокируем логгер
vi.mock('../../../../lib/helpers/logger', () => ({
    error: vi.fn(),
    info: vi.fn(),
}));

describe('handleInitialize', () => {
    it('должен успешно обрабатывать корректный initialize запрос', () => {
        const request: JSONRPCRequest = {
            id: 123,
            jsonrpc: '2.0',
            method: 'initialize',
            params: {
                capabilities: {},
                clientInfo: {
                    name: 'Test Client',
                    version: '2.0.0',
                },
                protocolVersion: '2024-11-05',
            },
        };

        const response = handleInitialize(request);

        expect(response).toEqual({
            id: 123,
            jsonrpc: '2.0',
            result: {
                capabilities: {
                    tools: expect.any(Object),
                },
                protocolVersion: expect.any(String),
                serverInfo: expect.any(Object),
            },
        });

        const result = response.result as {
            capabilities: { tools: object };
            serverInfo: { name: string; version: string };
        };
        expect(result?.serverInfo).toHaveProperty('name');
        expect(result?.serverInfo).toHaveProperty('version');
        expect(result?.capabilities.tools).toBeDefined();
    });

    it('должен обрабатывать запрос с минимальными параметрами', () => {
        const request: JSONRPCRequest = {
            id: 'minimal-request',
            jsonrpc: '2.0',
            method: 'initialize',
            params: {
                capabilities: {},
                clientInfo: {
                    name: 'Minimal Client',
                    version: '2.0.0',
                },
                protocolVersion: '2024-11-05',
            },
        };

        const response = handleInitialize(request);

        expect(response.jsonrpc).toBe('2.0');
        expect(response.id).toBe('minimal-request');
        expect(response.result).toBeDefined();
        expect(response.error).toBeUndefined();
    });

    it('должен возвращать ошибку для некорректных параметров', () => {
        const request: JSONRPCRequest = {
            id: 456,
            jsonrpc: '2.0',
            method: 'initialize',
            params: {
                // Отсутствует protocolVersion
                clientInfo: {
                    name: 'Test Client',
                },
            },
        };

        const response = handleInitialize(request);

        expect(response.jsonrpc).toBe('2.0');
        expect(response.id).toBe(456);
        expect(response.result).toBeDefined();
        const result = response.result as { content: Array<{ text: string; type: string }> };
        expect(result.content).toHaveLength(1);
        expect(result.content[0]?.type).toBe('text');
        expect(result.content[0]?.text).toContain('# ❌ Ошибка валидации');
        expect(result.content[0]?.text).toContain('Invalid parameters');
    });

    it('должен возвращать ошибку для запроса без clientInfo', () => {
        const request: JSONRPCRequest = {
            id: 789,
            jsonrpc: '2.0',
            method: 'initialize',
            params: {
                protocolVersion: '2024-11-05',
                // Отсутствует clientInfo
            },
        };

        const response = handleInitialize(request);

        expect(response.jsonrpc).toBe('2.0');
        expect(response.id).toBe(789);
        expect(response.result).toBeDefined();
        const result = response.result as { content: Array<{ text: string; type: string }> };
        expect(result.content).toHaveLength(1);
        expect(result.content[0]?.type).toBe('text');
        expect(result.content[0]?.text).toContain('# ❌ Ошибка валидации');
        expect(result.content[0]?.text).toContain('Invalid parameters');
    });

    it('должен возвращать правильную структуру capabilities', () => {
        const request: JSONRPCRequest = {
            id: 'capabilities-test',
            jsonrpc: '2.0',
            method: 'initialize',
            params: {
                capabilities: {},
                clientInfo: {
                    name: 'Capabilities Test Client',
                    version: '2.0.0',
                },
                protocolVersion: '2024-11-05',
            },
        };

        const response = handleInitialize(request);
        const result = response.result as { capabilities: { tools: object } } | undefined;

        expect(result?.capabilities).toHaveProperty('tools');
        expect(typeof result?.capabilities.tools).toBe('object');
        expect(result?.capabilities.tools).not.toBeNull();
    });

    it('должен логировать информацию о клиенте', () => {
        const infoSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

        const request: JSONRPCRequest = {
            id: 'logging-test',
            jsonrpc: '2.0',
            method: 'initialize',
            params: {
                capabilities: {},
                clientInfo: {
                    name: 'Logging Test Client',
                    version: '3.0.0',
                },
                protocolVersion: '2024-11-05',
            },
        };

        handleInitialize(request);

        expect(infoSpy).toHaveBeenCalled();

        infoSpy.mockRestore();
    });

    it('должен обрабатывать различные типы ID запросов', () => {
        const testCases = [
            { expectedId: 1, id: 1 },
            { expectedId: 'string-id', id: 'string-id' },
            { expectedId: 0, id: 0 },
        ];

        testCases.forEach((testCase) => {
            const request: JSONRPCRequest = {
                id: testCase.id,
                jsonrpc: '2.0',
                method: 'initialize',
                params: {
                    capabilities: {},
                    clientInfo: {
                        name: 'ID Test Client',
                        version: '2.0.0',
                    },
                    protocolVersion: '2024-11-05',
                },
            };

            const response = handleInitialize(request);

            expect(response.id).toBe(testCase.expectedId);
        });
    });

    it('должен возвращать корректную версию протокола', () => {
        const request: JSONRPCRequest = {
            id: 'protocol-test',
            jsonrpc: '2.0',
            method: 'initialize',
            params: {
                capabilities: {},
                clientInfo: {
                    name: 'Protocol Test Client',
                    version: '2.0.0',
                },
                protocolVersion: '2024-11-05',
            },
        };

        const response = handleInitialize(request);
        const result = response.result as { protocolVersion: string } | undefined;

        expect(result?.protocolVersion).toBeDefined();
        expect(typeof result?.protocolVersion).toBe('string');
        expect(result?.protocolVersion).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('должен включать информацию о сервере', () => {
        const request: JSONRPCRequest = {
            id: 'server-info-test',
            jsonrpc: '2.0',
            method: 'initialize',
            params: {
                capabilities: {},
                clientInfo: {
                    name: 'Server Info Test Client',
                    version: '2.0.0',
                },
                protocolVersion: '2024-11-05',
            },
        };

        const response = handleInitialize(request);
        const result = response.result as { serverInfo: { name: string; version: string } } | undefined;

        expect(result?.serverInfo).toBeDefined();
        expect(result?.serverInfo).toHaveProperty('name');
        expect(result?.serverInfo).toHaveProperty('version');
        expect(typeof result?.serverInfo.name).toBe('string');
        expect(typeof result?.serverInfo.version).toBe('string');
    });
});
