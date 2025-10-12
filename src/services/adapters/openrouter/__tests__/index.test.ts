import type { MakeOpenRouterRequest as MakeOpenRouterRequestFn } from '..';
import { DEFAULT_MODEL } from '../constants';

global.fetch = vi.fn();
const mockFetch = vi.mocked(fetch);

let makeOpenRouterRequest: MakeOpenRouterRequestFn;

async function reloadConfig(): Promise<void> {
    const configModule = await import('../../../../model/config');

    configModule.reloadAppConfig();
}

describe('makeOpenRouterRequest', () => {
    beforeEach(async () => {
        vi.resetModules();
        vi.clearAllMocks();
        vi.useFakeTimers();

        // Всегда мокируем API ключ для тестов
        process.env.OPENROUTER_API_KEY = 'test-api-key';
        await reloadConfig();

        const module = await import('..');

        makeOpenRouterRequest = module.makeOpenRouterRequest;
    });

    afterEach(async () => {
        vi.useRealTimers();
        delete process.env.OPENROUTER_API_KEY;
        delete process.env['OPENROUTER_API_URL'];
        delete process.env['OPENROUTER_TIMEOUT'];
        await reloadConfig();
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

        mockFetch.mockResolvedValue({
            json: () => Promise.resolve(mockResponse),
            ok: true,
        } as Response);

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

        // Проверяем что запрос отправлен с правильными параметрами
        expect(mockFetch).toHaveBeenCalledWith(
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

        // Проверяем структуру body отдельно
        const fetchCall = mockFetch.mock.calls[0];
        if (fetchCall && fetchCall[1] && 'body' in fetchCall[1]) {
            const body = JSON.parse(fetchCall[1].body as string);
            expect(body).toEqual(
                expect.objectContaining({
                    // Используем динамические значения - не проверяем конкретные числа
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
        // Мокируем ответ с моделью по умолчанию из констант
        const mockResponse = {
            choices: [{ message: { content: 'Response' } }],
            model: DEFAULT_MODEL,
            usage: { total_tokens: 50 },
        };

        mockFetch.mockResolvedValue({
            json: () => Promise.resolve(mockResponse),
            ok: true,
        } as Response);

        const params = {
            prompt: 'Test without model',
        };

        const result = await makeOpenRouterRequest(params);

        // Проверяем что используется модель по умолчанию (любая)
        expect(result.model).toBe(DEFAULT_MODEL);

        // Проверяем что в запросе отправлена модель по умолчанию
        const fetchCall = mockFetch.mock.calls[0];
        if (!fetchCall || !fetchCall[1] || !fetchCall[1].body) {
            throw new Error('Expected fetch to be called with body');
        }
        const body = JSON.parse(fetchCall[1].body as string);
        expect(body.model).toBe(DEFAULT_MODEL);
    });

    it('должен использовать базовый URL из конфигурации', async () => {
        process.env['OPENROUTER_API_URL'] = 'https://api.openrouter.ai/api/v2';
        await reloadConfig();

        const mockResponse = {
            choices: [{ message: { content: 'Response' } }],
            model: DEFAULT_MODEL,
            usage: { total_tokens: 50 },
        };

        mockFetch.mockResolvedValue({
            json: () => Promise.resolve(mockResponse),
            ok: true,
        } as Response);

        await makeOpenRouterRequest({ prompt: 'Test prompt' });

        expect(mockFetch).toHaveBeenCalledWith('https://api.openrouter.ai/api/v2/chat/completions', expect.any(Object));

        delete process.env['OPENROUTER_API_URL'];
    });

    it('должен обрабатывать HTTP ошибки', async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            status: 401,
            statusText: 'Unauthorized',
        } as Response);

        const params = {
            prompt: 'Test prompt',
        };

        await expect(makeOpenRouterRequest(params)).rejects.toThrow('OpenRouter API request failed: 401 Unauthorized');
    });

    it('должен обрабатывать сетевые ошибки', async () => {
        mockFetch.mockRejectedValue(new Error('Network connection failed'));

        const params = {
            prompt: 'Test prompt',
        };

        await expect(makeOpenRouterRequest(params)).rejects.toThrow('Network connection failed');
    });

    it('должен обрабатывать отсутствие API ключа', async () => {
        delete process.env.OPENROUTER_API_KEY;
        await reloadConfig();

        const params = {
            prompt: 'Test prompt',
        };

        await expect(makeOpenRouterRequest(params)).rejects.toThrow(
            'Failed to load OpenRouter configuration: OPENROUTER_API_KEY is required',
        );
    });

    it('должен обрабатывать пустой ответ от API', async () => {
        const mockResponse = {
            choices: [],
            model: 'anthropic/claude-3-haiku',
            usage: { total_tokens: 10 },
        };

        mockFetch.mockResolvedValue({
            json: () => Promise.resolve(mockResponse),
            ok: true,
        } as Response);

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

        mockFetch.mockResolvedValue({
            json: () => Promise.resolve(mockResponse),
            ok: true,
        } as Response);

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

        mockFetch.mockResolvedValue({
            json: () => Promise.resolve(mockResponse),
            ok: true,
        } as Response);

        const params = {
            model: 'anthropic/claude-3-sonnet',
            prompt: 'Complex test prompt with special characters ñáéíóú 🚀',
            timeout: 45000,
        };

        await makeOpenRouterRequest(params);

        expect(mockFetch).toHaveBeenCalledWith(
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

        const fetchCall = mockFetch.mock.calls[0];
        if (!fetchCall || !fetchCall[1] || !fetchCall[1].body) {
            throw new Error('Expected fetch to be called with body');
        }
        const body = JSON.parse(fetchCall[1].body as string);

        // Проверяем структуру body без проверки конкретных значений констант
        expect(body).toEqual(
            expect.objectContaining({
                // Проверяем что значения есть, но не конкретные числа
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

        mockFetch.mockImplementation(
            () =>
                new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({
                            json: () => Promise.resolve(mockResponse),
                            ok: true,
                        } as Response);
                    }, 1500);
                }),
        );

        const params = {
            prompt: 'Test timing',
        };

        vi.useRealTimers();

        const result = await makeOpenRouterRequest(params);

        expect(result.duration).toBeGreaterThan(1000);
        expect(result.duration).toBeLessThan(2000);
    });
});
