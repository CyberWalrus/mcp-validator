import OpenAI from 'openai';

import { getPrompt } from '../../lib/cache';
import { getConfigOrThrow } from '../../lib/helpers/config/get-config-or-throw';
import type { CodeValidatorAgentResult } from './types';

/** CodeValidatorAgent для валидации кода с загрузкой промптов из .md файлов */
export function createCodeValidatorAgent(): CodeValidatorAgentResult {
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
