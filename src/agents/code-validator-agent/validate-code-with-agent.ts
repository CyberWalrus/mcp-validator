import { getPrompt } from '../../lib/cache';
import type { ValidationInput, ValidationInputWithoutEncoding, ValidationResult } from '../../model/config';
import { callOpenAIForValidation } from './call-openai-for-validation';
import { formatValidationPrompt } from './format-validation-prompt';
import { getValidationContent } from './get-validation-content';
import { parseValidationResponse } from './parse-validation-response';
import type { AgentConfig } from './types';

/** Валидация кода через CodeValidatorAgent */
export async function validateCodeWithAgent(
    agent: AgentConfig,
    validationInput: ValidationInput | ValidationInputWithoutEncoding,
): Promise<ValidationResult> {
    try {
        const correctPrompt = getPrompt(`validate-${validationInput.validationType}.md`);
        agent.instructions = correctPrompt;

        const contentResult = await getValidationContent(validationInput);

        if (contentResult.success === false) {
            return {
                issues: [contentResult.error],
                score: 0,
                success: false,
                type: validationInput.validationType,
            };
        }

        const validationPrompt = formatValidationPrompt(contentResult.content, validationInput);

        const { responseContent, tokensUsed, duration } = await callOpenAIForValidation(agent, validationPrompt);

        if (responseContent === '') {
            return {
                issues: ['Не удалось получить результат валидации от агента'],
                score: 0,
                success: false,
                type: validationInput.validationType,
            };
        }

        const responseText = responseContent.trim();
        const parsed = parseValidationResponse(responseText);

        return {
            issues: parsed.issues.length > 0 ? parsed.issues : [],
            metadata: {
                duration,
                fullResponse: responseText,
                model: agent.model,
                tokensUsed,
            },
            recommendations: parsed.recommendations,
            score: parsed.score,
            success: parsed.score >= 70,
            type: validationInput.validationType,
        };
    } catch (err) {
        return {
            issues: [`Ошибка валидации: ${err instanceof Error ? err.message : String(err)}`],
            metadata: {
                duration: undefined, // Модель не вызывалась
                model: undefined,
                tokensUsed: undefined,
            },
            score: 0,
            success: false,
            type: validationInput.validationType,
        };
    }
}
