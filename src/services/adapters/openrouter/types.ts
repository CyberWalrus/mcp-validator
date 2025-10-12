/** Параметры запроса к OpenRouter API */
export type OpenRouterRequest = {
    /** Промпт для обработки */
    prompt: string;
    /** Максимальное количество токенов */
    maxTokens?: number;
    /** Модель AI для использования */
    model?: string;
    /** Температура для генерации (0-1) */
    temperature?: number;
    /** Таймаут запроса в миллисекундах */
    timeout?: number;
};

/** Ответ от OpenRouter API */
export type OpenRouterResponse = {
    /** Время выполнения запроса в миллисекундах */
    duration: number;
    /** Модель которая обработала запрос */
    model: string;
    /** Текст ответа от AI модели */
    text: string;
    /** Количество использованных токенов */
    tokensUsed: number;
};

/** Тип функции OpenRouter клиента */
export type OpenRouterClientFunction = (request: OpenRouterRequest) => Promise<OpenRouterResponse>;
