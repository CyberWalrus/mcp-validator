import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';

import { getPrompt } from '../../lib/cache';
import { APP_CONFIG } from '../../model/config';
import { RESOURCE_NAMES, RESOURCE_URI, SUPPORTED_LANGUAGES, VALIDATION_TYPES } from './constants';
import type { ResourceReadResult } from './types';

/** Создает JSON контент для ресурса */
function createJsonContent(uri: string, data: unknown): ResourceReadResult {
    return {
        contents: [
            {
                mimeType: 'application/json',
                text: JSON.stringify(data, null, 2),
                uri,
            },
        ],
    };
}

/** Создает Markdown контент для ресурса */
function createMarkdownContent(uri: string, text: string): ResourceReadResult {
    return {
        contents: [
            {
                mimeType: 'text/markdown',
                text,
                uri,
            },
        ],
    };
}

/** Регистрирует статический ресурс конфигурации */
function registerConfigResource(server: McpServer): void {
    server.registerResource(
        RESOURCE_NAMES.CONFIG,
        RESOURCE_URI.CONFIG,
        {
            description: 'Текущие настройки AI модели, таймаутов и MCP сервера',
            mimeType: 'application/json',
            title: 'Конфигурация валидатора',
        },
        (uri) =>
            Promise.resolve(
                createJsonContent(uri.href, {
                    mcp: APP_CONFIG.mcp,
                    model: APP_CONFIG.model,
                    timeouts: APP_CONFIG.timeouts,
                }),
            ),
    );
}

/** Регистрирует динамический ресурс промптов валидации */
function registerPromptsResource(server: McpServer): void {
    server.registerResource(
        RESOURCE_NAMES.VALIDATION_PROMPT,
        new ResourceTemplate(RESOURCE_URI.PROMPTS_TEMPLATE, {
            complete: {
                type: (value) => VALIDATION_TYPES.filter((t) => t.startsWith(value)),
            },
            list: () =>
                Promise.resolve({
                    resources: VALIDATION_TYPES.map((type) => ({
                        name: `Промпт валидации ${type}`,
                        uri: `validator://prompts/${type}`,
                    })),
                }),
        }),
        {
            description: 'Содержимое промпта для конкретного типа валидации',
            mimeType: 'text/markdown',
            title: 'Промпт валидации',
        },
        (uri, params) => {
            const type = params.type as string | undefined;

            if (type === undefined || type === null || type === '') {
                return Promise.resolve(createMarkdownContent(uri.href, 'Не указан тип промпта'));
            }

            const promptId = `validate-${type}.md`;

            try {
                const promptContent = getPrompt(promptId);

                return Promise.resolve(createMarkdownContent(uri.href, promptContent));
            } catch {
                return Promise.resolve(createMarkdownContent(uri.href, `Промпт для типа "${type}" не найден`));
            }
        },
    );
}

/** Регистрирует статический ресурс поддерживаемых языков */
function registerLanguagesResource(server: McpServer): void {
    server.registerResource(
        RESOURCE_NAMES.LANGUAGES,
        RESOURCE_URI.LANGUAGES,
        {
            description: 'Список языков программирования для валидации',
            mimeType: 'application/json',
            title: 'Поддерживаемые языки',
        },
        (uri) => Promise.resolve(createJsonContent(uri.href, SUPPORTED_LANGUAGES)),
    );
}

/** Создает текст справки по инструментам */
function createHelpText(): string {
    return `# MCP Validator — Справка

## Инструменты

### validate
Универсальная валидация кода, тестов, архитектуры.

**Параметры:**
- \`validationType\`: code | tests | architecture | prompts | documentation
- \`input.type\`: file | content | url
- \`input.data\`: путь к файлу или содержимое
- \`language\`: язык программирования (по умолчанию: typescript)

### test-prompt
Тестирование промпта на консистентность (3-10 итераций).

**Параметры:**
- \`prompt\`: текст промпта
- \`iterations\`: количество итераций (по умолчанию: 5)

### verify-info
Проверка информации через 3 параллельные AI проверки.

**Параметры:**
- \`input.type\`: content | file
- \`input.data\`: текст или путь к файлу
`;
}

/** Регистрирует статический ресурс справки */
function registerHelpResource(server: McpServer): void {
    server.registerResource(
        RESOURCE_NAMES.HELP,
        RESOURCE_URI.HELP,
        {
            description: 'Документация по использованию инструментов валидатора',
            mimeType: 'text/markdown',
            title: 'Справка по инструментам',
        },
        (uri) => Promise.resolve(createMarkdownContent(uri.href, createHelpText())),
    );
}

/** Регистрирует все ресурсы валидатора */
export function registerValidatorResources(server: McpServer): void {
    registerConfigResource(server);
    registerPromptsResource(server);
    registerLanguagesResource(server);
    registerHelpResource(server);
}
