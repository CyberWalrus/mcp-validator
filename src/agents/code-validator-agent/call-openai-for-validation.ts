import { APP_CONFIG } from '../../model/config';
import type { AgentConfig, OpenAICallResult } from './types';

/** Вызывает OpenAI API для валидации (E2E или реальный) */
export async function callOpenAIForValidation(agent: AgentConfig, validationPrompt: string): Promise<OpenAICallResult> {
    const startTime = Date.now();
    const config = APP_CONFIG;

    if (config.runtime.isE2ETest) {
        const { getOpenRouterClient } = await import('../../services/adapters/openrouter/openrouter-client-factory');
        const mockClient = await getOpenRouterClient();
        const mockResponse = await mockClient({
            prompt: validationPrompt,
        });

        const duration = Date.now() - startTime;

        return {
            duration,
            responseContent: mockResponse.text,
            tokensUsed: mockResponse.tokensUsed,
        };
    }

    const requestBody = {
        max_tokens: config.model.maxTokens,
        messages: [
            {
                content: agent.instructions,
                role: 'system' as const,
            },
            {
                content: validationPrompt,
                role: 'user' as const,
            },
        ],
        model: agent.model,
        temperature: config.model.temperature,
        ...(agent.providers &&
            agent.providers.length > 0 && {
                extra_body: {
                    providers: agent.providers,
                },
            }),
    };

    const response = await agent.openai.chat.completions.create(requestBody);

    const duration = Date.now() - startTime;

    return {
        duration,
        responseContent: response.choices[0]?.message?.content || '',
        tokensUsed: response.usage?.total_tokens || 0,
    };
}
