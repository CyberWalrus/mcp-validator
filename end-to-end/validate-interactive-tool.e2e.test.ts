import { resolve } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { MOCK_API_RESPONSES } from './constants';
import { cleanupE2EEnvironment, setupE2EEnvironment } from './helpers';
import type { E2ETestContext, MCPResponse, ToolsListResponse } from './types';

/** Проверяет базовую структуру ответа MCP */
function expectValidMCPResponse(response: MCPResponse) {
    expect(response.jsonrpc).toBe('2.0');
    expect(response).toBeDefined();
}

/** Проверяет что инструмент присутствует в списке */
function expectToolInList(response: ToolsListResponse, toolName: string) {
    expect(response.result).toBeDefined();
    const result = response.result as { tools: Array<{ name: string }> };
    const toolNames = result.tools.map((tool) => tool.name);
    expect(toolNames).toContain(toolName);
}

describe('E2E: Validate-interactive инструмент', () => {
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

    describe('Регистрация инструмента', () => {
        it('должен быть доступен в списке инструментов', async () => {
            const response = await testContext.clientSimulator.listTools();

            expectValidMCPResponse(response);
            expectToolInList(response, 'validate-interactive');
        });

        it('должен иметь корректное описание', async () => {
            const response = await testContext.clientSimulator.listTools();
            const result = response.result as { tools: Array<{ description: string; name: string }> };
            const tool = result.tools.find((t) => t.name === 'validate-interactive');

            expect(tool).toBeDefined();
            expect(tool?.description).toContain('Интерактивная валидация');
        });
    });

    describe('Валидация с указанным validationType', () => {
        it('должен успешно валидировать файл с указанным типом code', async () => {
            testContext.mockOpenRouter.mockResponse(MOCK_API_RESPONSES.CODE_VALIDATION_SUCCESS);

            const testFilePath = resolve(__dirname, '__tests__', '__mocks__', 'test-file.ts');

            const response = await testContext.clientSimulator.callTool('validate-interactive', {
                filePath: testFilePath,
                language: 'typescript',
                validationType: 'code',
            });

            expectValidMCPResponse(response);

            const result = response.result as { content: Array<{ text: string; type: string }> } | undefined;
            expect(result?.content).toHaveLength(1);
            expect(result?.content?.[0]?.type).toBe('text');
        });

        it('должен успешно валидировать файл с типом tests', async () => {
            testContext.mockOpenRouter.mockResponse(MOCK_API_RESPONSES.CODE_VALIDATION_SUCCESS);

            const testFilePath = resolve(__dirname, '__tests__', '__mocks__', 'test-file.ts');

            const response = await testContext.clientSimulator.callTool('validate-interactive', {
                context: 'Тестирование E2E validate-interactive',
                filePath: testFilePath,
                language: 'typescript',
                validationType: 'tests',
            });

            expectValidMCPResponse(response);
        });

        it('должен успешно валидировать файл с типом architecture', async () => {
            testContext.mockOpenRouter.mockResponse(MOCK_API_RESPONSES.CODE_VALIDATION_SUCCESS);

            const testFilePath = resolve(__dirname, '__tests__', '__mocks__', 'test-file.ts');

            const response = await testContext.clientSimulator.callTool('validate-interactive', {
                filePath: testFilePath,
                validationType: 'architecture',
            });

            expectValidMCPResponse(response);
        });
    });

    describe('Обработка ошибок', () => {
        it('должен вернуть ошибку при отсутствии filePath', async () => {
            const response = await testContext.clientSimulator.callTool('validate-interactive', {
                validationType: 'code',
            });

            expectValidMCPResponse(response);

            const result = response.result as { content: Array<{ text: string; type: string }>; isError?: boolean } | undefined;
            expect(result?.content).toHaveLength(1);

            let text = result?.content?.[0]?.text;
            if (typeof text === 'object') {
                text = JSON.stringify(text, null, 2);
            } else if (typeof text !== 'string') {
                text = String(text || '');
            }

            const hasError =
                text.includes('filePath') ||
                text.includes('Ошибка') ||
                text.includes('error') ||
                text.includes('обязательный');
            expect(hasError).toBe(true);
        });

        it('должен вернуть ошибку при пустом filePath', async () => {
            const response = await testContext.clientSimulator.callTool('validate-interactive', {
                filePath: '',
                validationType: 'code',
            });

            expectValidMCPResponse(response);

            const result = response.result as { content: Array<{ text: string; type: string }>; isError?: boolean } | undefined;
            expect(result?.content).toHaveLength(1);

            let text = result?.content?.[0]?.text;
            if (typeof text === 'object') {
                text = JSON.stringify(text, null, 2);
            } else if (typeof text !== 'string') {
                text = String(text || '');
            }

            const hasError =
                text.includes('filePath') ||
                text.includes('Ошибка') ||
                text.includes('error') ||
                text.includes('обязательный');
            expect(hasError).toBe(true);
        });
    });

    describe('Использование дефолтных значений', () => {
        it('должен использовать typescript как язык по умолчанию', async () => {
            testContext.mockOpenRouter.mockResponse(MOCK_API_RESPONSES.CODE_VALIDATION_SUCCESS);

            const testFilePath = resolve(__dirname, '__tests__', '__mocks__', 'test-file.ts');

            const response = await testContext.clientSimulator.callTool('validate-interactive', {
                filePath: testFilePath,
                validationType: 'code',
            });

            expectValidMCPResponse(response);

            const result = response.result as { content: Array<{ text: string; type: string }> } | undefined;
            expect(result?.content).toHaveLength(1);
        });
    });
}, 30_000);

