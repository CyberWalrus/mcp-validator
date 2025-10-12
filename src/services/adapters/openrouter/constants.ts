/** Константы для OpenRouter API клиента */

/** Модель по умолчанию */
export const DEFAULT_MODEL = process.env['DEFAULT_AI_MODEL'] || 'openai/gpt-oss-120b';

/** Максимальное количество токенов по умолчанию */
export const DEFAULT_MAX_TOKENS = 100000;

/** Температура по умолчанию */
export const DEFAULT_TEMPERATURE = 0.5;

/** Timeout по умолчанию в миллисекундах */
export const DEFAULT_TIMEOUT = Number(process.env['VALIDATION_TIMEOUT']) || 30000;

/** Headers по умолчанию */
export const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    'HTTP-Referer': 'https://github.com/mcp-chat-validator',
    'X-Title': 'MCP Chat Validator',
} as const;
