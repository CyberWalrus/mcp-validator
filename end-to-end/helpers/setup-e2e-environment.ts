import { spawn } from 'node:child_process';
import { join } from 'node:path';

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

    if (mcpProcess.pid === null || mcpProcess.pid === undefined) {
        throw new Error('Не удалось запустить MCP сервер');
    }

    /** Очищает ресурсы процесса MCP сервера */
    const cleanup = async (): Promise<void> => {
        if (mcpProcess && mcpProcess.pid && !mcpProcess.killed) {
            try {
                mcpProcess.kill('SIGTERM');
            } catch {
                // eslint-disable-next-line no-empty
            }

            await new Promise((resolve) => {
                mcpProcess.on('exit', resolve);
                setTimeout(() => {
                    if (!mcpProcess.killed && mcpProcess.pid) {
                        try {
                            mcpProcess.kill('SIGKILL');
                        } catch {
                            // eslint-disable-next-line no-empty
                        }
                    }
                    resolve(undefined);
                }, TEST_TIMEOUTS.CLEANUP);
            });
        }
    };

    try {
        await waitForServerReady(mcpProcess);
    } catch (error) {
        await cleanup();
        throw error;
    }

    const clientSimulator = createMcpClientSimulator();
    clientSimulator.connectToProcess(mcpProcess);

    const mockOpenRouter = new MockOpenRouterAPI();

    return {
        cleanup,
        clientSimulator,
        mcpProcess,
        mockOpenRouter,
    };
}
