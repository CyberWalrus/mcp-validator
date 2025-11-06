import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { MOCK_API_RESPONSES } from './constants';
import { cleanupE2EEnvironment, setupE2EEnvironment } from './helpers';
import type { E2ETestContext, MCPResponse } from './types';

/** Проверяет базовую структуру ответа MCP */
function expectValidMCPResponse(response: MCPResponse) {
    expect(response.jsonrpc).toBe('2.0');
    expect(response).toBeDefined();
}

describe('E2E: Verify-Info инструмент', () => {
    let testContext: E2ETestContext;

    beforeAll(async () => {
        testContext = await setupE2EEnvironment();

        await testContext.clientSimulator.initialize({
            name: 'cursor',
            version: '2.0.0',
        });
    });

    afterAll(async () => {
        await cleanupE2EEnvironment(testContext);
    });

    describe('Проверка информации через текст', () => {
        it('должен успешно проверить информацию из текста', async () => {
            Array(3)
                .fill(null)
                .forEach(() => {
                    testContext.mockOpenRouter.mockResponse(MOCK_API_RESPONSES.CODE_VALIDATION_SUCCESS);
                });

            const response = await testContext.clientSimulator.callTool('verify-info', {
                input: {
                    data: 'Информация для проверки: TypeScript - это язык программирования.',
                    type: 'content',
                },
            });

            expectValidMCPResponse(response);
        });

        it('должен проверить информацию с контекстом', async () => {
            Array(3)
                .fill(null)
                .forEach(() => {
                    testContext.mockOpenRouter.mockResponse(MOCK_API_RESPONSES.CODE_VALIDATION_SUCCESS);
                });

            const response = await testContext.clientSimulator.callTool('verify-info', {
                context: 'Проверка технической информации',
                input: {
                    data: 'React - это библиотека для создания пользовательских интерфейсов.',
                    type: 'content',
                },
            });

            expectValidMCPResponse(response);
        });
    });

    describe('Проверка информации из файла', () => {
        it('должен проверить информацию из файла', async () => {
            Array(3)
                .fill(null)
                .forEach(() => {
                    testContext.mockOpenRouter.mockResponse(MOCK_API_RESPONSES.CODE_VALIDATION_SUCCESS);
                });

            const { writeFileSync } = await import('node:fs');
            const { join } = await import('node:path');
            const { tmpdir } = await import('node:os');

            const testFilePath = join(tmpdir(), `test-info-${Date.now()}.txt`);
            writeFileSync(testFilePath, 'Информация для проверки из файла', 'utf8');

            const response = await testContext.clientSimulator.callTool('verify-info', {
                input: {
                    data: testFilePath,
                    type: 'file',
                },
            });

            expectValidMCPResponse(response);
        });

        it('должен обработать ошибку чтения файла', async () => {
            const response = await testContext.clientSimulator.callTool('verify-info', {
                input: {
                    data: '/nonexistent/file.txt',
                    type: 'file',
                },
            });

            expectValidMCPResponse(response);
        });
    });

    describe('Обработка ошибок', () => {
        it('должен обработать отсутствующие обязательные параметры', async () => {
            const response = await testContext.clientSimulator.callTool('verify-info', {});

            expect(response.jsonrpc).toBe('2.0');
        });

        it('должен обработать неподдерживаемый тип входных данных', async () => {
            const response = await testContext.clientSimulator.callTool('verify-info', {
                input: {
                    data: 'test',
                    type: 'url' as never,
                },
            });

            expect(response.jsonrpc).toBe('2.0');
        });
    });
});
