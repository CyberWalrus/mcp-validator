import { getPrompt } from '../cache';
import { info } from '../helpers/logger';

/** Показывает справку о доступных командах */
export function showHelp(): void {
    const helpText = getPrompt('cli-help.md');
    info(helpText);
}
