import type { ValidationContext } from '../../types';
import { formatPrompt } from '../format-prompt';

describe('formatPrompt', () => {
    it('должен заменять основные плейсхолдеры', () => {
        const template = 'Код: {CODE}\nЯзык: {LANGUAGE}';
        const context: ValidationContext = {
            code: 'console.log("hello");',
            language: 'javascript',
        };

        const result = formatPrompt(template, context);

        expect(result).toBe('Код: console.log("hello");\nЯзык: javascript');
    });

    it('должен заменять контекст если он указан', () => {
        const template = 'Код: {CODE}\nКонтекст: {CONTEXT}';
        const context: ValidationContext = {
            code: 'test',
            context: 'Дополнительная информация',
            language: 'js',
        };

        const result = formatPrompt(template, context);

        expect(result).toBe('Код: test\nКонтекст: Дополнительная информация');
    });

    it('должен удалять плейсхолдер контекста если контекст не указан', () => {
        const template = 'Код: {CODE} {CONTEXT} Конец';
        const context: ValidationContext = {
            code: 'test',
            language: 'js',
        };

        const result = formatPrompt(template, context);

        expect(result).toBe('Код: test  Конец');
    });

    it('должен заменять дополнительные файлы', () => {
        const template = 'Код: {CODE}\nДоп файлы: {ADDITIONAL_FILES}';
        const context: ValidationContext = {
            additionalFiles: ['// file1.js\ncode1', '// file2.js\ncode2'],
            code: 'main code',
            language: 'js',
        };

        const result = formatPrompt(template, context);

        expect(result).toBe('Код: main code\nДоп файлы: // file1.js\ncode1\n\n// file2.js\ncode2');
    });

    it('должен удалять плейсхолдер дополнительных файлов если их нет', () => {
        const template = 'Код: {CODE} {ADDITIONAL_FILES} Конец';
        const context: ValidationContext = {
            code: 'test',
            language: 'js',
        };

        const result = formatPrompt(template, context);

        expect(result).toBe('Код: test  Конец');
    });

    it('должен обрабатывать пустой массив дополнительных файлов', () => {
        const template = 'Код: {CODE} {ADDITIONAL_FILES} Конец';
        const context: ValidationContext = {
            additionalFiles: [],
            code: 'test',
            language: 'js',
        };

        const result = formatPrompt(template, context);

        expect(result).toBe('Код: test  Конец');
    });

    it('должен обрезать лишние пробелы', () => {
        const template = '   {CODE}   ';
        const context: ValidationContext = {
            code: 'test',
            language: 'js',
        };

        const result = formatPrompt(template, context);

        expect(result).toBe('test');
    });

    it('должен обрабатывать шаблон без плейсхолдеров', () => {
        const template = 'Статический текст';
        const context: ValidationContext = {
            code: 'any code',
            language: 'any lang',
        };

        const result = formatPrompt(template, context);

        expect(result).toBe('Статический текст');
    });
});
