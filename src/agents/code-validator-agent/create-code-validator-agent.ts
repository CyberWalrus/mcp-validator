import OpenAI from 'openai';

import { getPrompt } from '../../lib/cache';
import { APP_CONFIG } from '../../model/config';
import type { CodeValidatorAgentResult } from './types';

/** CodeValidatorAgent для валидации кода с загрузкой промптов из .md файлов */
export function createCodeValidatorAgent(): CodeValidatorAgentResult {
    const config = APP_CONFIG;
    const {
        api: { key, url },
        model: { name: modelName },
    } = config;

    const openai = new OpenAI({
        apiKey: key,
        baseURL: url,
    });

    const promptContent = getPrompt('validate-code.md');

    return {
        instructions: promptContent,
        model: modelName,
        openai,
    };
}
