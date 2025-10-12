/* eslint-disable sonarjs/cognitive-complexity, curly, nonblock-statement-body-position */
import type { ChildProcess } from 'node:child_process';

import type {
    ClientInfo,
    InitializeResponse,
    MCPRequest,
    MCPResponse,
    MCPTestClient,
    ToolCallResponse,
    ToolsListResponse,
} from '../types';

/** Симулятор MCP клиента для тестирования */
export class MCPClientSimulator implements MCPTestClient {
    private requestId = 1;

    private mcpProcess: ChildProcess | null = null;

    private responseCallbacks = new Map<number | string, (response: MCPResponse) => void>();

    /** Подключиться к MCP процессу */
    public connectToProcess(process: ChildProcess): void {
        this.mcpProcess = process;

        if (!process.stdout || !process.stdin) {
            throw new Error('MCP процесс не имеет stdio');
        }

        // Настраиваем чтение ответов
        let buffer = '';
        process.stdout.on('data', (chunk: Buffer) => {
            buffer += chunk.toString();

            // Пытаемся распарсить JSON строки
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (line.trim()) {
                    // Проверяем, что строка начинается с { или [, чтобы избежать парсинга логов
                    const trimmedLine = line.trim();
                    if (trimmedLine.startsWith('{') || trimmedLine.startsWith('[')) {
                        try {
                            const response = JSON.parse(trimmedLine) as MCPResponse;

                            // ИСПРАВЛЕНИЕ: Ищем callback по ID ответа или по всем ключам без ID
                            let callback = this.responseCallbacks.get(response.id);

                            if (!callback && (response.id === undefined || response.id === null)) {
                                // Для ответов без ID ищем callback среди no-id ключей
                                for (const [key, cb] of this.responseCallbacks.entries()) {
                                    if (typeof key === 'string' && key.startsWith('no-id-')) {
                                        callback = cb;
                                        this.responseCallbacks.delete(key);
                                        break;
                                    }
                                }
                            } else if (callback) {
                                this.responseCallbacks.delete(response.id);
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
    public sendRequest(request: MCPRequest): Promise<MCPResponse> {
        if (!this.mcpProcess || !this.mcpProcess.stdin) {
            return Promise.reject(new Error('MCP процесс не подключен'));
        }

        return new Promise((resolve, reject) => {
            // Для некорректных запросов (без jsonrpc) используем короткий таймаут
            const isInvalidRequest = !('jsonrpc' in request) || request.jsonrpc !== '2.0';
            // ИСПРАВЛЕНИЕ: Обрабатываем запросы без ID
            const hasNoId = !('id' in request) || request.id === undefined || request.id === null;
            const timeout = isInvalidRequest || hasNoId ? 1000 : 3000; // Быстрые таймауты для некорректных

            // Регистрируем callback для ответа (используем уникальный ключ для запросов без ID)
            const callbackKey = request.id ?? `no-id-${Date.now()}`;
            this.responseCallbacks.set(callbackKey, resolve);

            // Отправляем запрос
            const requestLine = `${JSON.stringify(request)}\n`;
            this.mcpProcess!.stdin!.write(requestLine);

            // Таймаут для запроса (сокращен для быстродействия)
            const timeoutId = setTimeout(() => {
                if (this.responseCallbacks.has(callbackKey)) {
                    this.responseCallbacks.delete(callbackKey);

                    if (isInvalidRequest || hasNoId) {
                        // Для некорректных запросов возвращаем стандартную JSON-RPC ошибку
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

            // Очищаем таймаут при получении ответа
            const originalCallback = this.responseCallbacks.get(callbackKey);
            this.responseCallbacks.set(callbackKey, (response) => {
                clearTimeout(timeoutId);
                if (originalCallback) originalCallback(response);
            });
        });
    }

    /** Инициализировать соединение с MCP сервером */
    public async initialize(clientInfo: ClientInfo): Promise<InitializeResponse> {
        const request: MCPRequest = {
            id: this.requestId++,
            jsonrpc: '2.0',
            method: 'initialize',
            params: {
                capabilities: {},
                clientInfo,
                protocolVersion: '2024-11-05',
            },
        };

        const response = await this.sendRequest(request);

        return response as InitializeResponse;
    }

    /** Вызвать инструмент MCP сервера */
    public async callTool(name: string, args: unknown): Promise<ToolCallResponse> {
        const request: MCPRequest = {
            id: this.requestId++,
            jsonrpc: '2.0',
            method: 'tools/call',
            params: {
                arguments: args,
                name,
            },
        };

        return this.sendRequest(request);
    }

    /** Получить список доступных инструментов */
    public async listTools(): Promise<ToolsListResponse> {
        const request: MCPRequest = {
            id: this.requestId++,
            jsonrpc: '2.0',
            method: 'tools/list',
        };

        return this.sendRequest(request);
    }
}

/** Симулирует подключение Cursor к MCP серверу */
export function simulateCursorConnection(): Promise<MCPClientSimulator> {
    // TODO: Запустить MCP сервер и подключиться к нему

    return Promise.resolve(new MCPClientSimulator());
}
