import OpenAI from 'openai';

import { getPrompt } from '../../lib/cache/prompt-cache';
import { getConfigOrThrow } from './get-config-or-throw';

/** CodeValidatorAgent для валидации кода с загрузкой промптов из .md файлов */
export function createCodeValidatorAgent() {
    const config = getConfigOrThrow();
    const {
        openRouter: { apiKey, apiUrl },
    } = config;

    const openai = new OpenAI({
        apiKey,
        baseURL: apiUrl,
    });

    const promptContent = getPrompt('validate-code.md');

    return {
        instructions: promptContent,
        model: 'openai/gpt-oss-120b',
        openai,
    };
}

