import type { ValidationInput, ValidationInputWithoutEncoding } from '../../model/config';

/** Форматирует промпт для валидации кода */
export function formatValidationPrompt(
    content: string,
    validationInput: ValidationInput | ValidationInputWithoutEncoding,
): string {
    const contextSection = validationInput.context ? `## Контекст:\n${validationInput.context}` : '';

    return `
# Входные данные для валидации

## Код для валидации:
\`\`\`${validationInput.language || 'typescript'}
${content}
\`\`\`

${contextSection}

Выполни валидацию согласно инструкциям выше.
`;
}
