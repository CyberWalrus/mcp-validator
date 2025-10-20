import type { ValidationResult } from '../../model/config';
import { APP_CONFIG } from '../../model/config';

/** Форматирование успешного результата валидации - весь ответ AI + метаданные */
export function formatSuccessfulValidation(result: ValidationResult): string {
    const { recommendations, type, metadata, score } = result;

    let content = recommendations || 'Ответ AI недоступен';

    const modelValue = metadata?.model;
    const durationValue = metadata?.duration;
    const tokensValue = metadata?.tokensUsed;

    const config = APP_CONFIG;
    const modelStr = typeof modelValue === 'string' ? modelValue : config.model.name;
    const scoreStr = typeof score === 'number' ? `${score}/100` : 'Информация недоступна';
    const durationStr =
        typeof durationValue === 'number' || typeof durationValue === 'string' ? String(durationValue) : 'н/д';
    const tokensStr = typeof tokensValue === 'number' || typeof tokensValue === 'string' ? String(tokensValue) : 'н/д';

    content += `

---

**Метаданные валидации:**
- Тип: ${type}
- Оценка: ${scoreStr}
- Модель: ${modelStr}
- Время выполнения: ${durationStr}мс
- Токены: ${tokensStr}
`;

    return content;
}
