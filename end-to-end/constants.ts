/** Оптимизированные таймауты для E2E тестов */
export const TEST_TIMEOUTS = {
    /** Таймаут очистки ресурсов (сокращено с 2000мс) */
    CLEANUP: 1000,

    /** Таймаут выполнения команды */
    COMMAND_EXECUTION: 5000,

    /** Быстрое ожидание готовности сервера (обычно 100-500мс, на Windows может быть медленнее) */
    SERVER_READY_FAST: process.platform === 'win32' ? 10_000 : 2000,

    /** Максимальный таймаут инициализации сервера (используется как fallback) */
    SERVER_STARTUP: 5000,
} as const;

/** Готовые ответы API для моков */
export const MOCK_API_RESPONSES = {
    /** Успешная валидация кода */
    CODE_VALIDATION_SUCCESS: {
        choices: [
            {
                message: {
                    content: 'Код выглядит хорошо. Никаких критических проблем не обнаружено.',
                },
            },
        ],
        model: 'gpt-4',
        usage: {
            total_tokens: 150,
        },
        provider: 'OpenAI',
        totalCost: '0.0015',
    },
    /** Валидация с предупреждениями */
    CODE_VALIDATION_WARNING: {
        choices: [
            {
                message: {
                    content:
                        'Код имеет несколько предупреждений: отсутствуют JSDoc комментарии, можно улучшить типизацию.',
                },
            },
        ],
        model: 'gpt-4',
        usage: {
            total_tokens: 200,
        },
        provider: 'Anthropic',
        totalCost: '0.0020',
    },
    /** Успешное выполнение промпта */
    PROMPT_TEST_SUCCESS: {
        choices: [
            {
                message: {
                    content: 'Промпт работает корректно и дает консистентные результаты.',
                },
            },
        ],
        model: 'gpt-4',
        usage: {
            total_tokens: 100,
        },
        provider: 'Cerebras',
        totalCost: '0.0010',
    },
} as const;

/** Сценарии тестирования */
export const TEST_SCENARIOS = {
    /** Тестирование промпта */
    TEST_PROMPT: {
        arguments: {
            iterations: 3,
            prompt: 'Напиши короткое приветствие',
        },
        name: 'test-prompt',
    },

    /** Валидация архитектуры */
    VALIDATE_ARCHITECTURE: {
        arguments: {
            input: {
                data: 'Описание архитектурных изменений',
                type: 'content',
            },
            validationType: 'architecture',
        },
        name: 'validate',
    },

    /** Валидация TypeScript кода */
    VALIDATE_TYPESCRIPT: {
        arguments: {
            input: {
                data: 'export function test(): string { return "hello"; }',
                type: 'content',
            },
            language: 'typescript',
            validationType: 'code',
        },
        name: 'validate',
    },
} as const;
