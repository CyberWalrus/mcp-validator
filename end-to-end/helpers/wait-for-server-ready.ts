import type { ChildProcess } from 'node:child_process';

import { TEST_TIMEOUTS } from '../constants';

/** Ожидание готовности сервера */
export async function waitForServerReady(mcpProcess: ChildProcess): Promise<void> {
    return new Promise((resolve, reject) => {
        let output = '';
        let errorOutput = '';

        const timeout = setTimeout(() => {
            reject(new Error('Таймаут ожидания готовности сервера'));
        }, TEST_TIMEOUTS.SERVER_READY_FAST);

        const handlers = {
            onData: (data: Buffer) => {
                output += data.toString();
                // Сервер пишет в stderr, так что проверяем output и errorOutput
                if (
                    output.includes('готов к работе') ||
                    errorOutput.includes('готов к работе') ||
                    output.includes('Server ready')
                ) {
                    clearTimeout(timeout);
                    mcpProcess.stdout?.off('data', handlers.onData);
                    mcpProcess.stderr?.off('data', handlers.onError);
                    resolve();
                }
            },
            onError: (data: Buffer) => {
                errorOutput += data.toString();
                // Проверяем готовность сервера в stderr (где info() выводит логи)
                if (errorOutput.includes('готов к работе') || errorOutput.includes('Server ready')) {
                    clearTimeout(timeout);
                    mcpProcess.stdout?.off('data', handlers.onData);
                    mcpProcess.stderr?.off('data', handlers.onError);
                    resolve();
                }
                // Только критические ошибки прерывают запуск
                if (errorOutput.includes('💥 Критическая ошибка') || errorOutput.includes('Failed')) {
                    clearTimeout(timeout);
                    mcpProcess.stdout?.off('data', handlers.onData);
                    mcpProcess.stderr?.off('data', handlers.onError);
                    reject(new Error(`Ошибка запуска сервера: ${errorOutput}`));
                }
            },
        };

        mcpProcess.stdout?.on('data', handlers.onData);
        mcpProcess.stderr?.on('data', handlers.onError);
    });
}
