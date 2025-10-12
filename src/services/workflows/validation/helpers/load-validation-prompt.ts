import { getPrompt } from '../../../../lib/cache';
import type { ValidationType } from '../../../../lib/helpers/resource-resolver/types';

/** Загружает промпт валидации по типу из кэша */
export function loadValidationPrompt(type: ValidationType): string {
    return getPrompt(`validate-${type}.md`);
}
