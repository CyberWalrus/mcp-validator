import type { VerifyInfoInput } from '../../model/config';

/** Форматирует промпт для проверки информации */
export function formatVerificationPrompt(
    content: string,
    verifyInput: VerifyInfoInput,
    checkType: 'check1' | 'check2' | 'check3',
): string {
    const contextPart = verifyInput.context ? `\n\n## Контекст:\n${verifyInput.context}` : '';

    return `# Проверка информации (${checkType})

## Информация для проверки:
${content}${contextPart}

Выполни проверку типа "${checkType}" согласно инструкциям выше и верни результат проверки.`;
}
