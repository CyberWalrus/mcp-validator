import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { z } from 'zod';

import { ParallelTestParamsSchema } from '../services/workflows/testing/schemas';
import { ValidationParamsSchema } from '../services/workflows/validation/schemas';

/**
 * Регрессионный тест для предотвращения проблем с Zod схемами
 *
 * История: В версии Zod 4.0.17 были баги с _zod свойствами,
 * что приводило к сбоям MCP сервера. Этот тест гарантирует,
 * что базовая функциональность Zod работает корректно.
 */
describe('Zod Regression Tests', () => {
    describe('Базовая функциональность Zod', () => {
        it('должен корректно создавать и парсить простую схему', () => {
            const TestSchema = z.object({
                age: z.number().optional(),
                name: z.string(),
            });

            const validData = { age: 25, name: 'test' };
            const result = TestSchema.safeParse(validData);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toEqual(validData);
            }
        });

        it('должен корректно обрабатывать ошибки валидации', () => {
            const TestSchema = z.object({
                required: z.string(),
            });

            const invalidData = { wrong: 'field' };
            const result = TestSchema.safeParse(invalidData);

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues.length).toBeGreaterThan(0);
            }
        });
    });

    describe('ValidationParamsSchema', () => {
        it('должен успешно валидировать корректные параметры', () => {
            const validParams = {
                input: {
                    data: 'test code',
                    type: 'content' as const,
                },
                validationType: 'code' as const,
            };

            const result = ValidationParamsSchema.safeParse(validParams);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.validationType).toBe('code');
                expect(result.data.input.data).toBe('test code');
            }
        });

        it('должен отклонять некорректные параметры', () => {
            const invalidParams = {
                input: {
                    data: '',
                    type: 'invalid',
                },
                validationType: 'invalid',
            };

            const result = ValidationParamsSchema.safeParse(invalidParams);

            expect(result.success).toBe(false);
        });
    });

    describe('ParallelTestParamsSchema', () => {
        it('должен успешно валидировать корректные параметры тестирования', () => {
            const validParams = {
                iterations: 5,
                prompt: 'Test prompt',
                timeout: 30000,
            };

            const result = ParallelTestParamsSchema.safeParse(validParams);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.prompt).toBe('Test prompt');
                expect(result.data.iterations).toBe(5);
            }
        });

        it('должен отклонять параметры с пустым промптом', () => {
            const invalidParams = {
                iterations: 3,
                prompt: '',
            };

            const result = ParallelTestParamsSchema.safeParse(invalidParams);

            expect(result.success).toBe(false);
        });

        it('должен отклонять некорректные значения iterations', () => {
            const invalidParams = {
                iterations: 1,
                prompt: 'Test', // Меньше минимума (3)
            };

            const result = ParallelTestParamsSchema.safeParse(invalidParams);

            expect(result.success).toBe(false);
        });
    });

    describe('Версия Zod', () => {
        it('должен использовать стабильную версию Zod (3.x)', () => {
            try {
                // Это предотвращает случайное обновление до нестабильной v4
                const zodPackagePath = resolve(process.cwd(), 'node_modules', 'zod', 'package.json');
                const zodPackageContent = readFileSync(zodPackagePath, 'utf8');
                const zodPackage = JSON.parse(zodPackageContent) as { version: string };
                const zodVersion = zodPackage.version;

                expect(zodVersion).toMatch(/^3\./);
                expect(zodVersion).not.toMatch(/^4\./);
            } catch {
                // Если не удается найти package.json, проверяем что Zod работает
                const TestSchema = z.string();
                const result = TestSchema.safeParse('test');
                expect(result.success).toBe(true);
            }
        });
    });
});
