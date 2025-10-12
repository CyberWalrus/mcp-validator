import OpenAI from 'openai';

import { getPrompt } from '../../lib/cache/prompt-cache';
import { getConfigOrThrow } from './get-config-or-throw';

/** TestPromptAgent для параллельного тестирования промптов */
export function createTestPromptAgent() {
    const config = getConfigOrThrow();
    const {
        openRouter: { apiKey, apiUrl },
    } = config;

    const openai = new OpenAI({
        apiKey,
        baseURL: apiUrl,
    });

    const promptContent = getPrompt('test-prompt.md');

    return {
        instructions: promptContent,
        model: 'openai/gpt-oss-120b',
        openai,
    };
}
