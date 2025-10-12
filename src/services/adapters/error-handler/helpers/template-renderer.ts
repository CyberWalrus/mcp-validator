/** Обрабатывает секции массивов в шаблоне */
function renderArraySections(template: string, variables: Record<string, unknown>): string {
    let result = template;

    // Находим все секции {{#array}}...{{/array}}
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
                    // Заменяем переменные объекта {{property}} на значения свойств
                    let itemContent: string = content;
                    for (const [key, value] of Object.entries(item as Record<string, unknown>)) {
                        // Экранируем специальные символы в ключе для безопасного создания регулярного выражения
                        const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        const pattern = new RegExp(`{{${escapedKey}}}`, 'g');
                        const replacement = String(value);
                        itemContent = itemContent.replace(pattern, replacement);
                    }

                    return itemContent;
                }

                return content.replace(/{{\.}}/g, String(item));
            })
            .join('');
    });

    return result;
}

/** Рендерит шаблон с подстановкой переменных в mustache-синтаксисе */
export function renderTemplate(template: string, variables: Record<string, unknown>): string {
    // Сначала обрабатываем массивы {{#array}} и {{/array}}
    let result = renderArraySections(template, variables);

    // Обрабатываем отрицательные секции {{^array}}...{{/array}}
    const negativeSectionRegex = /\{\{\^(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g;
    result = result.replace(negativeSectionRegex, (match: string, arrayName: string, content: string): string => {
        const arrayValue = variables[arrayName];

        // Показываем контент только если массив пустой или не существует
        if (!Array.isArray(arrayValue) || arrayValue.length === 0) {
            return content;
        }

        return '';
    });

    // Заменяем простые переменные {{variable}}
    for (const [key, value] of Object.entries(variables)) {
        if (!Array.isArray(value)) {
            // Пропускаем массивы, они уже обработаны
            // Экранируем специальные символы в ключе для безопасного создания регулярного выражения
            const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const pattern = new RegExp(`{{${escapedKey}}}`, 'g');
            const replacement = String(value);
            result = result.replace(pattern, replacement);
        }
    }

    // Затем заменяем все оставшиеся {{variable}} на пустые строки
    result = result.replace(/\{\{\w+\}\}/g, '');

    return result;
}
