/** Константы для OpenRouter API клиента */

/** Максимальное количество токенов по умолчанию */
export const DEFAULT_MAX_TOKENS = 100000;

/** Температура по умолчанию */
export const DEFAULT_TEMPERATURE = 0.5;

/** Headers по умолчанию */
export const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    'HTTP-Referer': 'https://github.com/mcp-chat-validator',
    'X-Title': 'MCP Chat Validator',
} as const;
