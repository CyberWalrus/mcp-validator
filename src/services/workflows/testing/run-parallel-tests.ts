/* eslint-disable @typescript-eslint/no-use-before-define */
import { error, info } from '../../../lib/helpers/logger';
import { getPackageVersion } from '../../../lib/helpers/version-resolver';
import { APP_CONFIG, getAppConfigError } from '../../../model/config';
import type { AppConfig } from '../../../model/types/main';
import type { OpenRouterRequest, OpenRouterResponse } from '../../adapters/openrouter/types';
import { formatAnalyzePrompt, formatExecutePrompt } from './helpers/format-test-prompt';
import { loadAnalyzePrompt, loadExecutePrompt } from './helpers/load-test-prompt';
import { validateTestParams } from './helpers/validate-test-params';
import { analyzeTestConsistency } from './analyze-test-consistency';
import { DEFAULT_TEST_PARAMS } from './constants';
import { ParallelTestParamsSchema } from './schemas';
import type { ParallelTestParams, ParallelTestResult, TestIterationResult } from './types';

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

/** Выполняет параллельное тестирование промпта для проверки консистентности */
export async function runParallelTests(params: ParallelTestParams): Promise<ParallelTestResult> {
    const startTime = new Date();

    try {
        info('Начинаю параллельное тестирование промпта', {
            iterations: params.iterations || DEFAULT_TEST_PARAMS.ITERATIONS,
            prompt: params.prompt.substring(0, 100),
        });

        validateTestParams(params);
        const validatedParams = ParallelTestParamsSchema.parse(params);

        // ЭТАП 1: Выполнение тестируемого промпта через AI (получение 5 ответов)
        info('Этап 1: Выполняю тестируемый промпт через AI модели');
        const executePromptTemplate = loadExecutePrompt();
        const formattedExecutePrompt = formatExecutePrompt(
            executePromptTemplate,
            validatedParams.prompt,
            validatedParams.context,
        );

        const config = getConfigOrThrow();
        const models = validatedParams.models || [config.ai.defaultModel];

        const testPromises = Array.from({ length: validatedParams.iterations }, (_, index) =>
            runSingleTest({
                iteration: index + 1,
                model: models[index % models.length] || config.ai.defaultModel,
                prompt: formattedExecutePrompt,
                timeout: validatedParams.timeout,
            }),
        );

        const executeResults = await Promise.all(testPromises);

        // ЭТАП 2: Анализ полученных ответов через специализированный промпт
        info('Этап 2: Анализирую полученные ответы на консистентность и качество');
        const analyzePromptTemplate = loadAnalyzePrompt();
        const responses = executeResults.filter((result) => result.success).map((result) => result.response || '');

        if (responses.length === 0) {
            throw new Error('Все тесты завершились неудачей - нет ответов для анализа');
        }

        const formattedAnalyzePrompt = formatAnalyzePrompt(
            analyzePromptTemplate,
            validatedParams.prompt,
            responses,
            validatedParams.context,
        );

        // Выполняем анализ через один из успешных моделей
        const successfulModel = executeResults.find((r) => r.success)?.model || models[0];
        const analysisResult = await runSingleTest({
            iteration: 'analysis',
            model: successfulModel,
            prompt: formattedAnalyzePrompt,
            timeout: validatedParams.timeout,
        });

        // Для обратной совместимости также используем старый анализ консистентности
        const consistency = analyzeTestConsistency(executeResults);

        const successfulTests = executeResults.filter((r) => r.success).length;
        const failedTests = executeResults.length - successfulTests;
        const averageResponseTime = executeResults.reduce((sum, r) => sum + r.responseTime, 0) / executeResults.length;

        const endTime = new Date();
        const duration = endTime.getTime() - startTime.getTime();

        // Объединяем результаты выполнения и анализа
        const allResults = [...executeResults];
        if (analysisResult.success) {
            allResults.push(analysisResult);
        }

        const result: ParallelTestResult = {
            averageResponseTime: Math.round(averageResponseTime),
            consistency: {
                ...consistency,
                // Добавляем результат нового анализа в consistency, только если есть успешный результат
                ...(analysisResult.success && analysisResult.response
                    ? {
                          aiAnalysis: analysisResult.response,
                          hasAiAnalysis: true,
                      }
                    : {
                          hasAiAnalysis: false,
                      }),
            },
            failedTests,
            metadata: {
                context: validatedParams.context || '',
                duration,
                endTime: endTime.toISOString(),
                models,
                originalPrompt: validatedParams.prompt,
                startTime: startTime.toISOString(),
                validatorVersion: getPackageVersion(), // Версия из единого источника
            },
            results: allResults,
            success: successfulTests > 0 && analysisResult.success,
            successfulTests,
            totalTests: executeResults.length,
        };

        info('Параллельное тестирование завершено', {
            consistencyScore: consistency.score,
            duration,
            successfulTests,
        });

        return result;
    } catch (err) {
        const endTime = new Date();
        const duration = endTime.getTime() - startTime.getTime();

        error('Ошибка параллельного тестирования', { duration, error: err });

        const config = getConfigOrThrow();

        return {
            averageResponseTime: 0,
            consistency: {
                analysis: `Ошибка выполнения тестирования: ${String(err)}`,
                anomalies: [],
                patterns: [],
                recommendations: ['Проверьте параметры тестирования', 'Убедитесь в доступности API'],
                score: 0,
            },
            failedTests: params.iterations || DEFAULT_TEST_PARAMS.ITERATIONS,
            metadata: {
                context: params.context || '',
                duration: new Date().getTime() - startTime.getTime(),
                endTime: new Date().toISOString(),
                models: params.models || [config.ai.defaultModel],
                originalPrompt: params.prompt,
                startTime: startTime.toISOString(),
                validatorVersion: '2.0.0',
            },
            results: [],
            success: false,
            successfulTests: 0,
            totalTests: params.iterations || DEFAULT_TEST_PARAMS.ITERATIONS,
        };
    }
}

/** Выполняет одну итерацию теста */
async function runSingleTest({
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

        // Проверяем что response имеет правильную структуру
        if (typeof response !== 'object' || response === null) {
            throw new Error('Некорректный ответ от OpenRouter API');
        }

        const typedResponse = response;

        return {
            endTime: endTime.toISOString(),
            iteration,
            model: typedResponse.model,
            response: typedResponse.text,
            responseTime: typedResponse.duration,
            startTime: startTime.toISOString(),
            success: true,
        };
    } catch (err) {
        const endTime = new Date();

        return {
            endTime: endTime.toISOString(),
            error: String(err),
            iteration,
            model,
            responseTime: endTime.getTime() - startTime.getTime(),
            startTime: startTime.toISOString(),
            success: false,
        };
    }
}
