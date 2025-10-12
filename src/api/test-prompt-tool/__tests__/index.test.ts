import { handleTestPromptToolRequest } from '../index';
import type { TestPromptInput } from '../types';

describe('handleTestPromptToolRequest', () => {
    it('должен быть функцией', () => {
        expect(typeof handleTestPromptToolRequest).toBe('function');
    });

    it('должен принимать TestPromptInput и возвращать Promise<TestPromptResult>', () => {
        const input: TestPromptInput = {
            prompt: 'Тестовый промпт',
        };

        const result = handleTestPromptToolRequest(input);
        expect(result).toBeInstanceOf(Promise);
    });

    it('должен иметь правильную сигнатуру функции', () => {
        expect(handleTestPromptToolRequest.length).toBe(1);
    });
});
