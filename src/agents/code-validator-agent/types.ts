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
