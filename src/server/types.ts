/** Ответ MCP инструмента */
export type ToolResponse = {
    /** Содержимое ответа */
    content: Array<{ text: string; type: 'text' }>;
    /** Флаг ошибки */
    isError: boolean;
};
