import { error, info } from '../../../lib/helpers/logger';
import { getPackageVersion } from '../../../lib/helpers/version';
import { formatAnalyzePrompt, formatExecutePrompt } from './helpers/format-test-prompt';
import { getConfigOrThrow } from './helpers/get-config-or-throw';
import { loadAnalyzePrompt, loadExecutePrompt } from './helpers/load-test-prompt';
import { runSingleTest } from './helpers/run-single-test';
import { validateTestParams } from './helpers/validate-test-params';
import { analyzeTestConsistency } from './analyze-test-consistency';
import { DEFAULT_TEST_PARAMS } from './constants';
import { ParallelTestParamsSchema } from './schemas';
import type { ParallelTestParams, ParallelTestResult } from './types';

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

        info('Этап 1: Выполняю тестируемый промпт через AI модели');
        const executePromptTemplate = loadExecutePrompt();
        const formattedExecutePrompt = formatExecutePrompt(
            executePromptTemplate,
            validatedParams.prompt,
            validatedParams.context,
        );

        const config = getConfigOrThrow();

        const testPromises = Array.from({ length: validatedParams.iterations }, (_, index) =>
            runSingleTest({
                iteration: index + 1,
                model: config.model.name,
                prompt: formattedExecutePrompt,
                timeout: validatedParams.timeout || config.timeouts.apiRequest,
            }),
        );

        const executeResults = await Promise.all(testPromises);

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

        const analysisResult = await runSingleTest({
            iteration: 'analysis',
            model: config.model.name,
            prompt: formattedAnalyzePrompt,
            timeout: validatedParams.timeout || config.timeouts.apiRequest,
        });

        const consistency = analyzeTestConsistency(executeResults);

        const successfulTests = executeResults.filter((r) => r.success).length;
        const failedTests = executeResults.length - successfulTests;
        const averageResponseTime = executeResults.reduce((sum, r) => sum + r.responseTime, 0) / executeResults.length;

        const endTime = new Date();
        const duration = endTime.getTime() - startTime.getTime();

        const allResults = [...executeResults];
        if (analysisResult.success) {
            allResults.push(analysisResult);
        }

        const result: ParallelTestResult = {
            averageResponseTime: Math.round(averageResponseTime),
            consistency: {
                ...consistency,
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
