import { PROMPT_CACHE } from './prompt-cache-constants';

/** Получение промпта из кэша */
export function getPrompt(id: string): string {
    const content = PROMPT_CACHE.get(id);

    if (content === undefined) {
        throw new Error(`Промпт "${id}" не найден в кэше`);
    }

    return content;
}
