import { getPrompt } from '../../lib/cache/prompt-cache';
import type { ValidationInput, ValidationResult } from '../../model/types/main';
import { readFileContent } from '../../services/adapters/file-reader';
import { getConfigOrThrow } from './get-config-or-throw';
import type { AgentConfig } from './types';

/** Валидация кода через CodeValidatorAgent */
// eslint-disable-next-line sonarjs/cognitive-complexity
export async function validateCodeWithAgent(agent: AgentConfig, input: ValidationInput): Promise<ValidationResult> {
    try {
        const correctPrompt = getPrompt(`validate-${input.validationType}.md`);
        agent.instructions = correctPrompt;

        let content = '';

        if (input.input.type === 'file') {
            const fileResult = await readFileContent({
                encoding: input.input.encoding || 'utf8',
                path: input.input.data,
            });

            if (!fileResult.success) {
                return {
                    issues: [`Ошибка чтения файла: ${fileResult.error}`],
                    score: 0,
                    success: false,
                    type: input.validationType,
                };
            }

            content = fileResult.content!;
        } else if (input.input.type === 'content') {
            content = input.input.data;
        } else {
            return {
                issues: ['Неподдерживаемый тип входных данных'],
                score: 0,
                success: false,
                type: input.validationType,
            };
        }

        const validationPrompt = `
# Входные данные для валидации

## Код для валидации:
\`\`\`${input.language || 'typescript'}
${content}
\`\`\`

${input.context ? `## Контекст:\n${input.context}` : ''}

Выполни валидацию согласно инструкциям выше.
`;

        const config = getConfigOrThrow();
        let responseContent: string;
        let tokensUsed = 0;

        if (config.runtime.isTestMode) {
            const { getOpenRouterClient } = await import(
                '../../services/adapters/openrouter/openrouter-client-factory'
            );
            const mockClient = await getOpenRouterClient();
            const mockResponse = await mockClient({
                prompt: validationPrompt,
            });
            responseContent = mockResponse.text;
            tokensUsed = mockResponse.tokensUsed;
        } else {
            const response = await agent.openai.chat.completions.create({
                max_tokens: 4000,
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
                temperature: 0.1,
            });
            responseContent = response.choices[0]?.message?.content || '';
            tokensUsed = response.usage?.total_tokens || 0;
        }

        if (responseContent) {
            const responseText = responseContent.trim();
            const scoreMatch = responseText.match(/Оценка.*?(\d+)\/100/i);
            const score = scoreMatch && scoreMatch[1] ? parseInt(scoreMatch[1], 10) : 75;

            const issues: string[] = [];
            const criticalSection = responseText.match(/critical_issues>(.*?)<\/critical_issues>/s);
            if (criticalSection && criticalSection[1]) {
                const criticalIssues = criticalSection[1].match(/- \*\*(.*?)\*\*/g);
                if (criticalIssues) {
                    issues.push(...criticalIssues.map((issue: string) => issue.replace(/- \*\*|\*\*/g, '')));
                }
            }

            return {
                issues: issues.length > 0 ? issues : [],
                metadata: {
                    duration: 0,
                    fullResponse: responseText,
                    model: agent.model,
                    tokensUsed,
                },
                recommendations: responseText,
                score,
                success: score >= 70,
                type: input.validationType,
            };
        }

        return {
            issues: ['Не удалось получить результат валидации от агента'],
            score: 0,
            success: false,
            type: input.validationType,
        };
    } catch (error) {
        return {
            issues: [`Ошибка валидации: ${error instanceof Error ? error.message : String(error)}`],
            score: 0,
            success: false,
            type: input.validationType,
        };
    }
}
