/** Реальная реализация OpenRouter клиента для production */

import { APP_CONFIG, getAppConfigError } from '../../../model/config';
import type { AppConfig } from '../../../model/types/main';
import { DEFAULT_HEADERS, DEFAULT_MAX_TOKENS, DEFAULT_TEMPERATURE } from './constants';
import type { OpenRouterRequest, OpenRouterResponse } from './types';

function getConfigOrThrow(): AppConfig {
    const config = APP_CONFIG;

    const configError = getAppConfigError();

    if (!config || configError) {
        const message = configError?.message
            ? `Failed to load OpenRouter configuration: ${configError.message}`
            : 'Failed to load OpenRouter configuration';

        throw new Error(message);
    }

    return config;
}

/** Выполняет запрос к OpenRouter API */
export async function makeOpenRouterRequest(params: OpenRouterRequest): Promise<OpenRouterResponse> {
    const startTime = Date.now();

    const config = getConfigOrThrow();
    const {
        ai: { defaultModel },
        openRouter: { apiKey, apiUrl, timeout: defaultTimeout },
        validation: { timeout: validationTimeout },
    } = config;

    const model = params.model || defaultModel;
    const timeout = params.timeout || defaultTimeout || validationTimeout;
    const temperature = params.temperature || DEFAULT_TEMPERATURE;
    const maxTokens = params.maxTokens || DEFAULT_MAX_TOKENS;

    const normalizedBaseUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;
    const requestUrl = new URL('chat/completions', normalizedBaseUrl).toString();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(requestUrl, {
            body: JSON.stringify({
                max_tokens: maxTokens,
                messages: [{ content: params.prompt, role: 'user' }],
                model,
                temperature,
            }),
            headers: {
                ...DEFAULT_HEADERS,
                Authorization: `Bearer ${apiKey}`,
            },
            method: 'POST',
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`OpenRouter API request failed: ${response.status} ${response.statusText}`);
        }

        const data = (await response.json()) as {
            choices: Array<{ message?: { content?: string } }>;
            model: string;
            usage: { total_tokens: number };
        };

        if (!data.choices || data.choices.length === 0) {
            throw new Error('No response from AI model');
        }

        const choice = data.choices[0];
        if (!choice?.message?.content) {
            throw new Error('No content in AI response');
        }

        const duration = Date.now() - startTime;

        return {
            duration,
            model: data.model,
            text: choice.message.content,
            tokensUsed: data.usage.total_tokens,
        };
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

export type MakeOpenRouterRequest = typeof makeOpenRouterRequest;
