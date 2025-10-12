/** Форматирует промпт для выполнения тестов (симуляция AI) */
export function formatExecutePrompt(template: string, prompt: string, context?: string): string {
    // Поддерживаем как старый формат {{code}}, так и новый {PROMPT}
    let formatted = template
        .replace(/\{\{code\}\}/g, prompt)
        .replace(/\{PROMPT\}/g, prompt)
        .replace(/\{\{language\}\}/g, '');

    if (context) {
        formatted = formatted
            .replace(/\{\{#context\}\}/g, '')
            .replace(/\{\{context\}\}/g, context)
            .replace(/\{CONTEXT\}/g, context)
            .replace(/\{\{\/context\}\}/g, '');
    } else {
        // Удаляем секцию контекста если её нет (поддерживаем оба формата)
        formatted = formatted.replace(/\{\{#context\}\}[\s\S]*?\{\{\/context\}\}/g, '').replace(/\{CONTEXT\}/g, ''); // Просто убираем {CONTEXT} если контекста нет
    }

    // Добавляем обработку критического напоминания
    formatted = formatted.replace(/\{\{#critical_reminder\}\}/g, '').replace(/\{\{\/critical_reminder\}\}/g, '');

    return formatted.trim();
}

/** Форматирует промпт для анализа результатов тестирования */
export function formatAnalyzePrompt(template: string, prompt: string, responses: string[], context?: string): string {
    // Поддерживаем как старый формат {{code}}, так и новый {PROMPT}
    let formatted = template
        .replace(/\{\{code\}\}/g, prompt)
        .replace(/\{PROMPT\}/g, prompt)
        .replace(/\{\{language\}\}/g, '');

    if (context) {
        formatted = formatted
            .replace(/\{\{#context\}\}/g, '')
            .replace(/\{\{context\}\}/g, context)
            .replace(/\{CONTEXT\}/g, context)
            .replace(/\{\{\/context\}\}/g, '');
    } else {
        // Удаляем секцию контекста если её нет (поддерживаем оба формата)
        formatted = formatted.replace(/\{\{#context\}\}[\s\S]*?\{\{\/context\}\}/g, '').replace(/\{CONTEXT\}/g, '');
    }

    // Форматируем ответы
    const responsesSection = responses
        .map((response, index) => `### Ответ ${index + 1}:\n\`\`\`\n${response}\n\`\`\`\n---`)
        .join('\n');

    formatted = formatted.replace(/\{\{#responses\}\}[\s\S]*?\{\{\/responses\}\}/g, responsesSection);

    return formatted.trim();
}

/** @deprecated Используй formatExecutePrompt() или formatAnalyzePrompt() */
export function formatTestPrompt(template: string, prompt: string, context?: string): string {
    return formatExecutePrompt(template, prompt, context);
}
