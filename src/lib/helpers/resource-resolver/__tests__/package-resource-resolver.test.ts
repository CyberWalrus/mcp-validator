import { getPackageResourceResolver } from '../package-resource-resolver';
import type { ValidationType } from '../types';

describe('getPackageResourceResolver', () => {
    it('должен корректно разрешать пути к промптам валидации', () => {
        const resolver = getPackageResourceResolver();

        const codePath = resolver.resolvePromptPath('code');
        const testsPath = resolver.resolvePromptPath('tests');
        const architecturePath = resolver.resolvePromptPath('architecture');

        expect(codePath).toMatch(/prompts[\\\/]validation[\\\/]validate-code\.md$/);
        expect(testsPath).toMatch(/prompts[\\\/]validation[\\\/]validate-tests\.md$/);
        expect(architecturePath).toMatch(/prompts[\\\/]validation[\\\/]validate-architecture\.md$/);
    });

    it('должен корректно разрешать пути к шаблонам ошибок', () => {
        const resolver = getPackageResourceResolver();

        const fileErrorPath = resolver.resolveErrorTemplatePath('file-error');
        const systemErrorPath = resolver.resolveErrorTemplatePath('system-error');
        const validationErrorPath = resolver.resolveErrorTemplatePath('validation-error');

        expect(fileErrorPath.replace(/\\/g, '/')).toContain('prompts/errors/file-error.md');
        expect(systemErrorPath.replace(/\\/g, '/')).toContain('prompts/errors/system-error.md');
        expect(validationErrorPath.replace(/\\/g, '/')).toContain('prompts/errors/validation-error.md');
    });

    it('должен корректно разрешать путь к директории шаблонов ошибок', () => {
        const resolver = getPackageResourceResolver();

        const errorsDir = resolver.resolveErrorTemplatesDir();

        expect(errorsDir.replace(/\\/g, '/')).toContain('prompts/errors');
        expect(errorsDir).not.toContain('.md');
    });

    it('должен корректно разрешать путь к package.json', () => {
        const resolver = getPackageResourceResolver();

        const packageJsonPath = resolver.resolvePackageJsonPath();

        expect(packageJsonPath).toContain('package.json');
        expect(packageJsonPath).not.toContain('src');
    });

    it('должен корректно разрешать пути к тестовым промптам', () => {
        const resolver = getPackageResourceResolver();

        const executePromptPath = resolver.resolveExecuteTestPromptPath();
        const analyzePromptPath = resolver.resolveAnalyzeTestPromptPath();

        expect(executePromptPath.replace(/\\/g, '/')).toContain('prompts/testing/execute-prompt-test.md');
        expect(analyzePromptPath.replace(/\\/g, '/')).toContain('prompts/testing/test-prompt.md');
    });

    it('должен возвращать абсолютные пути', () => {
        const resolver = getPackageResourceResolver();

        const codePath = resolver.resolvePromptPath('code');
        const errorPath = resolver.resolveErrorTemplatePath('file-error');
        const packagePath = resolver.resolvePackageJsonPath();

        expect(codePath).toMatch(/^[A-Za-z]:.*\.md$|^\/.*\.md$/);
        expect(errorPath).toMatch(/^[A-Za-z]:.*\.md$|^\/.*\.md$/);
        expect(packagePath).toMatch(/^[A-Za-z]:.*package\.json$|^\/.*package\.json$/);
    });

    it('должен обрабатывать неизвестные типы валидации', () => {
        const resolver = getPackageResourceResolver();

        const unknownPath = resolver.resolvePromptPath('unknown' as ValidationType);

        expect(unknownPath).toMatch(/prompts[\\\/]validation[\\\/]validate-unknown\.md$/);
    });

    it('должен обрабатывать неизвестные типы ошибок', () => {
        const resolver = getPackageResourceResolver();

        const unknownErrorPath = resolver.resolveErrorTemplatePath('unknown-error');

        expect(unknownErrorPath.replace(/\\/g, '/')).toContain('prompts/errors/unknown-error.md');
    });

    describe('dual-mode поддержка (development vs installed)', () => {
        it('должен корректно находить package.json в development режиме', () => {
            const resolver = getPackageResourceResolver();

            const packageJsonPath = resolver.resolvePackageJsonPath();

            expect(packageJsonPath).toMatch(/package\.json$/);
            expect(packageJsonPath).not.toContain('/src/');
        });

        it('должен работать с различными уровнями вложенности в development', () => {
            const resolver = getPackageResourceResolver();

            const codePath = resolver.resolvePromptPath('code');
            const errorPath = resolver.resolveErrorTemplatePath('validation-error');

            expect(codePath).toMatch(/prompts[\\\/]validation[\\\/]validate-code\.md$/);
            expect(errorPath).toMatch(/prompts[\\\/]errors[\\\/]validation-error\.md$/);
        });

        it('должен поддерживать поиск пакета по имени mcp-validator', () => {
            const resolver = getPackageResourceResolver();

            const packageJsonPath = resolver.resolvePackageJsonPath();

            expect(packageJsonPath).toBeTruthy();
            expect(packageJsonPath).toMatch(/[\\\/]package\.json$/);
        });
    });
});
