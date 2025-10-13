import type OpenAI from 'openai';

import type { createCodeValidatorAgent } from './create-code-validator-agent';
import type { validateCodeWithAgent } from './validate-code-with-agent';

/** Конфигурация агента */
export type AgentConfig = {
    instructions: string;
    model: string;
    openai: OpenAI;
};

/** Результат создания агента валидации кода */
export type CodeValidatorAgentResult = {
    instructions: string;
    model: string;
    openai: OpenAI;
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
};

/** Результат парсинга ответа валидации */
export type ParsedValidationResponse = {
    issues: string[];
    recommendations: string;
    score: number;
};
