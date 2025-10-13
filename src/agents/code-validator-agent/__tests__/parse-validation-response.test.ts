import { describe, expect, it } from 'vitest';

import { parseValidationResponse } from '../parse-validation-response';

describe('parseValidationResponse', () => {
    it('должен извлечь score из ответа', () => {
        const responseText = 'Оценка качества: 85/100\n\nРекомендации...';

        const result = parseValidationResponse(responseText);

        expect(result.score).toBe(85);
    });

    it('должен использовать score по умолчанию 75 если не найден', () => {
        const responseText = 'Рекомендации без оценки';

        const result = parseValidationResponse(responseText);

        expect(result.score).toBe(75);
    });

    it('должен извлечь critical issues из ответа', () => {
        const responseText = `
Оценка: 70/100

<critical_issues>
- **Нарушение типизации**
- **Отсутствие guard clauses**
</critical_issues>
        `;

        const result = parseValidationResponse(responseText);

        expect(result.issues).toEqual(['Нарушение типизации', 'Отсутствие guard clauses']);
    });

    it('должен вернуть пустой массив issues если не найдены', () => {
        const responseText = 'Оценка: 90/100\n\nВсе хорошо!';

        const result = parseValidationResponse(responseText);

        expect(result.issues).toEqual([]);
    });

    it('должен вернуть полный текст ответа как recommendations', () => {
        const responseText = 'Оценка: 80/100\n\nРекомендации:\n1. Улучшить типизацию\n2. Добавить JSDoc';

        const result = parseValidationResponse(responseText);

        expect(result.recommendations).toBe(responseText);
    });

    it('должен обрабатывать ответ с несколькими issues', () => {
        const responseText = `
<critical_issues>
- **Issue 1**
- **Issue 2**
- **Issue 3**
</critical_issues>
        `;

        const result = parseValidationResponse(responseText);

        expect(result.issues).toHaveLength(3);
        expect(result.issues).toEqual(['Issue 1', 'Issue 2', 'Issue 3']);
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
});
