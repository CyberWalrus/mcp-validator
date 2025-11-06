import type OpenAI from 'openai';

import type { createCodeValidatorAgent } from './create-code-validator-agent';
import type { validateCodeWithAgent } from './validate-code-with-agent';

/** Конфигурация агента */
export type AgentConfig = {
    instructions: string;
    model: string;
    openai: OpenAI;
    providers?: string[];
};

/** Результат создания агента валидации кода */
export type CodeValidatorAgentResult = {
    instructions: string;
    model: string;
    openai: OpenAI;
    providers?: string[];
};

/** Тип функции создания агента валидации кода */
export type CreateCodeValidatorAgent = typeof createCodeValidatorAgent;
/** Тип функции валидации кода с агентом */
export type ValidateCodeWithAgent = typeof validateCodeWithAgent;

/** Результат получения контента для валидации */
export type ValidationContentResult = { content: string; success: true } | { error: string; success: false };

/** Результат вызова OpenAI */
export type OpenAICallResult = {
    duration: number;
    responseContent: string;
    tokensUsed: number;
    provider?: string;
    totalCost?: string;
};

/** Результат парсинга ответа валидации */
export type ParsedValidationResponse = {
    /** Массив критических проблем (deprecated, не используется) */
    issues: string[];
    /** Полный ответ AI */
    recommendations: string;
    /** Оценка качества (опционально извлекается из ответа) */
    score: number | undefined;
};
