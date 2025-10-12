import { parseValidationResult } from '../parse-validation-result';

describe('parseValidationResult', () => {
    it('должен определять успешный результат с положительными индикаторами', () => {
        const aiResponse = `
        # Анализ кода
        Код отлично написан и соответствует всем стандартам.
        Качество кода на высоком уровне.
        Все проверки прошли успешно.
        `;

        const result = parseValidationResult(aiResponse);

        expect(result.success).toBe(true);
        expect(result.issues).toHaveLength(0);
        expect(result.metadata?.fullResponse).toBe(aiResponse);
    });

    it('должен определять неуспешный результат с проблемами', () => {
        const aiResponse = `
        # Анализ кода
        Найдена критическая ошибка в функции main().
        Обнаружена уязвимость безопасности в обработке данных.
        Проблема с производительностью в цикле.
        `;

        const result = parseValidationResult(aiResponse);

        expect(result.success).toBe(false);
        expect(result.issues.length).toBeGreaterThan(0);
        expect(result.issues.some((issue) => issue.includes('ошибка'))).toBe(true);
        expect(result.issues.some((issue) => issue.includes('уязвимость'))).toBe(true);
    });

    it('должен извлекать оценку из текста', () => {
        const responses = ['Оценка кода: 85/100', 'Качество: 92%', 'Score: 78'];

        responses.forEach((response) => {
            const result = parseValidationResult(response);
            expect(result.metadata?.score).toBeDefined();
            expect(typeof result.metadata?.score).toBe('number');
        });
    });

    it('должен считать неуспешным при низкой оценке', () => {
        const aiResponse = 'Анализ завершен. Оценка: 45/100';

        const result = parseValidationResult(aiResponse);

        expect(result.success).toBe(false);
        expect(result.issues).toContain('Низкая оценка: 45');
        expect(result.metadata?.score).toBe(45);
    });

    it('должен обрабатывать текст с критическими словами', () => {
        const aiResponse = 'К сожалению, код провалил все проверки. Невозможно рекомендовать к использованию.';

        const result = parseValidationResult(aiResponse);

        expect(result.success).toBe(false);
    });

    it('должен считать успешным нейтральный текст без негативных индикаторов', () => {
        const aiResponse = 'Код соответствует требованиям. Рекомендации по стилю прилагаются.';

        const result = parseValidationResult(aiResponse);

        expect(result.success).toBe(true);
    });

    it('должен обрабатывать пустой ответ', () => {
        const result = parseValidationResult('');

        expect(result.success).toBe(true);
        expect(result.issues).toHaveLength(0);
        expect(result.metadata?.fullResponse).toBe('');
    });

    it('должен находить множественные проблемы', () => {
        const aiResponse = `
        Ошибка синтаксиса на строке 15.
        Предупреждение: неиспользуемая переменная.
        Критическая уязвимость в аутентификации.
        Баг в обработке исключений.
        Проблема производительности в запросе к БД.
        `;

        const result = parseValidationResult(aiResponse);

        expect(result.success).toBe(false);
        expect(result.issues.length).toBeGreaterThan(3);
    });

    it('должен обрабатывать смешанные позитивные и негативные индикаторы', () => {
        const aiResponse = `
        Код хорошо структурирован и читаем.
        Однако найдена одна ошибка в валидации данных.
        В целом качество отличное.
        `;

        const result = parseValidationResult(aiResponse);

        expect(result.success).toBe(false); // Из-за найденной ошибки
        expect(result.issues.length).toBeGreaterThan(0);
    });

    it('должен сохранять полный ответ в метаданных', () => {
        const aiResponse = 'Детальный анализ кода с множеством рекомендаций.';

        const result = parseValidationResult(aiResponse);

        expect(result.metadata?.fullResponse).toBe(aiResponse);
    });
});
