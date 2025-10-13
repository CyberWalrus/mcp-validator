import type { ValidationInput } from '../../model/types/main';

/** Форматирует промпт для валидации кода */
export function formatValidationPrompt(content: string, validationInput: ValidationInput): string {
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
