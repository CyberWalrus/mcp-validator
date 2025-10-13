import { getConfigOrThrow } from '../../../../model/config/get-config-or-throw';
import { DEFAULT_TEST_PARAMS } from '../constants';
import type { ParallelTestParams } from '../types';

/** Валидирует параметры параллельного тестирования */
export function validateTestParams(params: ParallelTestParams): void {
    const config = getConfigOrThrow();
    const { validation } = config;

    if (!validation) {
        throw new Error('Validation configuration is not available');
    }

    const { limits } = validation;

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
        if (params.timeout < limits.timeoutMin) {
            throw new Error(`Минимальный timeout: ${limits.timeoutMin}мс`);
        }

        if (params.timeout > limits.timeoutMax) {
            throw new Error(`Максимальный timeout: ${limits.timeoutMax}мс`);
        }
    }

    if (params.context !== undefined && params.context.length > limits.contextMaxLength) {
        throw new Error(`Максимальная длина контекста: ${limits.contextMaxLength} символов`);
    }
}
