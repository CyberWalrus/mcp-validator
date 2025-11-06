import { describe, expect, it } from 'vitest';

import type { VerificationCheckResult } from '../../../model/config';
import { combineVerificationResults } from '../combine-verification-results';

describe('combineVerificationResults', () => {
    it('должен вернуть ошибку для пустого массива проверок', () => {
        const result = combineVerificationResults([]);

        expect(result.success).toBe(false);
        expect(result.checks).toEqual([]);
        expect(result.error).toBe('Нет данных для проверки');
        expect(result.overallScore).toBe(0);
    });

    it('должен комбинировать результаты успешных проверок', () => {
        const checks: VerificationCheckResult[] = [
            {
                checkType: 'check1',
                content: 'Результат проверки 1',
                duration: 100,
                isSuccess: true,
                tokensUsed: 50,
            },
            {
                checkType: 'check2',
                content: 'Результат проверки 2',
                duration: 150,
                isSuccess: true,
                tokensUsed: 60,
            },
            {
                checkType: 'check3',
                content: 'Результат проверки 3',
                duration: 120,
                isSuccess: true,
                tokensUsed: 55,
            },
        ];

        const result = combineVerificationResults(checks);

        expect(result.success).toBe(true);
        expect(result.checks).toHaveLength(3);
        expect(result.totalDuration).toBe(370);
        expect(result.totalTokensUsed).toBe(165);
        expect(result.overallScore).toBe(100);
        expect(result.combinedReport).toContain('**Успешных проверок:** 3/3');
        expect(result.combinedReport).toContain('check1');
        expect(result.combinedReport).toContain('check2');
        expect(result.combinedReport).toContain('check3');
    });

    it('должен обработать частично успешные проверки', () => {
        const checks: VerificationCheckResult[] = [
            {
                checkType: 'check1',
                content: 'Успешная проверка',
                duration: 100,
                isSuccess: true,
                tokensUsed: 50,
            },
            {
                checkType: 'check2',
                content: '',
                duration: 50,
                error: 'Ошибка проверки',
                isSuccess: false,
                tokensUsed: 0,
            },
            {
                checkType: 'check3',
                content: 'Еще одна успешная',
                duration: 120,
                isSuccess: true,
                tokensUsed: 55,
            },
        ];

        const result = combineVerificationResults(checks);

        expect(result.success).toBe(true);
        expect(result.overallScore).toBe(67);
        expect(result.combinedReport).toContain('**Успешных проверок:** 2/3');
        expect(result.combinedReport).toContain('Ошибка проверки');
    });

    it('должен обработать все неуспешные проверки', () => {
        const checks: VerificationCheckResult[] = [
            {
                checkType: 'check1',
                content: '',
                duration: 100,
                error: 'Ошибка 1',
                isSuccess: false,
                tokensUsed: 0,
            },
            {
                checkType: 'check2',
                content: '',
                duration: 50,
                error: 'Ошибка 2',
                isSuccess: false,
                tokensUsed: 0,
            },
            {
                checkType: 'check3',
                content: '',
                duration: 120,
                error: 'Ошибка 3',
                isSuccess: false,
                tokensUsed: 0,
            },
        ];

        const result = combineVerificationResults(checks);

        expect(result.success).toBe(false);
        expect(result.overallScore).toBe(0);
        expect(result.error).toBe('Все проверки завершились с ошибками');
        expect(result.combinedReport).toContain('Все проверки завершились с ошибками');
        expect(result.combinedReport).toContain('Ошибка 1');
        expect(result.combinedReport).toContain('Ошибка 2');
        expect(result.combinedReport).toContain('Ошибка 3');
    });

    it('должен правильно рассчитать общую оценку', () => {
        const checks: VerificationCheckResult[] = [
            {
                checkType: 'check1',
                content: 'Успех',
                duration: 100,
                isSuccess: true,
                tokensUsed: 50,
            },
            {
                checkType: 'check2',
                content: '',
                duration: 50,
                error: 'Ошибка',
                isSuccess: false,
                tokensUsed: 0,
            },
        ];

        const result = combineVerificationResults(checks);

        expect(result.overallScore).toBe(50);
    });
});
