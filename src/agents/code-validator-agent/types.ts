import type OpenAI from 'openai';

import type { createCodeValidatorAgent } from './create-code-validator-agent';
import type { validateCodeWithAgent } from './validate-code-with-agent';

export type AgentConfig = {
    instructions: string;
    model: string;
    openai: OpenAI;
};

export type CreateCodeValidatorAgent = typeof createCodeValidatorAgent;
export type ValidateCodeWithAgent = typeof validateCodeWithAgent;
