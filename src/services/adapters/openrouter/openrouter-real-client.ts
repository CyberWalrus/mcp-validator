/** Реальная реализация OpenRouter клиента для production */

import { APP_CONFIG, getAppConfigError } from '../../../model/config';
import { DEFAULT_HEADERS } from './constants';
import type { OpenRouterRequest, OpenRouterResponse } from './types';

/** Выполняет запрос к OpenRouter API */
export async function makeOpenRouterRequest(params: OpenRouterRequest): Promise<OpenRouterResponse> {
    const startTime = Date.now();

    const configError = getAppConfigError();
    if (configError) {
        throw new Error(`Failed to load OpenRouter configuration: ${configError.message}`);
    }

    const config = APP_CONFIG;

    const {
        model: { name: defaultModel, maxTokens: defaultMaxTokens, temperature: defaultTemperature },
        api: { key: apiKey, url: apiUrl },
        timeouts: { apiRequest: defaultTimeout, validation: validationTimeout },
    }: {
        api: { key: string; url: string };
        model: { maxTokens: number; name: string; temperature: number };
        timeouts: { apiRequest: number; validation: number };
    } = config;

    const model: string = params.model || defaultModel;
    const timeout: number = params.timeout || defaultTimeout || validationTimeout;
    const temperature: number = params.temperature ?? defaultTemperature;
    const maxTokens: number = params.maxTokens || defaultMaxTokens;

    const normalizedBaseUrl: string = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;
    const requestUrl: string = new URL('chat/completions', normalizedBaseUrl).toString();

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
