import { error, info, warn } from '../../../lib/helpers/logger';
import { getPackageVersion } from '../../../lib/helpers/version-resolver';
import { APP_CONFIG, getAppConfigError } from '../../../model/config';
import { HeartbeatManager } from './stability/heartbeat';
import { RequestBuffer } from './stability/request-buffer';
import { handleMCPRequest } from './handle-mcp-request';
import type { MCPRequest, MCPServerInfo } from './types';

/** Текущая информация о сервере MCP */
let serverInfo: MCPServerInfo = {
    name: 'mcp-validator',
    startTime: new Date(),
    status: 'initializing',
    version: getPackageVersion(),
};

/** Глобальные экземпляры для stability механизмов */
let requestBuffer: RequestBuffer | null = null;
let heartbeatManager: HeartbeatManager | null = null;

/** Обрабатывает входные данные из stdin с буферизацией */
function handleStdinData(data: Buffer): void {
    try {
        const input = data.toString();
        if (!input) {
            return;
        }

        // Используем буферизацию для корректной обработки JSON
        if (requestBuffer) {
            requestBuffer.processData(input, (request: MCPRequest) => {
                handleMCPRequest(request)
                    .then((response) => {
                        process.stdout.write(`${JSON.stringify(response)}\n`);
                    })
                    .catch((err: unknown) => {
                        error('Ошибка обработки MCP запроса', { error: err });
                        // НЕ завершаем процесс при ошибке обработки запроса
                    });
            });
        }
    } catch (err) {
        error('Ошибка обработки stdin данных', { error: err });
        // НЕ завершаем процесс при ошибке stdin
    }
}

/** Обрабатывает ошибки stdin */
function handleStdinError(err: Error): void {
    error('Ошибка чтения из stdin', { error: err });

    // Не завершаем процесс при ошибках stdin - продолжаем работу
    // Логируем ошибку для диагностики, но сервер остается активным
}

/** Инициализирует MCP сервер для работы через stdio */
export function initializeMCPServer(): MCPServerInfo {
    try {
        info('Инициализация MCP сервера');

        const configError = getAppConfigError();

        if (!APP_CONFIG || configError) {
            const message = configError?.message ?? 'Конфигурация приложения недоступна';
            const missing: string[] = [];

            if (message.includes('OPENROUTER_API_KEY')) {
                missing.push('OPENROUTER_API_KEY');
            }

            if (missing.length > 0) {
                warn('Отсутствуют обязательные переменные окружения', { missing });
            } else {
                warn('Конфигурация окружения недоступна', { error: message });
            }
        }

        // Инициализируем stability механизмы
        requestBuffer = new RequestBuffer();
        heartbeatManager = new HeartbeatManager();

        process.stdin.setEncoding('utf8');
        process.stdin.on('data', handleStdinData);
        process.stdin.on('error', handleStdinError);

        // Signal handlers убраны - обрабатываются в main index.ts
        // для предотвращения дублирования и конфликтов

        // Запускаем heartbeat для поддержания соединения
        heartbeatManager.start();

        serverInfo = {
            ...serverInfo,
            status: 'ready',
        };

        info('MCP сервер успешно инициализирован', {
            bufferingEnabled: true,
            heartbeatEnabled: true,
            startTime: serverInfo.startTime.toISOString(),
        });

        return serverInfo;
    } catch (err) {
        error('Ошибка инициализации MCP сервера', { error: err });

        serverInfo = {
            ...serverInfo,
            status: 'error',
        };

        throw new Error(`Ошибка инициализации MCP сервера: ${String(err)}`);
    }
}

/** Получает текущую информацию о сервере */
export function getMCPServerInfo(): MCPServerInfo {
    return { ...serverInfo };
}

/** Получает экземпляр request buffer для внешнего использования */
export function getRequestBuffer(): RequestBuffer | null {
    return requestBuffer;
}

/** Получает экземпляр heartbeat manager для внешнего использования */
export function getHeartbeatManager(): HeartbeatManager | null {
    return heartbeatManager;
}
