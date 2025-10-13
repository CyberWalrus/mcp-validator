import { getPrompt } from '../cache';

/** Показывает справку о доступных командах */
export function showHelp(): void {
    const helpText = getPrompt('cli-help.md');
    // eslint-disable-next-line no-console
    console.log(helpText);
}
