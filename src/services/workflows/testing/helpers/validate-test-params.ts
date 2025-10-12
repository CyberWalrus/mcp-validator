import { DEFAULT_TEST_PARAMS } from '../constants';
import type { ParallelTestParams } from '../types';

/** Валидирует параметры параллельного тестирования */
export function validateTestParams(params: ParallelTestParams): void {
    if (!params.prompt || params.prompt.trim().length === 0) {
        throw new Error('Промпт не может быть пустым');
    }

    if (params.iterations !== undefined) {
        if (params.iterations < DEFAULT_TEST_PARAMS.MIN_ITERATIONS) {
            throw new Error(`Минимальное количество итераций: ${DEFAULT_TEST_PARAMS.MIN_ITERATIONS}`);
        }

        if (params.iterations > DEFAULT_TEST_PARAMS.MAX_ITERATIONS) {
            throw new Error(`Максимальное количество итераций: ${DEFAULT_TEST_PARAMS.MAX_ITERATIONS}`);
        }
    }

    if (params.timeout !== undefined) {
        if (params.timeout < 1000) {
            throw new Error('Минимальный timeout: 1000мс');
        }

        if (params.timeout > 120000) {
            throw new Error('Максимальный timeout: 120000мс');
        }
    }

    if (params.models !== undefined) {
        if (params.models.length === 0) {
            throw new Error('Должна быть указана минимум одна модель');
        }

        if (params.models.length > 5) {
            throw new Error('Максимальное количество моделей: 5');
        }
    }

    if (params.context !== undefined && params.context.length > 5000) {
        throw new Error('Максимальная длина контекста: 5000 символов');
    }
}
