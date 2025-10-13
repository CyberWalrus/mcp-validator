import { describe, expect, it } from 'vitest';

import { formatValidationPrompt } from '../format-validation-prompt';

describe('formatValidationPrompt', () => {
    it('должен форматировать промпт с контентом и языком', () => {
        const content = 'function test() {}';
        const validationInput = {
            input: { data: content, type: 'content' as const },
            language: 'typescript',
            validationType: 'code' as const,
        };

        const result = formatValidationPrompt(content, validationInput);

        expect(result).toContain('```typescript');
        expect(result).toContain(content);
        expect(result).toContain('Выполни валидацию согласно инструкциям выше');
    });

    it('должен добавить секцию контекста если указан context', () => {
        const content = 'const x = 1;';
        const context = 'Валидация константы';
        const validationInput = {
            context,
            input: { data: content, type: 'content' as const },
            language: 'javascript',
            validationType: 'code' as const,
        };

        const result = formatValidationPrompt(content, validationInput);

        expect(result).toContain('## Контекст:');
        expect(result).toContain(context);
    });

    it('не должен добавлять секцию контекста если context отсутствует', () => {
        const content = 'const x = 1;';
        const validationInput = {
            input: { data: content, type: 'content' as const },
            language: 'javascript',
            validationType: 'code' as const,
        };

        const result = formatValidationPrompt(content, validationInput);

        expect(result).not.toContain('## Контекст:');
    });

    it('должен использовать typescript как язык по умолчанию', () => {
        const content = 'function test() {}';
        const validationInput = {
            input: { data: content, type: 'content' as const },
            validationType: 'code' as const,
        };

        const result = formatValidationPrompt(content, validationInput);

        expect(result).toContain('```typescript');
    });

    it('должен включать все основные секции промпта', () => {
        const content = 'const test = 1;';
        const validationInput = {
            input: { data: content, type: 'content' as const },
            language: 'typescript',
            validationType: 'code' as const,
        };

        const result = formatValidationPrompt(content, validationInput);

        expect(result).toContain('# Входные данные для валидации');
        expect(result).toContain('## Код для валидации:');
        expect(result).toContain('Выполни валидацию согласно инструкциям выше');
    });
});
