import OpenAI from 'openai';

import { getPrompt } from '../../lib/cache';
import { getConfigOrThrow } from '../../model/config/get-config-or-throw';
import type { CodeValidatorAgentResult } from './types';

/** CodeValidatorAgent для валидации кода с загрузкой промптов из .md файлов */
export function createCodeValidatorAgent(): CodeValidatorAgentResult {
    const config = getConfigOrThrow();
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
