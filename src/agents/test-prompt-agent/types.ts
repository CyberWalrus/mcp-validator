import type OpenAI from 'openai';

export type AgentConfig = {
    instructions: string;
    model: string;
    openai: OpenAI;
};

export type TestIterationResult = {
    content: string;
    duration: number;
    iteration: number;
    model: string;
    success: boolean;
    error?: string;
    tokensUsed?: number;
};
