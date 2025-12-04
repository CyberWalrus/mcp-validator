/** Константы для MCP ресурсов валидатора */

/** Поддерживаемые языки программирования для валидации */
export const SUPPORTED_LANGUAGES = [
    'typescript',
    'javascript',
    'go',
    'python',
    'rust',
    'java',
    'csharp',
    'php',
    'ruby',
    'swift',
    'kotlin',
] as const;

/** Типы валидации */
export const VALIDATION_TYPES = ['architecture', 'code', 'documentation', 'prompts', 'tests'] as const;

/** URI схемы для ресурсов валидатора */
export const RESOURCE_URI = {
    CONFIG: 'validator://config',
    HELP: 'validator://help',
    LANGUAGES: 'validator://languages',
    PROMPTS_TEMPLATE: 'validator://prompts/{type}',
} as const;

/** Названия ресурсов */
export const RESOURCE_NAMES = {
    CONFIG: 'config',
    HELP: 'help',
    LANGUAGES: 'languages',
    VALIDATION_PROMPT: 'validation-prompt',
} as const;
