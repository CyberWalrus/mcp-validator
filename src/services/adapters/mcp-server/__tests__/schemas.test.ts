import {
    JSONRPCRequestSchema,
    JSONRPCResponseSchema,
    MCPInitializeRequestSchema,
    MCPToolCallRequestSchema,
    MCPToolResultSchema,
} from '../schemas';

describe('MCP Schemas', () => {
    describe('JSONRPCRequestSchema', () => {
        it('должен валидировать корректный JSON-RPC запрос', () => {
            const validRequest = {
                id: '1',
                jsonrpc: '2.0' as const,
                method: 'test',
                params: { test: true },
            };

            const result = JSONRPCRequestSchema.safeParse(validRequest);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toEqual(validRequest);
            }
        });

        it('должен отклонять запрос с неверной версией jsonrpc', () => {
            const invalidRequest = {
                id: '1',
                jsonrpc: '1.0',
                method: 'test',
            };

            const result = JSONRPCRequestSchema.safeParse(invalidRequest);

            expect(result.success).toBe(false);
        });

        it('должен принимать запрос без params', () => {
            const requestWithoutParams = {
                id: 123,
                jsonrpc: '2.0' as const,
                method: 'test',
            };

            const result = JSONRPCRequestSchema.safeParse(requestWithoutParams);

            expect(result.success).toBe(true);
        });
    });

    describe('MCPInitializeRequestSchema', () => {
        it('должен валидировать корректный initialize запрос', () => {
            const validRequest = {
                id: '1',
                jsonrpc: '2.0' as const,
                method: 'initialize' as const,
                params: {
                    capabilities: {},
                    clientInfo: {
                        name: 'test-client',
                        version: '2.0.0',
                    },
                    protocolVersion: '2024-11-05',
                },
            };

            const result = MCPInitializeRequestSchema.safeParse(validRequest);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toEqual(validRequest);
            }
        });

        it('должен отклонять initialize запрос без clientInfo', () => {
            const invalidRequest = {
                id: '1',
                jsonrpc: '2.0' as const,
                method: 'initialize' as const,
                params: {
                    capabilities: {},
                    protocolVersion: '2024-11-05',
                },
            };

            const result = MCPInitializeRequestSchema.safeParse(invalidRequest);

            expect(result.success).toBe(false);
        });
    });

    describe('MCPToolCallRequestSchema', () => {
        it('должен валидировать корректный tool call запрос', () => {
            const validRequest = {
                id: '2',
                jsonrpc: '2.0' as const,
                method: 'tools/call' as const,
                params: {
                    arguments: {
                        input: { data: 'test', type: 'content' },
                        validationType: 'code',
                    },
                    name: 'validate',
                },
            };

            const result = MCPToolCallRequestSchema.safeParse(validRequest);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toEqual(validRequest);
            }
        });

        it('должен отклонять tool call запрос без name', () => {
            const invalidRequest = {
                id: '2',
                jsonrpc: '2.0' as const,
                method: 'tools/call' as const,
                params: {
                    arguments: { test: true },
                },
            };

            const result = MCPToolCallRequestSchema.safeParse(invalidRequest);

            expect(result.success).toBe(false);
        });
    });

    describe('JSONRPCResponseSchema', () => {
        it('должен валидировать успешный ответ', () => {
            const validResponse = {
                id: '1',
                jsonrpc: '2.0' as const,
                result: { success: true },
            };

            const result = JSONRPCResponseSchema.safeParse(validResponse);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toEqual(validResponse);
            }
        });

        it('должен валидировать ответ с ошибкой', () => {
            const errorResponse = {
                error: {
                    code: -32601,
                    message: 'Method not found',
                },
                id: '1',
                jsonrpc: '2.0' as const,
            };

            const result = JSONRPCResponseSchema.safeParse(errorResponse);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toEqual(errorResponse);
            }
        });
    });

    describe('MCPToolResultSchema', () => {
        it('должен валидировать результат инструмента', () => {
            const validResult = {
                content: [
                    {
                        text: 'Test result',
                        type: 'text' as const,
                    },
                ],
            };

            const result = MCPToolResultSchema.safeParse(validResult);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toEqual(validResult);
            }
        });

        it('должен отклонять результат с неверным типом контента', () => {
            const invalidResult = {
                content: [
                    {
                        text: 'Test',
                        type: 'image',
                    },
                ],
            };

            const result = MCPToolResultSchema.safeParse(invalidResult);

            expect(result.success).toBe(false);
        });
    });
});
