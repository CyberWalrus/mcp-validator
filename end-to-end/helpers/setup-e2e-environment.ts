import { spawn } from 'node:child_process';
import { join } from 'node:path';

import { forceKillProcess } from '../../src/lib/helpers/force-kill-process';
import { killProcess } from '../../src/lib/helpers/kill-process';
import { TEST_TIMEOUTS } from '../constants';
import { createMcpClientSimulator } from '../mocks/mcp-client-simulator';
import { MockOpenRouterAPI } from '../mocks/openrouter-api-mocks';
import { clearMockResponses } from '../mocks/openrouter-test-client';
import type { E2ETestContext } from '../types';
import { waitForServerReady } from './wait-for-server-ready';

/** Настраивает окружение для E2E тестирования */
export async function setupE2EEnvironment(): Promise<E2ETestContext> {
    clearMockResponses();

    const mcpServerPath = join(process.cwd(), 'src', 'index.ts');

    const mcpProcess = spawn('tsx', [mcpServerPath], {
        cwd: process.cwd(),
        env: {
            ...process.env,
            MCP_E2E_TEST: 'true',
            NODE_ENV: 'test',
            API_KEY: 'test-key-for-e2e',
        },
        shell: process.platform === 'win32',
        stdio: ['pipe', 'pipe', 'pipe'],
    });

    if (mcpProcess.pid == null) {
        throw new Error('Не удалось запустить MCP сервер');
    }

    await waitForServerReady(mcpProcess);

    const clientSimulator = createMcpClientSimulator();
    clientSimulator.connectToProcess(mcpProcess);

    const mockOpenRouter = new MockOpenRouterAPI();

    const cleanup = async (): Promise<void> => {
        if (mcpProcess && mcpProcess.pid && !mcpProcess.killed) {
            killProcess(mcpProcess);

            await new Promise((resolve) => {
                mcpProcess.on('exit', resolve);
                setTimeout(() => {
                    if (!mcpProcess.killed) {
                        forceKillProcess(mcpProcess);
                    }
                    resolve(undefined);
                }, TEST_TIMEOUTS.CLEANUP);
            });
        }
    };

    return {
        cleanup,
        clientSimulator,
        mcpProcess,
        mockOpenRouter,
    };
}
