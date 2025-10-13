import { getPrompt } from '../../../../lib/cache';

/** Загружает промпт для выполнения тестов из кэша */
export function loadExecutePrompt(): string {
    return getPrompt('execute-prompt-test.md');
}
