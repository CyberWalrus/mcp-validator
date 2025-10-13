import { getPrompt } from '../../../../lib/cache';

/** Загружает промпт для анализа результатов тестирования из кэша */
export function loadAnalyzePrompt(): string {
    return getPrompt('test-prompt.md');
}
