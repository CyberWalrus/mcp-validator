import OpenAI from 'openai';

import { getPrompt } from '../../lib/cache';
import { APP_CONFIG } from '../../model/config';
import type { TestPromptAgentResult } from './types';

/** TestPromptAgent для параллельного тестирования промптов */
export function createTestPromptAgent(): TestPromptAgentResult {
    try {
        const config = APP_CONFIG;
        const {
            api: { key, url, providers },
            model: { name: modelName },
        } = config;

        const openai = new OpenAI({
            apiKey: key,
            baseURL: url,
        });

        const promptContent = getPrompt('test-prompt.md');

        return {
            instructions: promptContent,
            model: modelName,
            openai,
            providers,
        };
    } catch (error) {
        throw new Error(
            `Failed to create test prompt agent: ${error instanceof Error ? error.message : String(error)}`,
        );
    }
}
