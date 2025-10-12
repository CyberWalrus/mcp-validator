/** MCP JSON-RPC 2.0 базовые типы */

/** Базовый JSON-RPC запрос */
export type JSONRPCRequest = {
    /** Идентификатор запроса */
    id: number | string;
    /** Версия протокола JSON-RPC */
    jsonrpc: '2.0';
    /** Метод вызова */
    method: string;
    /** Параметры запроса */
    params?: unknown;
};

/** Базовый JSON-RPC ответ */
export type JSONRPCResponse = {
    /** Идентификатор запроса */
    id: number | string;
    /** Версия протокола JSON-RPC */
    jsonrpc: '2.0';
    /** Ошибка операции */
    error?: JSONRPCError;
    /** Результат операции */
    result?: unknown;
};

/** Ошибка JSON-RPC */
export type JSONRPCError = {
    /** Код ошибки */
    code: number;
    /** Сообщение об ошибке */
    message: string;
    /** Дополнительные данные ошибки */
    data?: unknown;
};

/** MCP Initialize запрос */
export type MCPInitializeRequest = JSONRPCRequest & {
    method: 'initialize';
    params: {
        /** Возможности клиента */
        capabilities: Record<string, unknown>;
        /** Информация о клиенте */
        clientInfo: {
            name: string;
            version: string;
        };
        /** Версия протокола MCP */
        protocolVersion: string;
    };
};

/** MCP Initialize ответ */
export type MCPInitializeResponse = {
    /** Возможности сервера */
    capabilities: {
        /** Доступные инструменты */
        tools?: Record<string, MCPToolDefinition>;
    };
    /** Версия протокола MCP */
    protocolVersion: string;
    /** Информация о сервере */
    serverInfo: {
        name: string;
        version: string;
    };
};

/** Определение MCP инструмента */
export type MCPToolDefinition = {
    /** Описание инструмента */
    description: string;
    /** Схема входных параметров */
    inputSchema: {
        properties: Record<string, unknown>;
        type: 'object';
        required?: string[];
    };
};

/** MCP Tools/Call запрос */
export type MCPToolCallRequest = JSONRPCRequest & {
    method: 'tools/call';
    params: {
        /** Аргументы инструмента */
        arguments: Record<string, unknown>;
        /** Имя инструмента */
        name: string;
    };
};

/** MCP Tool результат */
export type MCPToolResult = {
    /** Контент ответа */
    content: Array<{
        /** Текстовое содержимое */
        text: string;
        /** Тип контента */
        type: 'text';
    }>;
};

/** Объединенный тип MCP запросов */
export type MCPRequest = JSONRPCRequest | MCPInitializeRequest | MCPToolCallRequest;

/** Информация о сервере MCP */
export type MCPServerInfo = {
    /** Имя сервера */
    name: string;
    /** Время запуска */
    startTime: Date;
    /** Статус сервера */
    status: 'error' | 'initializing' | 'ready';
    /** Версия сервера */
    version: string;
};
