import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getConfigOrThrow } from '../../../../../model/config/get-config-or-throw';
import type { ParallelTestParams } from '../../types';
import { validateTestParams } from '../validate-test-params';

vi.mock('../../../../../model/config/get-config-or-throw', () => ({
    getConfigOrThrow: vi.fn(),
}));

describe('validateTestParams', () => {
    beforeEach(() => {
        vi.mocked(getConfigOrThrow).mockReturnValue({
            validation: {
                limits: {
                    contextMaxLength: 5000,
                    timeoutMax: 120000,
                    timeoutMin: 1000,
                },
            },
        } as ReturnType<typeof getConfigOrThrow>);
    });

    it('должен успешно валидировать корректные параметры', () => {
        const params: ParallelTestParams = {
            context: 'Тестовый контекст',
            iterations: 5,
            prompt: 'Тестовый промпт',
            timeout: 30000,
        };

        expect(() => validateTestParams(params)).not.toThrow();
    });

    it('должен выбрасывать ошибку для пустого промпта', () => {
        const params: ParallelTestParams = {
            prompt: '',
        };

        expect(() => validateTestParams(params)).toThrow('Промпт не может быть пустым');
    });

    it('должен выбрасывать ошибку для промпта только с пробелами', () => {
        const params: ParallelTestParams = {
            prompt: '   ',
        };

        expect(() => validateTestParams(params)).toThrow('Промпт не может быть пустым');
    });

    it('должен выбрасывать ошибку для слишком малого количества итераций', () => {
        const params: ParallelTestParams = {
            iterations: 2,
            prompt: 'Тест',
        };

        expect(() => validateTestParams(params)).toThrow('Минимальное количество итераций: 3');
    });

    it('должен выбрасывать ошибку для слишком большого количества итераций', () => {
        const params: ParallelTestParams = {
            iterations: 15,
            prompt: 'Тест',
        };

        expect(() => validateTestParams(params)).toThrow('Максимальное количество итераций: 10');
    });

    it('должен выбрасывать ошибку для слишком малого timeout', () => {
        const params: ParallelTestParams = {
            prompt: 'Тест',
            timeout: 500,
        };

        expect(() => validateTestParams(params)).toThrow('Минимальный timeout: 1000мс');
    });

    it('должен выбрасывать ошибку для слишком большого timeout', () => {
        const params: ParallelTestParams = {
            prompt: 'Тест',
            timeout: 200000,
        };

        expect(() => validateTestParams(params)).toThrow('Максимальный timeout: 120000мс');
    });

    it('должен выбрасывать ошибку для слишком длинного контекста', () => {
        const params: ParallelTestParams = {
            context: 'a'.repeat(5001),
            prompt: 'Тест',
        };

        expect(() => validateTestParams(params)).toThrow('Максимальная длина контекста: 5000 символов');
    });

    it('должен работать с минимальными параметрами', () => {
        const params: ParallelTestParams = {
            prompt: 'Минимальный тест',
        };

        expect(() => validateTestParams(params)).not.toThrow();
    });
});
