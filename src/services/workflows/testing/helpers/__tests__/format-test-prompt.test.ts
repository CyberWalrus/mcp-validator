import { formatTestPrompt } from '../format-test-prompt-deprecated';

describe('formatTestPrompt', () => {
    it('должен заменять плейсхолдер промпта', () => {
        const template = 'Выполните: {PROMPT}';
        const prompt = 'Напишите функцию';

        const result = formatTestPrompt(template, prompt);

        expect(result).toBe('Выполните: Напишите функцию');
    });

    it('должен заменять плейсхолдер контекста', () => {
        const template = 'Промпт: {PROMPT}\nКонтекст: {CONTEXT}';
        const prompt = 'Тестовый промпт';
        const context = 'Дополнительный контекст';

        const result = formatTestPrompt(template, prompt, context);

        expect(result).toBe('Промпт: Тестовый промпт\nКонтекст: Дополнительный контекст');
    });

    it('должен удалять плейсхолдер контекста если контекст не указан', () => {
        const template = 'Промпт: {PROMPT} {CONTEXT}';
        const prompt = 'Тестовый промпт';

        const result = formatTestPrompt(template, prompt);

        expect(result).toBe('Промпт: Тестовый промпт');
    });

    it('должен обрабатывать шаблон без плейсхолдеров', () => {
        const template = 'Статический текст';
        const prompt = 'Любой промпт';

        const result = formatTestPrompt(template, prompt);

        expect(result).toBe('Статический текст');
    });

    it('должен обрезать лишние пробелы', () => {
        const template = '   {PROMPT}   ';
        const prompt = 'Тест';

        const result = formatTestPrompt(template, prompt);

        expect(result).toBe('Тест');
    });
});
