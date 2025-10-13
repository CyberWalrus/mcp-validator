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
    /** Таймаут для каждого запроса */
    timeout?: number;
};

/** Результат одной итерации тестирования */
export type TestIterationResult = {
    /** Содержимое ответа */
    content: string;
    /** Время выполнения в мс */
    duration: number;
    /** Успешно ли выполнена итерация */
    isSuccess: boolean;
    /** Номер итерации */
    iteration: number;
    /** Использованная модель */
    model: string;
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

/** Настройки AI модели */
export type ModelConfig = {
    /** Максимальное количество токенов */
    readonly maxTokens: number;
    /** Название модели */
    readonly name: string;
    /** Температура генерации */
    readonly temperature: number;
};

/** Настройки API провайдера */
export type ApiConfig = {
    /** API ключ */
    readonly key: string;
    /** Путь к мок клиенту для тестирования */
    readonly mockClientPath: string;
    /** Провайдер API */
    readonly provider: 'openrouter';
    /** URL API */
    readonly url: string;
};

/** Настройки таймаутов */
export type TimeoutsConfig = {
    /** Таймаут для API запросов в миллисекундах */
    readonly apiRequest: number;
    /** Таймаут для процесса валидации в миллисекундах */
    readonly validation: number;
};

/** Настройки логирования */
export type LoggingConfig = {
    /** Уровень логирования */
    readonly level: LogLevel;
};

/** Пути к ресурсам */
export type PathsConfig = {
    /** Путь к директории с шаблонами ошибок */
    readonly errors: string;
    /** Путь к директории с промптами */
    readonly prompts: string;
};

/** Конфигурация приложения */
export type AppConfig = {
    /** Настройки API провайдера */
    readonly api: ApiConfig;
    /** Настройки логирования */
    readonly logging: LoggingConfig;
    /** Настройки AI модели */
    readonly model: ModelConfig;
    /** Пути к ресурсам */
    readonly paths: PathsConfig;
    /** Настройки среды выполнения */
    readonly runtime: RuntimeConfig;
    /** Настройки таймаутов */
    readonly timeouts: TimeoutsConfig;
};

/** Настройки среды выполнения приложения */
export type RuntimeConfig = {
    /** Текущая среда исполнения */
    readonly environment: string;
    /** Флаг запуска в режиме E2E тестирования */
    readonly isE2ETest: boolean;
    /** Значение переменной NODE_PATH */
    readonly nodePath: string;
};
