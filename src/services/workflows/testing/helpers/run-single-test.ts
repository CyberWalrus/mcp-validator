import type { OpenRouterRequest, OpenRouterResponse } from '../../../adapters/openrouter/types';
import type { TestIterationResult } from '../types';
import { getOpenRouterClient } from './get-open-router-client';

type OpenRouterClientFunction = (request: OpenRouterRequest) => Promise<OpenRouterResponse>;

/** Выполняет одну итерацию теста */
export async function runSingleTest({
    iteration,
    prompt,
    model,
    timeout,
}: {
    iteration: number | string;
    model: string;
    prompt: string;
    timeout: number;
}): Promise<TestIterationResult> {
    const startTime = new Date();

    try {
        const makeOpenRouterRequest: OpenRouterClientFunction = await getOpenRouterClient();
        const response = await makeOpenRouterRequest({
            model,
            prompt,
            timeout,
        });

        const endTime = new Date();

        if (typeof response !== 'object' || response === null) {
            throw new Error('Некорректный ответ от OpenRouter API');
        }

        const typedResponse = response;

        return {
            content: typedResponse.text,
            duration: typedResponse.duration,
            endTime: endTime.toISOString(),
            isSuccess: true,
            iteration,
            model: typedResponse.model,
            startTime: startTime.toISOString(),
        };
    } catch (err) {
        const endTime = new Date();

        return {
            content: '',
            duration: endTime.getTime() - startTime.getTime(),
            endTime: endTime.toISOString(),
            error: String(err),
            isSuccess: false,
            iteration,
            model,
            startTime: startTime.toISOString(),
        };
    }
}
