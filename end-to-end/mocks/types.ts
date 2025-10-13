/** Конфигурация подключения к MCP серверу */
export type ConnectionConfig = {
    timeout: number;
    isE2ETest: boolean;
    environment: string;
};
