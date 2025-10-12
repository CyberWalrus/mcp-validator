import { info, warn } from '../../../lib/helpers/logger';
import { getHeartbeatManager, getRequestBuffer } from './initialize-mcp-server';

/** Состояние процесса завершения */
let isShuttingDown = false;

/** Очищает обработчики stdin */
function cleanupStdin(): Promise<void> {
    return new Promise((resolve) => {
        try {
            process.stdin.removeAllListeners('data');
            process.stdin.removeAllListeners('error');
            info('stdin обработчики очищены');
            resolve();
        } catch (err) {
            warn('Ошибка при очистке stdin', { error: err });
            resolve();
        }
    });
}

/** Очищает stability механизмы */
function cleanupStabilityMechanisms(): Promise<void> {
    return new Promise((resolve) => {
        try {
            // Останавливаем heartbeat
            const heartbeatManager = getHeartbeatManager();
            if (heartbeatManager) {
                heartbeatManager.stop();
            }

            // Очищаем request buffer
            const requestBuffer = getRequestBuffer();
            if (requestBuffer) {
                requestBuffer.clear();
            }

            info('Stability механизмы очищены');
            resolve();
        } catch (err) {
            warn('Ошибка при очистке stability механизмов', { error: err });
            resolve();
        }
    });
}

/** Сбрасывает логи */
function flushLogs(): Promise<void> {
    return new Promise((resolve) => {
        try {
            resolve();
        } catch (err) {
            warn('Ошибка при сбросе логов', { error: err });
            resolve();
        }
    });
}

/** Корректно завершает работу MCP сервера */
export function shutdownMCPServer(exitCode: number = 0): Promise<number> {
    return new Promise((resolve) => {
        if (isShuttingDown) {
            warn('Процесс завершения уже запущен');
            resolve(exitCode);

            return;
        }

        isShuttingDown = true;

        info('Начинаю корректное завершение MCP сервера', { exitCode });

        const cleanupTasks = [cleanupStdin(), cleanupStabilityMechanisms(), flushLogs()];

        Promise.allSettled(cleanupTasks)
            .then(() => {
                info('MCP сервер корректно завершен');
                resolve(exitCode);

                setTimeout(() => {
                    process.exit(exitCode);
                }, 1000);
            })
            .catch((err: unknown) => {
                warn('Ошибки при завершении работы', { error: err });
                resolve(1); // При ошибке возвращаем код 1
                process.exit(1);
            });
    });
}

/** Проверяет, выполняется ли процесс завершения */
export function isShutdownInProgress(): boolean {
    return isShuttingDown;
}

/** Сбрасывает состояние для тестов */
// eslint-disable-next-line no-underscore-dangle
export function _resetShutdownState(): void {
    isShuttingDown = false;
}
