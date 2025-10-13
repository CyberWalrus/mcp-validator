import { getConfigOrThrow } from '../../model/config/get-config-or-throw';
import type { ValidationResult } from '../../model/types/main';

/** Форматирование результата как раньше - ответ ИИ + метаданные */
export function formatSuccessfulValidation(result: ValidationResult): string {
    const { recommendations, type, metadata } = result;

    let content = recommendations || 'Ответ ИИ недоступен';

    const modelValue = metadata?.model;
    const durationValue = metadata?.duration;
    const tokensValue = metadata?.tokensUsed;

    const config = getConfigOrThrow();
    const modelStr = typeof modelValue === 'string' ? modelValue : config.model.name;
    const durationStr =
        typeof durationValue === 'number' || typeof durationValue === 'string' ? String(durationValue) : 'н/д';
    const tokensStr = typeof tokensValue === 'number' || typeof tokensValue === 'string' ? String(tokensValue) : 'н/д';

    content += `

---

**Метаданные валидации:**
- Тип: ${type}
- Модель: ${modelStr}
- Время выполнения: ${durationStr}мс
- Токены: ${tokensStr}
`;

    return content;
}
