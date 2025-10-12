import type { ValidationContext } from '../types';

/** Форматирует промпт валидации с подстановкой контекста */
export function formatPrompt(template: string, context: ValidationContext): string {
    let formattedPrompt = template.replace('{CODE}', context.code).replace('{LANGUAGE}', context.language);

    if (context.context) {
        formattedPrompt = formattedPrompt.replace('{CONTEXT}', context.context);
    } else {
        // Удаляем секцию контекста если её нет с сохранением пробелов между словами
        formattedPrompt = formattedPrompt.replace(/\{CONTEXT\}/g, '');
    }

    if (context.additionalFiles && context.additionalFiles.length > 0) {
        const additionalFilesSection = context.additionalFiles.join('\n\n');
        formattedPrompt = formattedPrompt.replace('{ADDITIONAL_FILES}', additionalFilesSection);
    } else {
        // Удаляем секцию дополнительных файлов если их нет с сохранением пробелов между словами
        formattedPrompt = formattedPrompt.replace(/\{ADDITIONAL_FILES\}/g, '');
    }

    return formattedPrompt.trim();
}
