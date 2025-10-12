import OpenAI from 'openai';

import { getPrompt } from '../../lib/cache';
import { getConfigOrThrow } from '../../model/config/get-config-or-throw';
import type { TestPromptAgentResult } from './types';

/** TestPromptAgent для параллельного тестирования промптов */
export function createTestPromptAgent(): TestPromptAgentResult {
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
