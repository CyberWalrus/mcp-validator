import type { ValidationResult } from '../../model/config';
import { APP_CONFIG } from '../../model/config';

/** Форматирование успешного результата валидации - весь ответ AI + метаданные */
export function formatSuccessfulValidation(result: ValidationResult): string {
    const { recommendations, type, metadata, score } = result;

    let content = recommendations || 'Ответ AI недоступен';

    const modelValue = metadata?.model;
    const durationValue = metadata?.duration;
    const tokensValue = metadata?.tokensUsed;
    const providerValue = metadata?.provider;
    const totalCostValue = metadata?.totalCost;

    const config = APP_CONFIG;
    const modelStr = typeof modelValue === 'string' ? modelValue : config.model.name;
    const scoreStr = typeof score === 'number' ? `${score}/100` : 'Информация недоступна';
    const durationStr =
        typeof durationValue === 'number' || typeof durationValue === 'string' ? String(durationValue) : 'н/д';
    const tokensStr = typeof tokensValue === 'number' || typeof tokensValue === 'string' ? String(tokensValue) : 'н/д';

    let metadataSection = `

---

**Метаданные валидации:**
- Тип: ${type}
- Оценка: ${scoreStr}
- Модель: ${modelStr}
- Время выполнения: ${durationStr}мс
- Токены: ${tokensStr}`;

    if (typeof providerValue === 'string' && providerValue.length > 0) {
        metadataSection += `\n- Провайдер: ${providerValue}`;
    }

    if (typeof totalCostValue === 'string' && totalCostValue.length > 0) {
        metadataSection += `\n- Стоимость: ${totalCostValue}`;
    }

    content += metadataSection;

    return content;
}
