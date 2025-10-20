import { describe, expect, it } from 'vitest';

import { parseValidationResponse } from '../parse-validation-response';

describe('parseValidationResponse', () => {
    it('должен извлечь score из ответа', () => {
        const responseText = 'Оценка качества: 85/100\n\nРекомендации...';

        const result = parseValidationResponse(responseText);

        expect(result.score).toBe(85);
    });

    it('должен вернуть undefined для score если не найден', () => {
        const responseText = 'Рекомендации без оценки';

        const result = parseValidationResponse(responseText);

        expect(result.score).toBeUndefined();
    });

    it('должен всегда возвращать пустой массив issues', () => {
        const responseText = `
Оценка: 70/100

<critical_issues>
- **Нарушение типизации**
- **Отсутствие guard clauses**
</critical_issues>
        `;

        const result = parseValidationResponse(responseText);

        expect(result.issues).toEqual([]);
    });

    it('должен вернуть полный текст ответа как recommendations', () => {
        const responseText = 'Оценка: 80/100\n\nРекомендации:\n1. Улучшить типизацию\n2. Добавить JSDoc';

        const result = parseValidationResponse(responseText);

        expect(result.recommendations).toBe(responseText);
    });

    it('должен корректно парсить score с разными форматами', () => {
        const testCases = [
            { expected: 95, input: 'Оценка качества кода: 95/100' },
            { expected: 50, input: 'Оценка: 50/100' },
            { expected: 100, input: 'ОЦЕНКА КОДА: 100/100' },
        ];

        testCases.forEach(({ input, expected }) => {
            const result = parseValidationResponse(input);
            expect(result.score).toBe(expected);
        });
    });

    it('должен вернуть undefined для score при отсутствии оценки', () => {
        const testCases = ['Просто текст', 'Рекомендации без оценки', 'Score: invalid'];

        testCases.forEach((input) => {
            const result = parseValidationResponse(input);
            expect(result.score).toBeUndefined();
        });
    });

    it('должен возвращать весь ответ в recommendations независимо от содержимого', () => {
        const responseText = `<validation_result>
<overall_score>**ОБЩАЯ ОЦЕНКА: 45/100**</overall_score>
<critical_fixes>- **[КРИТИЧНО]** Проблема</critical_fixes>
</validation_result>`;

        const result = parseValidationResponse(responseText);

        expect(result.recommendations).toBe(responseText);
        expect(result.issues).toEqual([]);
    });
});
