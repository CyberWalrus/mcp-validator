import { getConfigOrThrow } from '../../model/config/get-config-or-throw';
import type { AgentConfig, OpenAICallResult } from './types';

/** Вызывает OpenAI API для валидации (E2E или реальный) */
export async function callOpenAIForValidation(agent: AgentConfig, validationPrompt: string): Promise<OpenAICallResult> {
    const config = getConfigOrThrow();

    if (config.runtime.isE2ETest) {
        const { getOpenRouterClient } = await import('../../services/adapters/openrouter/openrouter-client-factory');
        const mockClient = await getOpenRouterClient();
        const mockResponse = await mockClient({
            prompt: validationPrompt,
        });

        return {
            responseContent: mockResponse.text,
            tokensUsed: mockResponse.tokensUsed,
        };
    }

    const response = await agent.openai.chat.completions.create({
        max_tokens: config.model.maxTokens,
        messages: [
            {
                content: agent.instructions,
                role: 'system',
            },
            {
                content: validationPrompt,
                role: 'user',
            },
        ],
        model: agent.model,
        temperature: config.model.temperature,
    });

    return {
        responseContent: response.choices[0]?.message?.content || '',
        tokensUsed: response.usage?.total_tokens || 0,
    };
}
