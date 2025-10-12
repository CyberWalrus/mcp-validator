import { error, info } from '../../../lib/helpers/logger';
import { APP_CONFIG, getAppConfigError } from '../../../model/config';
import type { AppConfig } from '../../../model/types/main';
import type { OpenRouterRequest, OpenRouterResponse } from '../../adapters/openrouter/types';
import { detectLanguageFromPath } from './helpers/detect-language-from-path';
import { formatPrompt } from './helpers/format-prompt';
import { getContentFromInput } from './helpers/get-content-from-input';
import { loadValidationPrompt } from './helpers/load-validation-prompt';
import { parseValidationResult } from './helpers/parse-validation-result';
import { validateParams } from './helpers/validate-params';
import type { ValidationContext, ValidationParams, ValidationResponse } from './types';

// Тип функции OpenRouter клиента
type OpenRouterClientFunction = (request: OpenRouterRequest) => Promise<OpenRouterResponse>;

// Кешируем импорт клиента
let openRouterClient: OpenRouterClientFunction | null = null;

function getConfigOrThrow(): AppConfig {
    const config = APP_CONFIG;

    const configError = getAppConfigError();

    if (!config || configError) {
        const message = configError?.message ?? 'Конфигурация приложения недоступна';

        throw new Error(message);
    }

    return config;
}

/** Получает правильный OpenRouter клиент в зависимости от режима */
async function getOpenRouterClient(): Promise<OpenRouterClientFunction> {
    if (openRouterClient) {
        return openRouterClient;
    }

    const config = getConfigOrThrow();

    if (config.runtime.environment === 'test' && config.runtime.isE2ETest) {
        // В E2E тестах используем мок клиент через фабрику
        const { getOpenRouterClient: createOpenRouterClient } = await import(
            '../../adapters/openrouter/openrouter-client-factory'
        );
        openRouterClient = await createOpenRouterClient();
    } else {
        // В обычном режиме используем реальный клиент
        const realClient = await import('../../adapters/openrouter');
        if ('makeOpenRouterRequest' in realClient && typeof realClient.makeOpenRouterRequest === 'function') {
            openRouterClient = realClient.makeOpenRouterRequest;
        } else {
            throw new Error('Реальный клиент не содержит функцию makeOpenRouterRequest');
        }
    }

    return openRouterClient;
}

/** Выполняет валидацию кода согласно указанным параметрам */
export async function validateCode(params: ValidationParams): Promise<ValidationResponse> {
    const startTime = Date.now();

    try {
        info('Начинаю валидацию кода', {
            inputType: params.input.type,
            type: params.validationType,
        });

        validateParams(params);

        const content = await getContentFromInput(params);

        const language =
            params.language || (params.input.type === 'file' ? detectLanguageFromPath(params.input.data) : 'text');

        const context: ValidationContext = {
            code: content.main,
            language,
            ...(content.additional && { additionalFiles: content.additional }),
            ...(params.context && { context: params.context }),
        };

        const formattedPrompt = (() => {
            const promptTemplate = loadValidationPrompt(params.validationType);

            return formatPrompt(promptTemplate, context);
        })();

        const makeOpenRouterRequest: OpenRouterClientFunction = await getOpenRouterClient();
        const aiResponse = await makeOpenRouterRequest({
            prompt: formattedPrompt,
            timeout: 30000,
        });

        // Проверяем что response имеет правильную структуру
        if (typeof aiResponse !== 'object' || aiResponse === null) {
            throw new Error('Некорректный ответ от OpenRouter API');
        }

        const typedResponse = aiResponse;
        const result = parseValidationResult(typedResponse.text);

        const duration = Date.now() - startTime;

        info('Валидация кода завершена', {
            duration,
            success: result.success,
            type: params.validationType,
        });

        const responseData = {
            ...result,
            duration,
            metadata: {
                ...result.metadata,
                additionalFilesCount: content.additional?.length || 0,
                detectedLanguage: language,
                model: typedResponse.model,
            },
            promptUsed: formattedPrompt,
            score: (result.metadata?.score as number) || (result.success ? 85 : 45),
            type: params.validationType,
        };

        if (typedResponse.tokensUsed !== undefined) {
            return {
                ...responseData,
                tokensUsed: typedResponse.tokensUsed,
            };
        }

        return responseData;
    } catch (err) {
        const duration = Date.now() - startTime;
        error('Ошибка валидации кода', { duration, error: err });
        throw err;
    }
}
