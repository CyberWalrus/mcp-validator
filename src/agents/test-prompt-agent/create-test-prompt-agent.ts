import OpenAI from 'openai';

import { getPrompt } from '../../lib/cache';
import { getConfigOrThrow } from '../../model/config/get-config-or-throw';
import type { TestPromptAgentResult } from './types';

/** TestPromptAgent для параллельного тестирования промптов */
export function createTestPromptAgent(): TestPromptAgentResult {
    try {
        const config = getConfigOrThrow();
        const {
            api: { key, url },
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
        };
    } catch (error) {
        throw new Error(
            `Failed to create test prompt agent: ${error instanceof Error ? error.message : String(error)}`,
        );
    }
}
