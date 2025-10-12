import { getPrompt } from '../../../../lib/cache';

/** Загружает промпт для выполнения тестов из кэша */
export function loadExecutePrompt(): string {
    return getPrompt('execute-prompt-test.md');
}

/** Загружает промпт для анализа результатов тестирования из кэша */
export function loadAnalyzePrompt(): string {
    return getPrompt('test-prompt.md');
}
