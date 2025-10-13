/** Обрабатывает секции массивов в шаблоне */
function renderArraySections(template: string, variables: Record<string, unknown>): string {
    let result = template;
    const sectionRegex = /{{#(\w+)}}([\s\S]*?){{\/\1}}/g;

    result = result.replace(sectionRegex, (match: string, arrayName: string, content: string): string => {
        const arrayValue = variables[arrayName];

        if (!Array.isArray(arrayValue) || arrayValue.length === 0) {
            return '';
        }

        return arrayValue
            .map((item: unknown): string => {
                if (typeof item === 'string') {
                    return content.replace(/{{\.}}/g, item);
                }

                if (typeof item === 'object' && item !== null) {
                    return Object.entries(item as Record<string, unknown>).reduce((itemContent, [key, value]) => {
                        const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        const pattern = new RegExp(`{{${escapedKey}}}`, 'g');
                        const replacement = String(value);

                        return itemContent.replace(pattern, replacement);
                    }, content);
                }

                return content.replace(/{{\.}}/g, String(item));
            })
            .join('');
    });

    return result;
}

/** Рендерит шаблон с подстановкой переменных в mustache-синтаксисе */
export function renderTemplate(template: string, variables: Record<string, unknown>): string {
    let result = renderArraySections(template, variables);
    const negativeSectionRegex = /\{\{\^(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g;

    result = result.replace(negativeSectionRegex, (match: string, arrayName: string, content: string): string => {
        const arrayValue = variables[arrayName];

        if (!Array.isArray(arrayValue) || arrayValue.length === 0) {
            return content;
        }

        return '';
    });

    result = Object.entries(variables).reduce((acc, [key, value]) => {
        if (Array.isArray(value) === false) {
            const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const pattern = new RegExp(`{{${escapedKey}}}`, 'g');
            const replacement = String(value);

            return acc.replace(pattern, replacement);
        }

        return acc;
    }, result);

    result = result.replace(/\{\{\w+\}\}/g, '');

    return result;
}
