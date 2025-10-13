import { formatExecutePrompt } from './format-execute-prompt';

/** @deprecated Используй formatExecutePrompt() или formatAnalyzePrompt() */
export function formatTestPrompt(template: string, prompt: string, context?: string): string {
    return formatExecutePrompt(template, prompt, context);
}
