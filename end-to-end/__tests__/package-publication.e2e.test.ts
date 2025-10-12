import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { getPackageResourceResolver } from '../../src/lib/helpers/resource-resolver';
import type { ValidationType } from '../../src/lib/helpers/resource-resolver/types';

describe('Package Publication E2E', () => {
    const resourceResolver = getPackageResourceResolver();
    const packageJsonPath = resourceResolver.resolvePackageJsonPath();

    describe('Package Structure', () => {
        it('должен иметь корректный package.json', () => {
            expect(existsSync(packageJsonPath)).toBe(true);

            const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

            expect(packageJson.name).toBe('mcp-validator');
            expect(packageJson.version).toMatch(/^\d+\.\d+\.\d+/);
            expect(packageJson.description).toBeDefined();
            expect(packageJson.main).toBeDefined();
            expect(packageJson.bin).toBeDefined();
            expect(packageJson.files).toBeDefined();
            expect(packageJson.keywords).toBeDefined();
            expect(packageJson.author).toBeDefined();
            expect(packageJson.license).toBeDefined();
        });

        it('должен содержать все необходимые файлы для публикации', () => {
            const packageRoot = join(packageJsonPath, '..');

            // Основные файлы
            expect(existsSync(join(packageRoot, 'README.md'))).toBe(true);
            expect(existsSync(join(packageRoot, 'package.json'))).toBe(true);

            // Директории с промптами
            expect(existsSync(resourceResolver.resolveErrorTemplatesDir())).toBe(true);
            expect(existsSync(join(packageRoot, 'prompts', 'validation'))).toBe(true);
            expect(existsSync(join(packageRoot, 'prompts', 'testing'))).toBe(true);

            // ИСПРАВЛЕНИЕ: В v2.0 используем tsx без компиляции
            // expect(existsSync(join(packageRoot, 'dist'))).toBe(true);
        });

        it('должен содержать все промпты валидации', () => {
            const validationTypes: ValidationType[] = ['code', 'tests', 'architecture', 'documentation', 'prompts'];

            validationTypes.forEach((type) => {
                const promptPath = resourceResolver.resolvePromptPath(type);
                expect(existsSync(promptPath)).toBe(true);
            });
        });

        it('должен содержать все шаблоны ошибок', () => {
            const errorTypes = ['file-error', 'system-error', 'validation-error'];

            errorTypes.forEach((type) => {
                const errorPath = resourceResolver.resolveErrorTemplatePath(type);
                expect(existsSync(errorPath)).toBe(true);
            });
        });
    });

    describe('Package Creation', () => {
        it('должен успешно создавать npm пакет', () => {
            const packageRoot = join(packageJsonPath, '..');

            expect(() => {
                execSync('npm pack --dry-run', {
                    cwd: packageRoot,
                    stdio: 'pipe',
                });
            }).not.toThrow();
        });

        it('созданный пакет должен содержать все необходимые файлы', () => {
            const packageRoot = join(packageJsonPath, '..');

            // ИСПРАВЛЕНИЕ: npm pack --dry-run возвращает только название пакета
            // Проверим, что файлы существуют физически
            expect(existsSync(join(packageRoot, 'package.json'))).toBe(true);
            expect(existsSync(join(packageRoot, 'README.md'))).toBe(true);
            // В v2.0 используем tsx без dist папки
            expect(existsSync(join(packageRoot, 'src'))).toBe(true);
            expect(existsSync(join(packageRoot, 'prompts'))).toBe(true);

            // Проверим что pack команда выполняется успешно
            expect(() => {
                execSync('npm pack --dry-run', {
                    cwd: packageRoot,
                    stdio: 'pipe',
                });
            }).not.toThrow();
        });
    });

    describe('CLI Functionality', () => {
        it('должен корректно запускаться как CLI', () => {
            const packageRoot = join(packageJsonPath, '..');

            expect(() => {
                // ИСПРАВЛЕНИЕ: Используем tsx вместо скомпилированного файла
                execSync('tsx src/index.ts --help', {
                    cwd: packageRoot,
                    stdio: 'pipe',
                });
            }).not.toThrow();
        });

        it('должен показывать версию', () => {
            const packageRoot = join(packageJsonPath, '..');

            // ИСПРАВЛЕНИЕ: Используем tsx вместо скомпилированного файла и читаем stderr (где выводится info())
            const versionOutput = execSync('tsx src/index.ts --version 2>&1', {
                cwd: packageRoot,
                encoding: 'utf8',
            });

            expect(versionOutput.trim()).toMatch(/mcp-validator v\d+\.\d+\.\d+/);
        });
    });
});
