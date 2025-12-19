/** Реальная реализация OpenRouter клиента для production */

import { request } from 'undici';

import { APP_CONFIG } from '../../../model/config';
import { DEFAULT_HEADERS } from './constants';
import type { OpenRouterRequest, OpenRouterResponse } from './types';

/** Выполняет запрос к OpenRouter API */
export async function makeOpenRouterRequest(params: OpenRouterRequest): Promise<OpenRouterResponse> {
    const startTime = Date.now();
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

    const requestBody: Record<string, unknown> = {
        max_tokens: maxTokens,
        messages: [{ content: params.prompt, role: 'user' }],
        model,
        temperature,
    };

    if (config.api.providers && config.api.providers.length > 0) {
        requestBody.provider = {
            only: config.api.providers,
        };
    }

    try {
        const { statusCode, body, headers } = await request(requestUrl, {
            body: JSON.stringify(requestBody),
            headers: {
                ...DEFAULT_HEADERS,
                Authorization: `Bearer ${apiKey}`,
            },
            method: 'POST',
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (statusCode < 200 || statusCode >= 300) {
            throw new Error(`OpenRouter API request failed: ${statusCode}`);
        }

        const responseText = await body.text();
        const data = JSON.parse(responseText) as {
            choices: Array<{ message?: { content?: string } }>;
            model: string;
            usage: { total_tokens: number };
        };

        if (data.choices === null || data.choices === undefined || data.choices.length === 0) {
            throw new Error('No response from AI model');
        }

        const choice = data.choices[0];
        if (
            choice === null ||
            choice === undefined ||
            choice.message === null ||
            choice.message === undefined ||
            choice.message.content === null ||
            choice.message.content === undefined
        ) {
            throw new Error('No content in AI response');
        }

        const duration = Date.now() - startTime;

        const getHeaderValue = (headerName: string): string | undefined => {
            if (headers === null || headers === undefined) {
                return undefined;
            }

            const header = headers[headerName] || headers[headerName.toLowerCase()];
            if (header === null || header === undefined) {
                return undefined;
            }

            return Array.isArray(header) ? header[0] : header;
        };

        const provider = getHeaderValue('x-provider');
        const totalCost = getHeaderValue('x-total-cost') || getHeaderValue('x-tokens-total-cost');

        return {
            duration,
            model: data.model,
            text: choice.message.content,
            tokensUsed: data.usage.total_tokens,
            ...(provider ? { provider } : {}),
            ...(totalCost ? { totalCost } : {}),
        };
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}
