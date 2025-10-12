import type { JSONRPCRequest } from '../../types';
import { handleToolsList } from '../handle-tools-list';

// Мокируем логгер
vi.mock('../../../../lib/helpers/logger', () => ({
    info: vi.fn(),
}));

// Мокируем константы MCP_TOOLS
vi.mock('../../constants', () => ({
    MCP_TOOLS: {
        'test-prompt': {
            description: 'Параллельное тестирование промптов на консистентность',
            inputSchema: {
                properties: {
                    iterations: { maximum: 10, minimum: 3, type: 'number' },
                    prompt: { type: 'string' },
                    timeout: { minimum: 1000, type: 'number' },
                },
                required: ['prompt'],
                type: 'object',
            },
        },
        validate: {
            description: 'Валидирует код с различными типами проверок',
            inputSchema: {
                properties: {
                    input: {
                        properties: {
                            data: { type: 'string' },
                            type: { enum: ['content', 'file', 'url'], type: 'string' },
                        },
                        required: ['type', 'data'],
                        type: 'object',
                    },
                    validationType: {
                        enum: [
                            'code',
                            'tests',
                            'architecture',
                            'security',
                            'performance',
                            'documentation',
                            'prompts',
                            'tasks',
                            'custom',
                        ],
                        type: 'string',
                    },
                },
                required: ['validationType', 'input'],
                type: 'object',
            },
        },
    },
}));

