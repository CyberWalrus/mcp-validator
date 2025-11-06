import { describe, expect, it } from 'vitest';

import { formatVerificationPrompt } from '../format-verification-prompt';

describe('formatVerificationPrompt', () => {
    it('должен форматировать промпт для check1', () => {
        const content = 'Информация для проверки';
        const verifyInput = {
            input: { data: content, encoding: 'utf8' as const, type: 'content' as const },
        };

        const result = formatVerificationPrompt(content, verifyInput, 'check1');

        expect(result).toContain('# Проверка информации (check1)');
        expect(result).toContain('## Информация для проверки:');
        expect(result).toContain(content);
        expect(result).toContain('Выполни проверку типа "check1"');
    });

    it('должен форматировать промпт для check2', () => {
        const content = 'Данные для анализа';
        const verifyInput = {
            input: { data: content, encoding: 'utf8' as const, type: 'content' as const },
        };

        const result = formatVerificationPrompt(content, verifyInput, 'check2');

        expect(result).toContain('# Проверка информации (check2)');
        expect(result).toContain('Выполни проверку типа "check2"');
    });

    it('должен форматировать промпт для check3', () => {
        const content = 'Контент для верификации';
        const verifyInput = {
            input: { data: content, encoding: 'utf8' as const, type: 'content' as const },
        };

        const result = formatVerificationPrompt(content, verifyInput, 'check3');

        expect(result).toContain('# Проверка информации (check3)');
        expect(result).toContain('Выполни проверку типа "check3"');
    });

    it('должен добавить секцию контекста если указан context', () => {
        const content = 'Информация';
        const context = 'Дополнительный контекст проверки';
        const verifyInput = {
            context,
            input: { data: content, encoding: 'utf8' as const, type: 'content' as const },
        };

        const result = formatVerificationPrompt(content, verifyInput, 'check1');

        expect(result).toContain('## Контекст:');
        expect(result).toContain(context);
    });

    it('не должен добавлять секцию контекста если context отсутствует', () => {
        const content = 'Информация';
        const verifyInput = {
            input: { data: content, encoding: 'utf8' as const, type: 'content' as const },
        };

        const result = formatVerificationPrompt(content, verifyInput, 'check1');

        expect(result).not.toContain('## Контекст:');
    });
});
