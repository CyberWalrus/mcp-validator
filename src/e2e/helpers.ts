import type { ChildProcess } from 'node:child_process';
import { spawn } from 'node:child_process';
import { join } from 'node:path';

import { MCPClientSimulator } from './mocks/mcp-client-simulator';
import { MockOpenRouterAPI } from './mocks/openrouter-api-mocks';
import { clearMockResponses } from './mocks/openrouter-test-client';
import { TEST_TIMEOUTS } from './constants';
import type { E2ETestContext } from './types';

/** Динамическое ожидание готовности MCP сервера */
async function waitForServerReady(mcpProcess: ChildProcess): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error('Таймаут ожидания готовности MCP сервера'));
        }, TEST_TIMEOUTS.SERVER_STARTUP);

        let serverOutput = '';
        const startTime = Date.now();

        const onData = (chunk: Buffer): void => {
            serverOutput += chunk.toString();

            // MCP сервер готов, когда начинает слушать stdin
            // Проверяем на наличие типичных индикаторов готовности
            if (
                serverOutput.includes('MCP') ||
                serverOutput.includes('server') ||
                serverOutput.includes('listening') ||
                serverOutput.includes('ready') ||
                // Или если нет ошибок в течение быстрого интервала после запуска
                (serverOutput.length === 0 && Date.now() - startTime > TEST_TIMEOUTS.SERVER_READY_FAST)
            ) {
                clearTimeout(timeout);
                mcpProcess.stdout?.off('data', onData);
                mcpProcess.stderr?.off('data', onData);
                resolve();
            }
        };

        const onError = (error: Error): void => {
            clearTimeout(timeout);
            reject(new Error(`Ошибка запуска MCP сервера: ${error.message}`));
        };

        // Слушаем вывод сервера
        mcpProcess.stdout?.on('data', onData);
        mcpProcess.stderr?.on('data', onData);
        mcpProcess.on('error', onError);

        // Если через быстрый интервал нет явных ошибок, считаем сервер готовым
        setTimeout(() => {
            if (!timeout) {
                return; // Уже resolved/rejected
            }

            clearTimeout(timeout);
            mcpProcess.stdout?.off('data', onData);
            mcpProcess.stderr?.off('data', onData);
            mcpProcess.off('error', onError);
            resolve();
        }, TEST_TIMEOUTS.SERVER_READY_FAST);
    });
}

/** Настраивает окружение для E2E тестирования */
export async function setupE2EEnvironment(): Promise<E2ETestContext> {
    // Очищаем предыдущие моки
    clearMockResponses();

    // Путь к основному файлу MCP сервера
    const mcpServerPath = join(process.cwd(), 'src', 'index.ts');

    // Запускаем MCP сервер в тестовом режиме
    const mcpProcess = spawn('tsx', [mcpServerPath], {
        cwd: process.cwd(),
        env: {
            ...process.env,
            MCP_E2E_TEST: 'true',
            NODE_ENV: 'test',
            OPENROUTER_API_KEY: 'test-key-for-e2e', // Фиктивный ключ для тестов
        },
        stdio: ['pipe', 'pipe', 'pipe'],
    });

    if (!mcpProcess.pid) {
        throw new Error('Не удалось запустить MCP сервер');
    }

    // Динамическое ожидание готовности сервера
    await waitForServerReady(mcpProcess);

    // Создаем симулятор клиента и подключаем к процессу
    const clientSimulator = new MCPClientSimulator();
    clientSimulator.connectToProcess(mcpProcess);

    // Создаем мок API
    const mockOpenRouter = new MockOpenRouterAPI();

    // Функция очистки
    const cleanup = async (): Promise<void> => {
        if (mcpProcess && mcpProcess.pid && !mcpProcess.killed) {
            mcpProcess.kill('SIGTERM');

            // Ждем завершения процесса
            await new Promise((resolve) => {
                mcpProcess.on('exit', resolve);
                setTimeout(() => {
                    if (!mcpProcess.killed) {
                        mcpProcess.kill('SIGKILL');
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

/** Очищает ресурсы после E2E тестирования */
export async function cleanupE2EEnvironment(context: E2ETestContext): Promise<void> {
    await context.cleanup();
}