describe('handleToolsList', () => {
    it('должен возвращать список всех доступных инструментов', () => {
        const request: JSONRPCRequest = {
            id: 'tools-list-test',
            jsonrpc: '2.0',
            method: 'tools/list',
        };

        const response = handleToolsList(request);

        expect(response).toEqual({
            id: 'tools-list-test',
            jsonrpc: '2.0',
            result: {
                tools: [
                    {
                        description: 'Параллельное тестирование промптов на консистентность',
                        inputSchema: {
                            properties: {
                                iterations: { maximum: 10, minimum: 3, type: 'number' },
                                prompt: { type: 'string' },
                                timeout: { minimum: 1000, type: 'number' },
                            },
                            required: ['prompt'],
                            type: 'object',
                        },
                        name: 'test-prompt',
                    },
                    {
                        description: 'Валидирует код с различными типами проверок',
                        inputSchema: {
                            properties: {
                                input: {
                                    properties: {
                                        data: { type: 'string' },
                                        type: { enum: ['content', 'file', 'url'], type: 'string' },
                                    },
                                    required: ['type', 'data'],
                                    type: 'object',
                                },
                                validationType: {
                                    enum: [
                                        'code',
                                        'tests',
                                        'architecture',
                                        'security',
                                        'performance',
                                        'documentation',
                                        'prompts',
                                        'tasks',
                                        'custom',
                                    ],
                                    type: 'string',
                                },
                            },
                            required: ['validationType', 'input'],
                            type: 'object',
                        },
                        name: 'validate',
                    },
                ],
            },
        });
    });

    it('должен логировать запрос списка инструментов', () => {
        const infoSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

        const request: JSONRPCRequest = {
            id: 'logging-test',
            jsonrpc: '2.0',
            method: 'tools/list',
        };

        handleToolsList(request);

        expect(infoSpy).toHaveBeenCalled();

        infoSpy.mockRestore();
    });

    it('должен корректно обрабатывать различные типы ID', () => {
        const testCases = [
            { expectedId: 123, id: 123 },
            { expectedId: 'string-id', id: 'string-id' },
            { expectedId: null as any, id: null as unknown as string },
            { expectedId: 0, id: 0 },
        ];

        testCases.forEach((testCase) => {
            const request: JSONRPCRequest = {
                id: testCase.id,
                jsonrpc: '2.0',
                method: 'tools/list',
            };

            const response = handleToolsList(request);
            const result = response.result as { tools: unknown[] } | undefined;

            expect(response.id).toBe(testCase.expectedId);
            expect(response.jsonrpc).toBe('2.0');
            expect(result?.tools).toBeDefined();
        });
    });

    it('должен возвращать правильную структуру для каждого инструмента', () => {
        const request: JSONRPCRequest = {
            id: 'structure-test',
            jsonrpc: '2.0',
            method: 'tools/list',
        };

        const response = handleToolsList(request);
        const result = response.result as { tools: unknown[] } | undefined;

        expect(Array.isArray(result?.tools)).toBe(true);
        expect(result?.tools.length).toBeGreaterThan(0);

        result?.tools.forEach((tool: any) => {
            expect(tool).toHaveProperty('name');
            expect(tool).toHaveProperty('description');
            expect(tool).toHaveProperty('inputSchema');
            expect(typeof tool.name).toBe('string');
            expect(typeof tool.description).toBe('string');
            expect(typeof tool.inputSchema).toBe('object');
        });
    });

    it('должен включать validate инструмент с правильными свойствами', () => {
        const request: JSONRPCRequest = {
            id: 'validate-tool-test',
            jsonrpc: '2.0',
            method: 'tools/list',
        };

        const response = handleToolsList(request);
        const result = response.result as { tools: any[] } | undefined;

        const validateTool = result?.tools.find((tool: any) => tool.name === 'validate');

        expect(validateTool).toBeDefined();
        expect(validateTool?.description).toContain('Валидирует код');
        expect(validateTool?.inputSchema).toHaveProperty('type', 'object');
        expect(validateTool?.inputSchema).toHaveProperty('properties');
        expect(validateTool?.inputSchema).toHaveProperty('required');
        expect(validateTool?.inputSchema.required).toContain('validationType');
        expect(validateTool?.inputSchema.required).toContain('input');
    });

    it('должен включать test-prompt инструмент с правильными свойствами', () => {
        const request: JSONRPCRequest = {
            id: 'test-prompt-tool-test',
            jsonrpc: '2.0',
            method: 'tools/list',
        };

        const response = handleToolsList(request);
        const result = response.result as { tools: any[] } | undefined;

        const testPromptTool = result?.tools.find((tool: any) => tool.name === 'test-prompt');

        expect(testPromptTool).toBeDefined();
        expect(testPromptTool?.description).toContain('тестирование промптов');
        expect(testPromptTool?.inputSchema).toHaveProperty('type', 'object');
        expect(testPromptTool?.inputSchema).toHaveProperty('properties');
        expect(testPromptTool?.inputSchema.properties).toHaveProperty('prompt');
        expect(testPromptTool?.inputSchema.properties).toHaveProperty('iterations');
        expect(testPromptTool?.inputSchema.properties).toHaveProperty('timeout');
        expect(testPromptTool?.inputSchema.required).toContain('prompt');
    });

    it('должен возвращать корректный JSON-RPC 2.0 ответ', () => {
        const request: JSONRPCRequest = {
            id: 'jsonrpc-test',
            jsonrpc: '2.0',
            method: 'tools/list',
        };

        const response = handleToolsList(request);

        expect(response).toHaveProperty('jsonrpc', '2.0');
        expect(response).toHaveProperty('id', 'jsonrpc-test');
        expect(response).toHaveProperty('result');
        expect(response).not.toHaveProperty('error');
        expect(response.result).toHaveProperty('tools');
    });

    it('должен работать без параметров в запросе', () => {
        const request: JSONRPCRequest = {
            id: 'no-params-test',
            jsonrpc: '2.0',
            method: 'tools/list',
        };

        const response = handleToolsList(request);
        const result = response.result as { tools: unknown[] } | undefined;

        expect(result?.tools).toBeDefined();
        expect(Array.isArray(result?.tools)).toBe(true);
        expect(result?.tools.length).toBeGreaterThan(0);
    });

    it('должен обеспечивать неизменность исходных данных MCP_TOOLS', () => {
        const request: JSONRPCRequest = {
            id: 'immutability-test',
            jsonrpc: '2.0',
            method: 'tools/list',
        };

        const response1 = handleToolsList(request);
        const response2 = handleToolsList(request);

        const result1 = response1.result as { tools: unknown[] } | undefined;
        const result2 = response2.result as { tools: unknown[] } | undefined;

        // Результаты должны быть идентичными (но не ссылающимися на одни объекты)
        expect(result1?.tools).toEqual(result2?.tools);

        // Проверяем что каждый вызов создает новые объекты
        expect(result1?.tools[0]).not.toBe(result2?.tools[0]);
    });
});
