import { loadValidationPrompt } from '../load-validation-prompt';

describe('loadValidationPrompt', () => {
    it('должен возвращать промпт для валидации кода', () => {
        const prompt = loadValidationPrompt('code');

        expect(prompt).toContain('Code Quality Validator');
        expect(prompt).toContain('[ALGORITHM-BEGIN]');
        expect(prompt).toContain('Code Quality Score');
    });

    it('должен возвращать промпт для валидации тестов', () => {
        const prompt = loadValidationPrompt('tests');

        expect(prompt).toContain('Test Code Validator');
        expect(prompt).toContain('STRICT MOCKING');
        expect(prompt).toContain('CRITICAL ANALYSIS OF USELESS TESTS');
    });

    it('должен возвращать промпт для анализа архитектуры', () => {
        const prompt = loadValidationPrompt('architecture');

        expect(prompt).toContain('Architecture Validator');
        expect(prompt).toContain('Software Architect');
        expect(prompt).toContain('Module Units');
    });

    it('должен возвращать промпт для анализа архитектуры', () => {
        const prompt = loadValidationPrompt('architecture');

        expect(prompt).toContain('Architecture Validator');
        expect(prompt).toContain('архитектур');
        expect(prompt).toContain('система');
    });

    it('должен возвращать промпт для анализа промптов', () => {
        const prompt = loadValidationPrompt('prompts');

        expect(prompt).toContain('Prompt Validator');
        expect(prompt).toContain('prompt');
        expect(prompt).toContain('validation');
    });

    it('должен возвращать промпт для валидации документации', () => {
        const prompt = loadValidationPrompt('documentation');

        expect(prompt).toContain('Documentation Validator');
        expect(prompt).toContain('documentation');
        expect(prompt).toContain('quality');
    });

    it('должен возвращать промпт для анализа промптов', () => {
        const prompt = loadValidationPrompt('prompts');

        expect(prompt).toContain('AI Prompt Validator');
        expect(prompt).toContain('Ambiguity detection');
        expect(prompt).toContain('prompt');
    });

    it('все промпты должны содержать необходимые плейсхолдеры', () => {
        const types = ['code', 'tests', 'architecture', 'documentation', 'prompts'] as const;

        types.forEach((type) => {
            const prompt = loadValidationPrompt(type);
            expect(prompt).toContain('{{code}}');
            expect(typeof prompt).toBe('string');
            expect(prompt.length).toBeGreaterThan(50);
        });
    });
});
