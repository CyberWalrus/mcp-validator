import type OpenAI from 'openai';

/** Конфигурация агента */
export type AgentConfig = {
    instructions: string;
    model: string;
    openai: OpenAI;
    providers?: string[];
};

/** Результат создания агента тестирования промптов */
export type TestPromptAgentResult = {
    instructions: string;
    model: string;
    openai: OpenAI;
    providers?: string[];
};

/** Результат одной итерации тестирования */
export type TestIterationResult = {
    /** Содержимое ответа */
    content: string;
    /** Длительность выполнения в миллисекундах */
    duration: number;
    /** Успешность выполнения */
    isSuccess: boolean;
    /** Номер итерации */
    iteration: number;
    /** Используемая модель */
    model: string;
    /** Ошибка выполнения */
    error?: string;
    /** Количество использованных токенов */
    tokensUsed?: number;
};
