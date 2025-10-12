import type { ChildProcess } from 'node:child_process';

/** Контекст E2E тестирования */
export type E2ETestContext = {
    /** Функция очистки ресурсов */
    cleanup: () => Promise<void>;
    /** Симулятор клиента MCP */
    clientSimulator: MCPClientSimulator;
    /** MCP процесс */
    mcpProcess: ChildProcess;
    /** Мок OpenRouter API */
    mockOpenRouter: MockOpenRouterAPI;
};

/** Ответ OpenRouter API (замоканный) */
export type MockedOpenRouterResponse = {
    /** Варианты ответа */
    readonly choices: ReadonlyArray<{
        /** Сообщение ответа */
        readonly message: {
            /** Содержимое ответа */
            readonly content: string;
        };
    }>;
    /** Модель AI */
    readonly model: string;
    /** Статистика использования */
    readonly usage: {
        /** Общее количество токенов */
        readonly total_tokens: number;
    };
};

/** Клиент для тестирования MCP */
export type MCPTestClient = {
    /** Вызвать инструмент */
    callTool: (name: string, args: unknown) => Promise<ToolCallResponse>;
    /** Инициализировать соединение */
    initialize: (clientInfo: ClientInfo) => Promise<InitializeResponse>;
    /** Получить список инструментов */
    listTools: () => Promise<ToolsListResponse>;
    /** Отправить запрос */
    sendRequest: (request: MCPRequest) => Promise<MCPResponse>;
};

/** Симулятор MCP клиента */
export type MCPClientSimulator = MCPTestClient;

/** Мок OpenRouter API */
export type MockOpenRouterAPI = {
    /** Настроить ответ для запроса */
    mockResponse: (response: MockedOpenRouterResponse) => void;
    /** Сбросить моки */
    reset: () => void;
};

/** Базовый MCP запрос */
export type MCPRequest = {
    /** Идентификатор */
    id: number | string;
    /** Версия JSON-RPC */
    jsonrpc: '2.0';
    /** Метод */
    method: string;
    /** Параметры */
    params?: unknown;
};

/** Базовый MCP ответ */
export type MCPResponse = {
    /** Идентификатор */
    id: number | string;
    /** Версия JSON-RPC */
    jsonrpc: '2.0';
    /** Ошибка */
    error?: unknown;
    /** Результат */
    result?: unknown;
};

/** Информация о клиенте */
export type ClientInfo = {
    /** Название клиента */
    name: string;
    /** Версия клиента */
    version: string;
};

/** Ответ инициализации */
export type InitializeResponse = MCPResponse & {
    /** Результат инициализации */
    result: {
        /** Возможности сервера */
        capabilities: Record<string, unknown>;
        /** Версия протокола */
        protocolVersion: string;
        /** Информация о сервере */
        serverInfo: {
            name: string;
            version: string;
        };
    };
};

/** Ответ вызова инструмента */
export type ToolCallResponse = MCPResponse;

/** Ответ списка инструментов */
export type ToolsListResponse = MCPResponse;
