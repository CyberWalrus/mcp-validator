import type { MockedOpenRouterResponse } from '../types';
import { clearMockResponses, setMockResponse } from './openrouter-test-client';

/** Класс для мокирования OpenRouter API */
export class MockOpenRouterAPI {
    /** Настроить ответ для запроса */
    // eslint-disable-next-line class-methods-use-this
    public mockResponse(response: MockedOpenRouterResponse): void {
        setMockResponse(response);
    }

    /** Сбросить моки */
    // eslint-disable-next-line class-methods-use-this
    public reset(): void {
        clearMockResponses();
    }
}

/** Создает мокнутый ответ OpenRouter API */
export function createMockResponse(
    content: string,
    model: string = 'gpt-4',
    totalTokens: number = 100,
): MockedOpenRouterResponse {
    return {
        choices: [
            {
                message: {
                    content,
                },
            },
        ],
        model,
        usage: {
            total_tokens: totalTokens,
        },
    };
}
