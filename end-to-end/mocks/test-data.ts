/** Тестовые случаи для промптов */
export const PROMPT_TEST_CASES = [
    {
        /** Количество итераций для тестирования */
        iterations: 3,
        /** Название тестового случая */
        name: 'Простой промпт',
        /** Промпт для тестирования */
        prompt: 'Напиши короткое приветствие',
    },
    {
        iterations: 5,
        name: 'Технический промпт',
        prompt: 'Объясни принцип работы REST API в двух предложениях',
    },
    {
        iterations: 5,
        name: 'Креативный промпт',
        prompt: 'Придумай название для приложения по управлению задачами',
    },
    {
        iterations: 4,
        name: 'Аналитический промпт',
        prompt: 'Проанализируй преимущества и недостатки микросервисной архитектуры',
    },
] as const;

/** Тестовые случаи для валидации */
export const VALIDATION_TEST_CASES = [
    {
        /** Код для валидации */
        code: 'export function test(): string { return "hello"; }',
        /** Язык программирования */
        language: 'typescript',
        /** Название тестового случая */
        name: 'Валидный TypeScript код',
        /** Тип валидации */
        validationType: 'code',
    },
    {
        code: 'export function formatDate(date: Date): string { return date.toISOString(); }',
        language: 'typescript',
        name: 'Проверка архитектуры модуля',
        validationType: 'architecture',
    },
    {
        code: 'describe("test", () => { it("should work", () => { expect(true).toBe(true); }); });',
        language: 'typescript',
        name: 'Тестовый файл',
        validationType: 'tests',
    },
] as const;
