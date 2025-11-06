import OpenAI from 'openai';

import { getPrompt } from '../../lib/cache';
import { APP_CONFIG } from '../../model/config';
import type { VerifyInfoAgentResult } from './types';

/** Создает агент для проверки информации с загрузкой промпта */
export function createVerifyInfoAgent(): VerifyInfoAgentResult {
    const config = APP_CONFIG;
    const {
        api: { key, url, providers },
        model: { name: modelName },
    } = config;

    const openai = new OpenAI({
        apiKey: key,
        baseURL: url,
    });

    const promptContent = getPrompt('verification/verify-info.md');

    return {
        instructions: promptContent,
        model: modelName,
        openai,
        providers,
    };
}
