/** Тип транспорта для MCP сервера */
export type TransportType = 'http' | 'stdio';

/** Конфигурация HTTP транспорта */
export type HttpTransportConfig = {
    /** Порт для HTTP сервера */
    port: number;
    /** Хост для HTTP сервера */
    host?: string;
};
