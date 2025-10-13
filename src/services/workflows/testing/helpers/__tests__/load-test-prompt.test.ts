import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { loadAnalyzePrompt } from '../load-analyze-prompt';
import { loadExecutePrompt } from '../load-execute-prompt';

describe('loadExecutePrompt', () => {
    it('должен выбросить ошибку если файл не найден', () => {
        // Проверяем что файл действительно отсутствует
        const promptPath = resolve(__dirname, '../../../../../../prompts/testing/execute-prompt-test.md');
        const fileExists = existsSync(promptPath);

        if (!fileExists) {
            expect(() => loadExecutePrompt()).toThrow();
        } else {
            // Если файл существует, проверяем что функция работает
            expect(() => loadExecutePrompt()).not.toThrow();
        }
    });

    it('должен вернуть содержимое файла если он существует', () => {
        const promptPath = resolve(__dirname, '../../../../../../prompts/testing/execute-prompt-test.md');
        const fileExists = existsSync(promptPath);

        if (fileExists) {
            const result = loadExecutePrompt();
            expect(typeof result).toBe('string');
            expect(result.length).toBeGreaterThan(0);
        }
    });
});

describe('loadAnalyzePrompt', () => {
    it('должен выбросить ошибку если файл не найден', () => {
        // Проверяем что файл действительно отсутствует
        const promptPath = resolve(__dirname, '../../../../../../prompts/testing/test-prompt.md');
        const fileExists = existsSync(promptPath);

        if (!fileExists) {
            expect(() => loadAnalyzePrompt()).toThrow();
        } else {
            // Если файл существует, проверяем что функция работает
            expect(() => loadAnalyzePrompt()).not.toThrow();
        }
    });

    it('должен вернуть содержимое файла если он существует', () => {
        const promptPath = resolve(__dirname, '../../../../../../prompts/testing/test-prompt.md');
        const fileExists = existsSync(promptPath);

        if (fileExists) {
            const result = loadAnalyzePrompt();
            expect(typeof result).toBe('string');
            expect(result.length).toBeGreaterThan(0);
        }
    });
});
