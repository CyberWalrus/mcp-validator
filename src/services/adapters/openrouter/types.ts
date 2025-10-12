/** Параметры запроса к OpenRouter API */
export type OpenRouterRequest = {
    prompt: string;
    maxTokens?: number;
    model?: string;
    temperature?: number;
    timeout?: number;
};

/** Ответ от OpenRouter API */
export type OpenRouterResponse = {
    duration: number;
    model: string;
    text: string;
    tokensUsed: number;
};

/** Тип функции OpenRouter клиента */
export type OpenRouterClientFunction = (request: OpenRouterRequest) => Promise<OpenRouterResponse>;

/** Тип функции makeOpenRouterRequest */
export type MakeOpenRouterRequest = (params: OpenRouterRequest) => Promise<OpenRouterResponse>;
