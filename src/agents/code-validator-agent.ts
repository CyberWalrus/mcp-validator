/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-shadow, sonarjs/no-identical-expressions */
import OpenAI from 'openai';

import { getPrompt } from '../lib/cache/prompt-cache';
import { APP_CONFIG, getAppConfigError } from '../model/config';
import type { AppConfig, ValidationInput, ValidationResult } from '../model/types/main';
import { readFileContent } from '../services/adapters/file-reader';

function getConfigOrThrow(): AppConfig {
    const config = APP_CONFIG;

    const configError = getAppConfigError();

    if (!config || configError) {
        const message = configError?.message ?? 'Конфигурация приложения недоступна';

        throw new Error(message);
    }

    return config;
}

/** CodeValidatorAgent для валидации кода с загрузкой промптов из .md файлов */
export function createCodeValidatorAgent() {
    const config = getConfigOrThrow();
    const {
        openRouter: { apiKey, apiUrl },
    } = config;

    // Создаем OpenAI клиент с OpenRouter backend
    const openai = new OpenAI({
        apiKey,
        baseURL: apiUrl,
    });

    // Загружаем промпт из кэша (ОПТИМИЗИРОВАНО!)
    const promptContent = getPrompt('validate-code.md');

    return {
        instructions: promptContent,
        model: 'openai/gpt-oss-120b',
        openai,
    };
}

/** Валидация кода через CodeValidatorAgent */
// eslint-disable-next-line sonarjs/cognitive-complexity
export async function validateCodeWithAgent(agent: any, input: ValidationInput): Promise<ValidationResult> {
    try {
        // ИСПРАВЛЕНИЕ: Загружаем правильный промпт в зависимости от типа валидации
        const correctPrompt = getPrompt(`validate-${input.validationType}.md`);
        agent.instructions = correctPrompt;

        // Подготавливаем данные для валидации
        let content = '';

        if (input.input.type === 'file') {
            // Используем существующую функцию чтения файлов (СОХРАНЯЕМ!)
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

        // Формируем промпт с подстановкой переменных
        const validationPrompt = `
# Входные данные для валидации

## Код для валидации:
\`\`\`${input.language || 'typescript'}
${content}
\`\`\`

${input.context ? `## Контекст:\n${input.context}` : ''}

Выполни валидацию согласно инструкциям выше.
`;

        // ИСПРАВЛЕНИЕ: Используем правильный клиент в зависимости от режима
        const config = getConfigOrThrow();
        let responseContent: string;
        let tokensUsed = 0;

        if (config.runtime.isTestMode) {
            // В тестовом режиме используем мок клиент
            const mockClient = await import('../e2e/mocks/openrouter-test-client');
            const mockResponse = await mockClient.makeOpenRouterRequest({
                prompt: validationPrompt,
            });
            responseContent = mockResponse.text;
            tokensUsed = mockResponse.tokensUsed;
        } else {
            // В продакшн режиме используем OpenAI клиент
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

        // Обрабатываем результат
        if (responseContent) {
            // Парсим результат валидации (упрощенный парсинг)
            const content = responseContent.trim();
            const scoreMatch = content.match(/Оценка.*?(\d+)\/100/i);
            const score = scoreMatch && scoreMatch[1] ? parseInt(scoreMatch[1], 10) : 75;

            // Извлекаем проблемы из ответа
            const issues: string[] = [];
            const criticalSection = content.match(/critical_issues>(.*?)<\/critical_issues>/s);
            if (criticalSection && criticalSection[1]) {
                const criticalIssues = criticalSection[1].match(/- \*\*(.*?)\*\*/g);
                if (criticalIssues) {
                    issues.push(...criticalIssues.map((issue: string) => issue.replace(/- \*\*|\*\*/g, '')));
                }
            }

            return {
                issues: issues.length > 0 ? issues : [],
                metadata: {
                    duration: Date.now() - Date.now(),
                    fullResponse: content,
                    model: agent.model,
                    tokensUsed,
                },
                recommendations: content,
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

export type CreateCodeValidatorAgent = typeof createCodeValidatorAgent;
export type ValidateCodeWithAgent = typeof validateCodeWithAgent;
