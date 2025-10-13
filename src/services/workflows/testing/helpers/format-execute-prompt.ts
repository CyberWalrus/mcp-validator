/** Форматирует промпт для выполнения тестов (симуляция AI) */
export function formatExecutePrompt(template: string, prompt: string, context?: string): string {
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
        formatted = formatted.replace(/\{\{#context\}\}[\s\S]*?\{\{\/context\}\}/g, '').replace(/\{CONTEXT\}/g, '');
    }

    formatted = formatted.replace(/\{\{#critical_reminder\}\}/g, '').replace(/\{\{\/critical_reminder\}\}/g, '');

    return formatted.trim();
}
