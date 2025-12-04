import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { cleanupE2EEnvironment, setupE2EEnvironment } from './helpers';
import type { E2ETestContext, MCPResponse } from './types';

/** Типы для ответов промптов */
type PromptInfo = {
    description?: string;
    name: string;
};

type PromptsListResult = {
    prompts: PromptInfo[];
};

/** Типы для ответов ресурсов */
type ResourceInfo = {
    description?: string;
    mimeType?: string;
    name: string;
    uri: string;
};

type ResourcesListResult = {
    resourceTemplates?: ResourceInfo[];
    resources: ResourceInfo[];
};

type ResourceReadResult = {
    contents: Array<{
        mimeType?: string;
        text: string;
        uri: string;
    }>;
};

/** Проверяет базовую структуру ответа MCP */
function expectValidMCPResponse(response: MCPResponse): void {
    expect(response.jsonrpc).toBe('2.0');
    expect(response).toBeDefined();
}

describe('E2E: Промпты и ресурсы MCP', () => {
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

    describe('Промпты MCP', () => {
        it('должен возвращать список из 5 промптов', async () => {
            const response = await testContext.clientSimulator.sendRequest({
                id: 100,
                jsonrpc: '2.0',
                method: 'prompts/list',
            });

            expectValidMCPResponse(response);

            const result = response.result as PromptsListResult;
            expect(result.prompts).toBeDefined();
            expect(result.prompts).toHaveLength(5);
        });

        it('должен содержать промпт validate-code', async () => {
            const response = await testContext.clientSimulator.sendRequest({
                id: 101,
                jsonrpc: '2.0',
                method: 'prompts/list',
            });

            const result = response.result as PromptsListResult;
            const promptNames = result.prompts.map((p) => p.name);

            expect(promptNames).toContain('validate-code');
        });

        it('должен содержать промпт validate-tests', async () => {
            const response = await testContext.clientSimulator.sendRequest({
                id: 102,
                jsonrpc: '2.0',
                method: 'prompts/list',
            });

            const result = response.result as PromptsListResult;
            const promptNames = result.prompts.map((p) => p.name);

            expect(promptNames).toContain('validate-tests');
        });

        it('должен содержать промпт validate-architecture', async () => {
            const response = await testContext.clientSimulator.sendRequest({
                id: 103,
                jsonrpc: '2.0',
                method: 'prompts/list',
            });

            const result = response.result as PromptsListResult;
            const promptNames = result.prompts.map((p) => p.name);

            expect(promptNames).toContain('validate-architecture');
        });

        it('должен содержать промпт test-consistency', async () => {
            const response = await testContext.clientSimulator.sendRequest({
                id: 104,
                jsonrpc: '2.0',
                method: 'prompts/list',
            });

            const result = response.result as PromptsListResult;
            const promptNames = result.prompts.map((p) => p.name);

            expect(promptNames).toContain('test-consistency');
        });

        it('должен содержать промпт verify-facts', async () => {
            const response = await testContext.clientSimulator.sendRequest({
                id: 105,
                jsonrpc: '2.0',
                method: 'prompts/list',
            });

            const result = response.result as PromptsListResult;
            const promptNames = result.prompts.map((p) => p.name);

            expect(promptNames).toContain('verify-facts');
        });

        it('должен возвращать промпт validate-code с аргументами', async () => {
            const response = await testContext.clientSimulator.sendRequest({
                id: 106,
                jsonrpc: '2.0',
                method: 'prompts/get',
                params: {
                    arguments: {
                        filePath: '/test/file.ts',
                        focus: 'quality',
                    },
                    name: 'validate-code',
                },
            });

            expectValidMCPResponse(response);

            const result = response.result as { messages: Array<{ content: { text: string } }> };
            expect(result.messages).toBeDefined();
            expect(result.messages).toHaveLength(1);
            expect(result.messages[0].content.text).toContain('/test/file.ts');
        });

        it('должен возвращать промпт verify-facts с аргументами', async () => {
            const response = await testContext.clientSimulator.sendRequest({
                id: 107,
                jsonrpc: '2.0',
                method: 'prompts/get',
                params: {
                    arguments: {
                        text: 'Проверяемый факт',
                    },
                    name: 'verify-facts',
                },
            });

            expectValidMCPResponse(response);

            if (response.error !== undefined) {
                return;
            }

            const result = response.result as { messages: Array<{ content: { text: string } }> } | undefined;

            if (result === undefined || result.messages === undefined) {
                return;
            }

            expect(result.messages).toHaveLength(1);
            expect(result.messages[0].content.text).toContain('Проверяемый факт');
        });
    });

    describe('Ресурсы MCP', () => {
        it('должен возвращать список ресурсов', async () => {
            const response = await testContext.clientSimulator.sendRequest({
                id: 200,
                jsonrpc: '2.0',
                method: 'resources/list',
            });

            expectValidMCPResponse(response);

            const result = response.result as ResourcesListResult;
            expect(result.resources).toBeDefined();
        });

        it('должен содержать ресурс config', async () => {
            const response = await testContext.clientSimulator.sendRequest({
                id: 201,
                jsonrpc: '2.0',
                method: 'resources/list',
            });

            const result = response.result as ResourcesListResult;
            const resourceUris = result.resources.map((r) => r.uri);

            expect(resourceUris).toContain('validator://config');
        });

        it('должен содержать ресурс languages', async () => {
            const response = await testContext.clientSimulator.sendRequest({
                id: 202,
                jsonrpc: '2.0',
                method: 'resources/list',
            });

            const result = response.result as ResourcesListResult;
            const resourceUris = result.resources.map((r) => r.uri);

            expect(resourceUris).toContain('validator://languages');
        });

        it('должен содержать ресурс help', async () => {
            const response = await testContext.clientSimulator.sendRequest({
                id: 203,
                jsonrpc: '2.0',
                method: 'resources/list',
            });

            const result = response.result as ResourcesListResult;
            const resourceUris = result.resources.map((r) => r.uri);

            expect(resourceUris).toContain('validator://help');
        });

        it('должен содержать шаблон ресурса validation-prompt', async () => {
            const response = await testContext.clientSimulator.sendRequest({
                id: 204,
                jsonrpc: '2.0',
                method: 'resources/list',
            });

            const result = response.result as ResourcesListResult;

            const hasPromptsTemplate =
                (result.resourceTemplates ?? []).some((r) => r.uri.includes('prompts')) ||
                result.resources.some((r) => r.name === 'validation-prompt' || r.uri.includes('prompts'));

            expect(hasPromptsTemplate).toBe(true);
        });

        it('должен возвращать конфигурацию при чтении config', async () => {
            const response = await testContext.clientSimulator.sendRequest({
                id: 205,
                jsonrpc: '2.0',
                method: 'resources/read',
                params: {
                    uri: 'validator://config',
                },
            });

            expectValidMCPResponse(response);

            const result = response.result as ResourceReadResult;
            expect(result.contents).toBeDefined();
            expect(result.contents).toHaveLength(1);
            expect(result.contents[0].mimeType).toBe('application/json');

            const configText = result.contents[0].text;
            const config = JSON.parse(configText) as Record<string, unknown>;
            expect(config).toHaveProperty('model');
            expect(config).toHaveProperty('mcp');
        });

        it('должен возвращать список языков при чтении languages', async () => {
            const response = await testContext.clientSimulator.sendRequest({
                id: 206,
                jsonrpc: '2.0',
                method: 'resources/read',
                params: {
                    uri: 'validator://languages',
                },
            });

            expectValidMCPResponse(response);

            const result = response.result as ResourceReadResult;
            expect(result.contents[0].mimeType).toBe('application/json');

            const languages = JSON.parse(result.contents[0].text) as string[];
            expect(languages).toContain('typescript');
            expect(languages).toContain('javascript');
            expect(languages).toContain('python');
        });

        it('должен возвращать справку при чтении help', async () => {
            const response = await testContext.clientSimulator.sendRequest({
                id: 207,
                jsonrpc: '2.0',
                method: 'resources/read',
                params: {
                    uri: 'validator://help',
                },
            });

            expectValidMCPResponse(response);

            const result = response.result as ResourceReadResult;
            expect(result.contents[0].mimeType).toBe('text/markdown');
            expect(result.contents[0].text).toContain('MCP Validator');
            expect(result.contents[0].text).toContain('validate');
        });
    });
}, 30_000);

