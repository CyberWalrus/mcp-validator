/** Объединенные типы из model/config и model/types - новая единая структура */

// ========== ЛОГИРОВАНИЕ ==========

/** Уровни логирования для системы */
export type LogLevel = 'DEBUG' | 'ERROR' | 'INFO' | 'WARN';

// ========== ВАЛИДАЦИЯ ==========

/** Результат валидации */
export type ValidationResult = {
    /** Список проблем, если есть */
    issues: string[];
    /** Оценка качества от 0 до 100 */
    score: number;
    /** Успешно ли прошла валидация */
    success: boolean;
    /** Тип валидации */
    type: ValidationType;
    /** Дополнительные данные результата */
    metadata?: Record<string, unknown>;
    /** Рекомендации по улучшению */
    recommendations?: string;
};

/** Входные данные для валидации */
export type ValidationInput = {
    /** Источник входных данных */
    input: InputSource;
    /** Тип валидации */
    validationType: ValidationType;
    /** Дополнительный контекст */
    context?: string;
    /** Язык программирования */
    language?: string;
};

/** Типы валидации */
export type ValidationType = 'architecture' | 'code' | 'custom' | 'documentation' | 'prompts' | 'tests';

/** Источник входных данных */
export type InputSource = {
    /** Данные или путь */
    data: string;
    /** Тип источника */
    type: 'content' | 'file' | 'url';
    /** Кодировка для файлов */
    encoding?: 'ascii' | 'utf8' | 'utf16le';
};

// ========== ТЕСТИРОВАНИЕ ==========

/** Результат параллельного тестирования */
export type TestResult = {
    /** Время выполнения в миллисекундах */
    duration: number;
    /** Сообщение результата */
    message: string;
    /** Статус выполнения теста */
    status: 'error' | 'success' | 'timeout';
    /** Дополнительные данные */
    metadata?: Record<string, unknown>;
};

/** Входные данные для тестирования промпта */
export type TestPromptInput = {
    /** Промпт для тестирования */
    prompt: string;
    /** Дополнительный контекст */
    context?: string;
    /** Количество итераций */
    iterations?: number;
    /** Список моделей для тестирования */
    models?: string[];
    /** Таймаут для каждого запроса */
    timeout?: number;
};

/** Результат одной итерации тестирования */
export type TestIterationResult = {
    /** Содержимое ответа */
    content: string;
    /** Время выполнения в мс */
    duration: number;
    /** Номер итерации */
    iteration: number;
    /** Использованная модель */
    model: string;
    /** Успешно ли выполнена итерация */
    success: boolean;
    /** Ошибка, если есть */
    error?: string;
};

/** Результат параллельного тестирования промпта */
export type TestPromptResult = {
    /** Среднее время выполнения */
    averageDuration: number;
    /** Индекс консистентности ответов */
    consistencyScore: number;
    /** Результаты всех итераций */
    results: TestIterationResult[];
    /** Общий успех тестирования */
    success: boolean;
    /** Успешные итерации */
    successfulIterations: number;
    /** Общее количество итераций */
    totalIterations: number;
    /** Ошибка, если тестирование не удалось */
    error?: string;
    /** Краткий отчет */
    summary?: string;
};

// ========== КОНФИГУРАЦИЯ ПРИЛОЖЕНИЯ ==========

/** Настройки AI моделей */
export type AiConfig = {
    /** Модель по умолчанию */
    readonly defaultModel: string;
    /** Максимальное количество токенов */
    readonly maxTokens: number;
    /** Температура генерации */
    readonly temperature: number;
};

/** Настройки валидации */
export type ValidationConfig = {
    /** Таймаут валидации в миллисекундах */
    readonly timeout: number;
};

/** Конфигурация приложения */
export type AppConfig = {
    /** Настройки AI моделей */
    readonly ai: AiConfig;
    /** Настройки логирования */
    readonly logging: {
        /** Уровень логирования */
        readonly level: LogLevel;
    };
    /** Настройки OpenRouter API */
    readonly openRouter: {
        /** API ключ для OpenRouter */
        readonly apiKey: string;
        /** URL API OpenRouter */
        readonly apiUrl: string;
        /** Таймаут запросов в миллисекундах */
        readonly timeout: number;
    };
    /** Пути к ресурсам */
    readonly paths: {
        /** Путь к директории с шаблонами ошибок */
        readonly errors: string;
        /** Путь к директории с промптами */
        readonly prompts: string;
    };
    /** Настройки среды выполнения */
    readonly runtime: RuntimeConfig;
    /** Настройки валидации */
    readonly validation: ValidationConfig;
};

/** Настройки среды выполнения приложения */
export type RuntimeConfig = {
    /** Текущая среда исполнения */
    readonly environment: string;
    /** Флаг запуска в режиме E2E тестирования */
    readonly isE2ETest: boolean;
    /** Флаг тестового режима */
    readonly isTestMode: boolean;
    /** Значение переменной NODE_PATH */
    readonly nodePath: string;
};
