import type { TestResult } from '../../model/types/main';

/** Входные параметры для test-prompt инструмента */
export type TestPromptInput = {
    /** Промпт для тестирования */
    prompt: string;
    /** Дополнительный контекст */
    context?: string;
    /** Количество параллельных итераций */
    iterations?: number;
    /** Список моделей для тестирования */
    models?: string[];
    /** Таймаут для каждого запроса */
    timeout?: number;
};

/** Результат тестирования промпта */
export type TestPromptResult = {
    /** Результаты всех тестов */
    results: TestResult[];
    /** Общая статистика */
    summary: {
        /** Количество неуспешных тестов */
        errorCount: number;
        /** Количество успешных тестов */
        successCount: number;
        /** Общее время выполнения */
        totalDuration: number;
    };
};
