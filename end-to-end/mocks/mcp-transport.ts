import type { ChildProcess } from 'node:child_process';

import { APP_CONFIG } from '../../src/model/config/env-config';
import type { MCPRequest, MCPResponse } from '../types';

/** Конфигурация подключения к MCP серверу */
export type ConnectionConfig = {
    timeout: number;
    isE2ETest: boolean;
    environment: string;
};

/** Получает конфигурацию для подключения к MCP серверу */
export function getConnectionConfig(): ConnectionConfig {
    return {
        timeout: APP_CONFIG.validation.timeout,
        isE2ETest: APP_CONFIG.runtime.isE2ETest,
        environment: APP_CONFIG.runtime.environment,
    };
}

/** Создает транспорт для MCP соединения */
export function createMCPTransport() {
    let mcpProcess: ChildProcess | null = null;
    const responseCallbacks = new Map<number | string, (response: MCPResponse) => void>();

    /** Подключиться к MCP процессу */
    function connectToProcess(process: ChildProcess): void {
        mcpProcess = process;

        if (!process.stdout || !process.stdin) {
            throw new Error('MCP процесс не имеет stdio');
        }

        let buffer = '';
        process.stdout.on('data', (chunk: Buffer) => {
            buffer += chunk.toString();

            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (line.trim()) {
                    const trimmedLine = line.trim();
                    if (trimmedLine.startsWith('{') || trimmedLine.startsWith('[')) {
                        try {
                            const response = JSON.parse(trimmedLine) as MCPResponse;

                            let callback = responseCallbacks.get(response.id);

                            if (!callback && (response.id === undefined || response.id === null)) {
                                for (const [key, cb] of responseCallbacks.entries()) {
                                    if (typeof key === 'string' && key.startsWith('no-id-')) {
                                        callback = cb;
                                        responseCallbacks.delete(key);
                                        break;
                                    }
                                }
                            } else if (callback) {
                                responseCallbacks.delete(response.id);
                            }

                            if (callback) {
                                callback(response);
                            }
                        } catch {
                            // Игнорируем ошибки парсинга не-JSON строк
                        }
                    }
                }
            }
        });
    }

    /** Отправить запрос к MCP серверу */
    function sendRequest(request: MCPRequest): Promise<MCPResponse> {
        if (!mcpProcess || !mcpProcess.stdin) {
            return Promise.reject(new Error('MCP процесс не подключен'));
        }

        const config = getConnectionConfig();

        return new Promise((resolve, reject) => {
            const isInvalidRequest = !('jsonrpc' in request) || request.jsonrpc !== '2.0';
            const hasNoId = !('id' in request) || request.id === undefined || request.id === null;
            const timeout = isInvalidRequest || hasNoId ? 1000 : config.timeout;

            const callbackKey = request.id ?? `no-id-${Date.now()}`;
            responseCallbacks.set(callbackKey, resolve);

            const requestLine = `${JSON.stringify(request)}\n`;
            mcpProcess!.stdin!.write(requestLine);

            const timeoutId = setTimeout(() => {
                if (responseCallbacks.has(callbackKey)) {
                    responseCallbacks.delete(callbackKey);

                    if (isInvalidRequest || hasNoId) {
                        resolve({
                            error: {
                                code: -32600,
                                data: hasNoId ? 'Отсутствует ID запроса' : 'Некорректная структура JSON-RPC запроса',
                                message: 'Invalid Request',
                            },
                            id: request.id ?? null,
                            jsonrpc: '2.0',
                        } as MCPResponse);
                    } else {
                        reject(new Error(`Таймаут запроса ${request.id}`));
                    }
                }
            }, timeout);

            const originalCallback = responseCallbacks.get(callbackKey);
            responseCallbacks.set(callbackKey, (response) => {
                clearTimeout(timeoutId);
                if (originalCallback) originalCallback(response);
            });
        });
    }

    return {
        connectToProcess,
        sendRequest,
    };
}

