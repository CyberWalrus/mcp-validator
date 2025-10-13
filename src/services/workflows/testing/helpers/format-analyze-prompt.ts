/** Форматирует промпт для анализа результатов тестирования */
export function formatAnalyzePrompt(template: string, prompt: string, responses: string[], context?: string): string {
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

    const responsesSection = responses
        .map((response, index) => `### Ответ ${index + 1}:\n\`\`\`\n${response}\n\`\`\`\n---`)
        .join('\n');

    formatted = formatted.replace(/\{\{#responses\}\}[\s\S]*?\{\{\/responses\}\}/g, responsesSection);

    return formatted.trim();
}
