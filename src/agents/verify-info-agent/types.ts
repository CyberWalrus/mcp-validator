import type OpenAI from 'openai';

/** Конфигурация агента проверки информации */
export type AgentConfig = {
    instructions: string;
    model: string;
    openai: OpenAI;
    providers?: string[];
};

/** Результат создания агента проверки информации */
export type VerifyInfoAgentResult = {
    instructions: string;
    model: string;
    openai: OpenAI;
    providers?: string[];
};

/** Результат получения контента для проверки */
export type VerificationContentResult = { content: string; success: true } | { error: string; success: false };

/** Результат вызова OpenAI для проверки */
export type OpenAICallResult = {
    duration: number;
    responseContent: string;
    tokensUsed: number;
    provider?: string;
    totalCost?: string;
};
