/** MCP инструмент test-prompt - инкапсуляция логики тестирования промптов */

import type { TestResult } from '../../model/types/main';
import { runParallelTests } from '../../services/workflows/testing';
import type { TestPromptInput, TestPromptResult } from './types';

/** Обрабатывает MCP запрос test-prompt инструмента */
export async function handleTestPromptToolRequest(params: TestPromptInput): Promise<TestPromptResult> {
    const testResult = await runParallelTests({
        ...(params.context && { context: params.context }),
        iterations: params.iterations || 5,
        ...(params.models && { models: params.models }),
        prompt: params.prompt,
        ...(params.timeout && { timeout: params.timeout }),
    });

    const results: TestResult[] = testResult.results.map((r) => ({
        duration: r.responseTime,
        message: r.success ? r.response || '' : r.error || 'Неизвестная ошибка',
        metadata: {
            endTime: r.endTime,
            iteration: r.iteration,
            model: r.model,
            startTime: r.startTime,
        },
        status: r.success ? ('success' as const) : ('error' as const),
    }));

    const successCount = results.filter((r) => r.status === 'success').length;
    const errorCount = results.length - successCount;
    const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

    return {
        results,
        summary: {
            errorCount,
            successCount,
            totalDuration,
        },
    };
}
