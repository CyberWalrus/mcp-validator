import type { ValidationResult } from '../../model/config';

/** Форматирует метаданные валидации в строку */
export function formatValidationMetadata(result: ValidationResult): string {
    if (result.metadata === null || result.metadata === undefined) {
        return '';
    }

    const { duration, model, tokensUsed } = result.metadata;
    let metadata = `\n\n---\n\n**Метаданные валидации:**\n`;
    metadata += `- Тип: ${result.type}\n`;
    metadata += `- Модель: ${typeof model === 'string' ? model : 'н/д'}\n`;
    metadata += `- Время выполнения: ${typeof duration === 'number' ? String(duration) : 'н/д'}мс\n`;
    metadata += `- Токены: ${typeof tokensUsed === 'number' ? String(tokensUsed) : 'н/д'}\n`;

    return metadata;
}
