import type { TestIterationResult, TestPromptInput, TestPromptResult } from '../../model/types/main';
import { calculateConsistencyScore } from './calculate-consistency-score';
import { generateTestSummary } from './generate-test-summary';
import type { AgentConfig } from './types';

/** Параллельное тестирование промпта через TestPromptAgent */
export async function testPromptWithAgent(agent: AgentConfig, input: TestPromptInput): Promise<TestPromptResult> {
    try {
        const { prompt, iterations = 5, models = ['openai/gpt-oss-120b'] } = input;

        const promises = Array.from({ length: iterations }, async (_, index) => {
            const iterationPrompt = `
# Тестирование промпта (итерация ${index + 1}/${iterations})

## Промпт для тестирования:
${prompt}

${input.context ? `## Контекст:\n${input.context}` : ''}

Выполни данный промпт и дай полный ответ согласно инструкциям выше.
`;

            const startTime = Date.now();

            try {
                const response = await agent.openai.chat.completions.create({
                    max_tokens: 4000,
                    messages: [
                        {
                            content: agent.instructions,
                            role: 'system',
                        },
                        {
                            content: iterationPrompt,
                            role: 'user',
                        },
                    ],
                    model: agent.model,
                    temperature: 0.1,
                });

                const duration = Date.now() - startTime;
                const responseContent = response.choices[0]?.message?.content;

                const result: TestIterationResult = {
                    content: responseContent || '',
                    duration,
                    iteration: index + 1,
                    model: models[0] || 'openai/gpt-oss-120b',
                    success: Boolean(responseContent),
                };

                if (!responseContent) {
                    result.error = 'Ошибка выполнения';
                }

                return result;
            } catch (error) {
                const duration = Date.now() - startTime;

                return {
                    content: '',
                    duration,
                    error: error instanceof Error ? error.message : String(error),
                    iteration: index + 1,
                    model: models[0] || 'openai/gpt-oss-120b',
                    success: false,
                };
            }
        });

        const results = await Promise.all(promises);

        const successfulResults = results.filter((r) => r.success);
        const averageDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
        const consistencyScore = calculateConsistencyScore(successfulResults.map((r) => r.content));

        return {
            averageDuration,
            consistencyScore,
            results,
            success: successfulResults.length > 0,
            successfulIterations: successfulResults.length,
            summary: generateTestSummary(results, consistencyScore),
            totalIterations: iterations,
        };
    } catch (error) {
        return {
            averageDuration: 0,
            consistencyScore: 0,
            error: `Ошибка тестирования промпта: ${error instanceof Error ? error.message : String(error)}`,
            results: [],
            success: false,
            successfulIterations: 0,
            totalIterations: input.iterations || 5,
        };
    }
}
