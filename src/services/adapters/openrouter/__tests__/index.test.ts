import type { Dispatcher } from 'undici';

import { APP_CONFIG } from '../../../../model/config';
import type { MakeOpenRouterRequest as MakeOpenRouterRequestFn } from '../types';

vi.mock('undici', () => ({
    request: vi.fn(),
}));

const { request: mockRequest } = await import('undici');

let makeOpenRouterRequest: MakeOpenRouterRequestFn;

function createMockResponse(
    statusCode: number,
    body: string,
    headers?: Record<string, string>,
): Dispatcher.ResponseData {
    return {
        body: {
            text: () => Promise.resolve(body),
        },
        headers: headers || {},
        statusCode,
    } as Dispatcher.ResponseData;
}

async function reloadConfig(): Promise<void> {
    const configModule = await import('../../../../model/config');

    configModule.initializeAppConfig();
}

describe('makeOpenRouterRequest', () => {
    beforeEach(async () => {
        vi.resetModules();
        vi.clearAllMocks();
        vi.useFakeTimers();

        process.env.API_KEY = 'test-api-key';
        process.env.LOG_LEVEL = 'INFO';
        process.env.API_URL = 'https://openrouter.ai/api/v1';
        process.env.TIMEOUT_API_REQUEST = '30000';

        if (process.env.API_KEY) {
            try {
                await reloadConfig();
            } catch (error) {
                console.warn('Config reload failed in test:', error);
            }
        }

        const { makeOpenRouterRequest: realMakeOpenRouterRequest } = await import('../openrouter-real-client');

        makeOpenRouterRequest = realMakeOpenRouterRequest;
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    afterAll(() => {
        delete process.env.API_KEY;
        delete process.env.API_URL;
        delete process.env.LOG_LEVEL;
        delete process.env.TIMEOUT_API_REQUEST;
    });

    it('должен выполнить успешный запрос к OpenRouter API', async () => {
        const mockResponse = {
            choices: [
                {
                    message: {
                        content: 'Test response from AI model',
                    },
                },
            ],
            model: 'anthropic/claude-3-sonnet',
            usage: {
                total_tokens: 150,
            },
        };

        vi.mocked(mockRequest).mockResolvedValue(createMockResponse(200, JSON.stringify(mockResponse)));

        const params = {
            model: 'anthropic/claude-3-sonnet',
            prompt: 'Test prompt',
            timeout: 30000,
        };

        const result = await makeOpenRouterRequest(params);

        expect(result).toEqual({
            duration: expect.any(Number),
            model: 'anthropic/claude-3-sonnet',
            text: 'Test response from AI model',
            tokensUsed: 150,
        });

        expect(result.duration).toBeGreaterThanOrEqual(0);

        expect(mockRequest).toHaveBeenCalledWith(
            'https://openrouter.ai/api/v1/chat/completions',
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: 'Bearer test-api-key',
                    'Content-Type': 'application/json',
                }),
                method: 'POST',
                signal: expect.any(AbortSignal),
            }),
        );

        const requestCall = vi.mocked(mockRequest).mock.calls[0];
        if (requestCall && requestCall[1] && 'body' in requestCall[1]) {
            const body = JSON.parse(requestCall[1].body as string);
            expect(body).toEqual(
                expect.objectContaining({
                    max_tokens: expect.any(Number),

                    messages: [
                        {
                            content: 'Test prompt',
                            role: 'user',
                        },
                    ],

                    model: 'anthropic/claude-3-sonnet',
                    temperature: expect.any(Number),
                }),
            );
        }
    });

    it('должен использовать модель по умолчанию когда не указана', async () => {
        const mockResponse = {
            choices: [{ message: { content: 'Response' } }],
            model: APP_CONFIG.model.name,
            usage: { total_tokens: 50 },
        };

        vi.mocked(mockRequest).mockResolvedValue(createMockResponse(200, JSON.stringify(mockResponse)));

        const params = {
            prompt: 'Test without model',
        };

        const result = await makeOpenRouterRequest(params);

        expect(result.model).toBe(APP_CONFIG.model.name);

        const requestCall = vi.mocked(mockRequest).mock.calls[0];
        if (!requestCall || !requestCall[1] || !requestCall[1].body) {
            throw new Error('Expected request to be called with body');
        }
        const body = JSON.parse(requestCall[1].body as string);
        expect(body.model).toBe(APP_CONFIG.model.name);
    });

    it('должен использовать базовый URL из конфигурации', async () => {
        process.env.API_URL = 'https://api.openrouter.ai/api/v2';
        await reloadConfig();

        const mockResponse = {
            choices: [{ message: { content: 'Response' } }],
            model: APP_CONFIG.model.name,
            usage: { total_tokens: 50 },
        };

        vi.mocked(mockRequest).mockResolvedValue(createMockResponse(200, JSON.stringify(mockResponse)));

        await makeOpenRouterRequest({ prompt: 'Test prompt' });

        expect(mockRequest).toHaveBeenCalledWith(
            'https://api.openrouter.ai/api/v2/chat/completions',
            expect.any(Object),
        );

        delete process.env.API_URL;
    });

    it('должен обрабатывать HTTP ошибки', async () => {
        vi.mocked(mockRequest).mockResolvedValue(createMockResponse(401, '{"error": "Unauthorized"}'));

        const params = {
            prompt: 'Test prompt',
        };

        await expect(makeOpenRouterRequest(params)).rejects.toThrow('OpenRouter API request failed: 401');
    });

    it('должен обрабатывать сетевые ошибки', async () => {
        vi.mocked(mockRequest).mockRejectedValue(new Error('Network connection failed'));

        const params = {
            prompt: 'Test prompt',
        };

        await expect(makeOpenRouterRequest(params)).rejects.toThrow('Network connection failed');
    });

    it('должен обрабатывать отсутствие API ключа', async () => {
        delete process.env.API_KEY;

        await expect(reloadConfig()).rejects.toThrow('API_KEY is required');
    });

    it('должен обрабатывать пустой ответ от API', async () => {
        const mockResponse = {
            choices: [],
            model: 'anthropic/claude-3-haiku',
            usage: { total_tokens: 10 },
        };

        vi.mocked(mockRequest).mockResolvedValue(createMockResponse(200, JSON.stringify(mockResponse)));

        const params = {
            prompt: 'Test prompt',
        };

        await expect(makeOpenRouterRequest(params)).rejects.toThrow('No response from AI model');
    });

    it('должен обрабатывать отсутствие контента в ответе', async () => {
        const mockResponse = {
            choices: [
                {
                    message: {},
                },
            ],
            model: 'anthropic/claude-3-haiku',
            usage: { total_tokens: 10 },
        };

        vi.mocked(mockRequest).mockResolvedValue(createMockResponse(200, JSON.stringify(mockResponse)));

        const params = {
            prompt: 'Test prompt',
        };

        await expect(makeOpenRouterRequest(params)).rejects.toThrow('No content in AI response');
    });

    it('должен корректно отправлять все параметры запроса', async () => {
        const mockResponse = {
            choices: [{ message: { content: 'Response' } }],
            model: 'anthropic/claude-3-sonnet',
            usage: { total_tokens: 100 },
        };

        vi.mocked(mockRequest).mockResolvedValue(createMockResponse(200, JSON.stringify(mockResponse)));

        const params = {
            model: 'anthropic/claude-3-sonnet',
            prompt: 'Complex test prompt with special characters ñáéíóú 🚀',
            timeout: 45000,
        };

        await makeOpenRouterRequest(params);

        expect(mockRequest).toHaveBeenCalledWith(
            'https://openrouter.ai/api/v1/chat/completions',
            expect.objectContaining({
                body: expect.stringContaining('Complex test prompt with special characters ñáéíóú 🚀'),
                headers: expect.objectContaining({
                    Authorization: 'Bearer test-api-key',
                    'Content-Type': 'application/json',
                }),
                method: 'POST',
            }),
        );

        const requestCall = vi.mocked(mockRequest).mock.calls[0];
        if (!requestCall || !requestCall[1] || !requestCall[1].body) {
            throw new Error('Expected request to be called with body');
        }
        const body = JSON.parse(requestCall[1].body as string);

        expect(body).toEqual(
            expect.objectContaining({
                max_tokens: expect.any(Number),

                messages: [
                    {
                        content: 'Complex test prompt with special characters ñáéíóú 🚀',
                        role: 'user',
                    },
                ],

                model: 'anthropic/claude-3-sonnet',
                temperature: expect.any(Number),
            }),
        );
    });

    it('должен измерять время выполнения запроса', async () => {
        const mockResponse = {
            choices: [{ message: { content: 'Response' } }],
            model: 'anthropic/claude-3-haiku',
            usage: { total_tokens: 75 },
        };

        const startTime = Date.now();

        vi.mocked(mockRequest).mockResolvedValue(createMockResponse(200, JSON.stringify(mockResponse)));

        const params = {
            prompt: 'Test timing',
        };

        const result = await makeOpenRouterRequest(params);

        expect(result.duration).toBeGreaterThanOrEqual(0);
        expect(result.duration).toBe(Date.now() - startTime);
    });
});
