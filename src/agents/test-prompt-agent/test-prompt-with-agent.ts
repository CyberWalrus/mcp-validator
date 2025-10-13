import { getConfigOrThrow } from '../../model/config/get-config-or-throw';
import type { TestIterationResult, TestPromptInput, TestPromptResult } from '../../model/types/main';
import { calculateConsistencyScore } from './calculate-consistency-score';
import { generateTestSummary } from './generate-test-summary';
import type { AgentConfig } from './types';

/** Параллельное тестирование промпта через TestPromptAgent */
export async function testPromptWithAgent(agent: AgentConfig, testInput: TestPromptInput): Promise<TestPromptResult> {
    try {
        const { prompt, iterations = 5 } = testInput;
        const config = getConfigOrThrow();
        const modelName = config.model.name;

        const promises = Array.from({ length: iterations }, async (_, index): Promise<TestIterationResult> => {
            const iterationPrompt = `
# Тестирование промпта (итерация ${index + 1}/${iterations})

## Промпт для тестирования:
${prompt}

${testInput.context ? `## Контекст:\n${testInput.context}` : ''}

Выполни данный промпт и дай полный ответ согласно инструкциям выше.
`;

            const startTime = Date.now();

            try {
                const response = await agent.openai.chat.completions.create({
                    max_tokens: config.model.maxTokens,
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
                    temperature: config.model.temperature,
                });

                const duration = Date.now() - startTime;
                const responseContent = response.choices[0]?.message?.content;

                const result: TestIterationResult = {
                    content: responseContent || '',
                    duration,
                    isSuccess: Boolean(responseContent),
                    iteration: index + 1,
                    model: modelName,
                };

                if (!responseContent) {
                    result.error = 'Ошибка выполнения';
                }

                return result;
            } catch (err) {
                const duration = Date.now() - startTime;

                return {
                    content: '',
                    duration,
                    error: err instanceof Error ? err.message : String(err),
                    isSuccess: false,
                    iteration: index + 1,
                    model: modelName,
                };
            }
        });

        const results = await Promise.all(promises);

        const successfulResults = results.filter((r) => r.isSuccess);
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
    } catch (err) {
        return {
            averageDuration: 0,
            consistencyScore: 0,
            error: `Ошибка тестирования промпта: ${err instanceof Error ? err.message : String(err)}`,
            results: [],
            success: false,
            successfulIterations: 0,
            totalIterations: testInput.iterations || 5,
        };
    }
}
