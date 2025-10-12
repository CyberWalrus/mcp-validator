import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { cleanupE2EEnvironment, setupE2EEnvironment } from './helpers';
import type { E2ETestContext } from './types';

describe('E2E: Инициализация MCP сервера', () => {
    let testContext: E2ETestContext;

    // Один запуск сервера для всех тестов инициализации
    beforeAll(async () => {
        testContext = await setupE2EEnvironment();
    });

    afterAll(async () => {
        await cleanupE2EEnvironment(testContext);
    });

    it('должен успешно запускать MCP сервер', () => {
        expect(testContext.mcpProcess).toBeDefined();
        expect(testContext.mcpProcess.pid).toBeGreaterThan(0);
        expect(testContext.clientSimulator).toBeDefined();
    });

    it('должен успешно инициализировать соединение с Cursor', async () => {
        const response = await testContext.clientSimulator.initialize({
            name: 'cursor',
            version: '2.0.0',
        });

        expect(response.jsonrpc).toBe('2.0');
        expect(response.result).toBeDefined();
        expect(response.result.protocolVersion).toBeDefined();
        expect(response.result.serverInfo).toBeDefined();
        expect(response.result.serverInfo.name).toBe('mcp-validator');
    });

    it('должен возвращать правильные capabilities', async () => {
        const response = await testContext.clientSimulator.initialize({
            name: 'cursor',
            version: '2.0.0',
        });

        expect(response.result.capabilities).toBeDefined();
        expect(response.result.capabilities.tools).toBeDefined();
    });

    it('должен возвращать список доступных инструментов', async () => {
        await testContext.clientSimulator.initialize({
            name: 'cursor',
            version: '2.0.0',
        });

        const toolsResponse = await testContext.clientSimulator.listTools();

        expect(toolsResponse.jsonrpc).toBe('2.0');
        expect(toolsResponse.result).toBeDefined();

        const tools = toolsResponse.result as { tools: unknown[] };
        expect(Array.isArray(tools.tools)).toBe(true);
        expect(tools.tools.length).toBeGreaterThan(0);

        // Проверяем что есть основные инструменты
        const toolNames = tools.tools.map((tool: unknown) => (tool as { name: string }).name);
        expect(toolNames).toContain('validate');
        expect(toolNames).toContain('test-prompt');
    });
}, 10000); // Уменьшенный таймаут после оптимизации
