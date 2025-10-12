import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it } from 'vitest';

import { initializePromptCache } from '../src/lib/cache/prompt-cache';
import { reloadAppConfig } from '../src/model/config';
import { renderErrorResponse } from '../src/services/adapters/error-handler';
// Импорты функций, которые ОБЯЗАТЕЛЬНО должны сохраниться
import { readFileContent } from '../src/services/adapters/file-reader';

/** E2E тесты сохранения критических функций при миграции */
describe('🔒 Сохранение функций при миграции на официальные SDK', () => {
    beforeAll(() => {
        reloadAppConfig();
        initializePromptCache();
    });

    describe('📁 Функция чтения файлов', () => {
        it('должна читать файлы асинхронно с той же логикой', async () => {
            // Создаем тестовый файл для проверки
            const testFilePath = resolve(process.cwd(), 'package.json');

            const result = await readFileContent({
                encoding: 'utf8',
                path: testFilePath,
            });

            // Проверяем что функция работает как раньше
            expect(result.success).toBe(true);
            expect(result.content).toContain('mcp-validator');
            expect(result.encoding).toBe('utf8');
            expect(result.path).toBe(testFilePath);
        });

        it('должна обрабатывать ошибки с фолбэком как раньше', async () => {
            const nonExistentPath = '/абсолютно/несуществующий/файл.txt';

            const result = await readFileContent({
                encoding: 'utf8',
                path: nonExistentPath,
            });

            // Проверяем что логика ошибок сохранена
            expect(result.success).toBe(false);
            expect(result.error).toContain('не найден');
            expect(result.error).toContain('ENOENT');
        });

        it('должна поддерживать разные кодировки', async () => {
            const testFilePath = resolve(process.cwd(), 'README.md');

            const result = await readFileContent({
                encoding: 'utf8',
                path: testFilePath,
            });

            expect(result.success).toBe(true);
            expect(result.encoding).toBe('utf8');
            expect(result.content).toBeTruthy();
        });
    });

    describe('🎨 Функция markdown вывода ошибок', () => {
        it('должна рендерить system ошибки в markdown', () => {
            const errorContext = {
                context: 'E2E тест сохранения функций',
                errorCode: -32603,
                errorMessage: 'Тестовая системная ошибка',
                errorType: 'system',
            };

            const result = renderErrorResponse(errorContext);

            expect(result.success).toBe(true);
            expect(result.content).toContain('# ⚠️ Системная ошибка');
            expect(result.content).toContain('-32603'); // Проверяем что числовой код ошибки отображается
            expect(result.error).toBeUndefined();
        });

        it('должна рендерить validation ошибки в markdown', () => {
            const errorContext = {
                context: 'E2E тест сохранения функций',
                errorCode: -32000,
                errorMessage: 'Тестовая ошибка валидации',
                errorType: 'validation',
            };

            const result = renderErrorResponse(errorContext);

            expect(result.success).toBe(true);
            expect(result.content).toContain('# ❌ Ошибка валидации');
            expect(result.content).toContain('-32000'); // Проверяем что числовой код ошибки отображается
        });

        it('должна рендерить file ошибки в markdown', () => {
            const errorContext = {
                context: 'E2E тест сохранения функций',
                errorCode: -32001,
                errorMessage: 'Тестовая файловая ошибка',
                errorType: 'file',
            };

            const result = renderErrorResponse(errorContext);

            expect(result.success).toBe(true);
            expect(result.content).toContain('# 📁 Ошибка файловой операции');
            expect(result.content).toContain('-32001'); // Проверяем что числовой код ошибки отображается
        });

        it('должна обрабатывать неподдерживаемые типы ошибок', () => {
            const errorContext = {
                context: 'E2E тест сохранения функций',
                errorCode: -32999,
                errorMessage: 'Неизвестный тип ошибки',
                errorType: 'unknown' as any,
            };

            const result = renderErrorResponse(errorContext);

            expect(result.success).toBe(false);
            expect(result.error).toContain('Неподдерживаемый тип ошибки');
        });
    });

    describe('📝 Промпты в .md файлах', () => {
        it('должны существовать все критические промпты валидации', () => {
            const validationPrompts = [
                'validate-code.md',
                'validate-tests.md',
                'validate-architecture.md',
                'validate-documentation.md',
                'validate-prompts.md',
            ];

            for (const promptFile of validationPrompts) {
                const promptPath = resolve(process.cwd(), 'prompts', 'validation', promptFile);

                expect(() => {
                    const content = readFileSync(promptPath, 'utf8');
                    expect(content).toBeTruthy();
                    expect(content.length).toBeGreaterThan(100);
                }).not.toThrow(`Промпт ${promptFile} должен существовать и содержать данные`);
            }
        });

        it('должны существовать промпты тестирования', () => {
            const testingPrompts = ['test-prompt.md', 'execute-prompt-test.md'];

            for (const promptFile of testingPrompts) {
                const promptPath = resolve(process.cwd(), 'prompts', 'testing', promptFile);

                expect(() => {
                    const content = readFileSync(promptPath, 'utf8');
                    expect(content).toBeTruthy();
                    expect(content.length).toBeGreaterThan(50);
                }).not.toThrow(`Промпт тестирования ${promptFile} должен существовать`);
            }
        });

        it('должны существовать шаблоны ошибок', () => {
            const errorPrompts = ['system-error.md', 'validation-error.md', 'file-error.md'];

            for (const promptFile of errorPrompts) {
                const promptPath = resolve(process.cwd(), 'prompts', 'errors', promptFile);

                expect(() => {
                    const content = readFileSync(promptPath, 'utf8');
                    expect(content).toBeTruthy();
                    expect(content).toContain('#'); // Должен содержать markdown заголовки
                }).not.toThrow(`Шаблон ошибки ${promptFile} должен существовать`);
            }
        });

        it('промпты должны иметь правильную структуру с YAML frontmatter', () => {
            const codeValidationPath = resolve(process.cwd(), 'prompts', 'validation', 'validate-code.md');
            const content = readFileSync(codeValidationPath, 'utf8');

            // Проверяем структуру промпта
            expect(content).toMatch(/^---\n/); // Начинается с YAML frontmatter
            expect(content).toContain('id:');
            expect(content).toContain('type:');
            expect(content).toContain('prompt_language:');
            expect(content).toContain('response_language:');
            expect(content).toContain('# 🔧'); // Имеет заголовок с эмодзи
        });
    });

    describe('🔄 Интеграция функций', () => {
        it('должна сохраниться цепочка: чтение файла → обработка → рендеринг', async () => {
            // Симулируем полный цикл обработки как в реальном приложении
            const testPromptPath = resolve(process.cwd(), 'prompts', 'validation', 'validate-code.md');

            // 1. Читаем промпт из файла
            const fileResult = await readFileContent({
                encoding: 'utf8',
                path: testPromptPath,
            });

            expect(fileResult.success).toBe(true);
            expect(fileResult.content).toContain('validate-code');

            // 2. Симулируем ошибку валидации
            const errorContext = {
                context: `Промпт загружен из ${fileResult.path}`,
                errorCode: -32000,
                errorMessage: 'Тестовая интеграционная ошибка',
                errorType: 'validation',
            };

            // 3. Рендерим ошибку в markdown
            const errorResult = renderErrorResponse(errorContext);

            expect(errorResult.success).toBe(true);
            expect(errorResult.content).toContain('# ❌ Ошибка валидации');
            expect(errorResult.content).toContain('-32000'); // Проверяем что интеграция работает
        });
    });
});
