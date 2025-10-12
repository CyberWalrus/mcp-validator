import { getPrompt } from '../../../../lib/cache/prompt-cache';
import type { ValidationType } from '../../../../lib/helpers/resource-resolver/types';

/** Загружает промпт валидации по типу из кэша */
export function loadValidationPrompt(type: ValidationType): string {
    try {
        return getPrompt(`validate-${type}.md`);
    } catch {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        return getDefaultPrompt(type);
    }
}

/** Возвращает базовый промпт для указанного типа валидации */
function getDefaultPrompt(type: ValidationType): string {
    const basePrompts: Record<ValidationType, string> = {
        architecture: `# Анализ архитектуры

Проанализируйте архитектурные решения в коде:

\`\`\`{LANGUAGE}
{CODE}
\`\`\`

{CONTEXT}

{ADDITIONAL_FILES}

Проверьте:
- Архитектурные паттерны
- Разделение ответственности
- Зависимости между модулями
- Масштабируемость

Предоставьте рекомендации по улучшению архитектуры.`,

        code: `# Анализ качества кода

Проанализируйте следующий код на языке {LANGUAGE}:

\`\`\`{LANGUAGE}
{CODE}
\`\`\`

{CONTEXT}

{ADDITIONAL_FILES}

Проверьте:
- Синтаксические ошибки
- Стиль кода
- Потенциальные баги
- Производительность
- Читаемость

Предоставьте оценку и рекомендации по улучшению.`,

        documentation: `# Анализ документации

Проанализируйте качество документации:

\`\`\`
{CODE}
\`\`\`

{CONTEXT}

{ADDITIONAL_FILES}

Проверьте:
- Полноту документации
- Ясность и понятность
- Актуальность
- Структуру

Предоставьте рекомендации по улучшению документации.`,

        prompts: `# Анализ промптов

Проанализируйте качество промпта:

\`\`\`
{CODE}
\`\`\`

{CONTEXT}

{ADDITIONAL_FILES}

Проверьте:
- Ясность инструкций
- Полноту контекста
- Структуру промпта
- Эффективность

Предоставьте рекомендации по улучшению промпта.`,

        tests: `# Анализ тестов

Проанализируйте качество тестов для кода на языке {LANGUAGE}:

\`\`\`{LANGUAGE}
{CODE}
\`\`\`

{CONTEXT}

{ADDITIONAL_FILES}

Проверьте:
- Покрытие кода тестами
- Качество тестовых сценариев
- Правильность утверждений
- Структуру тестов

Предоставьте рекомендации по улучшению тестирования.`,
    };

    return basePrompts[type];
}
