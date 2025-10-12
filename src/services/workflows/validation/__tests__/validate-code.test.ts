import { readFileContent } from '../../../adapters/file-reader';
import { makeOpenRouterRequest } from '../../../adapters/openrouter';
import type { ValidationParams } from '../types';
import { validateCode } from '../validate-code';

// Мокируем OpenRouter API клиент
vi.mock('../../../adapters/openrouter');
const mockMakeOpenRouterRequest = vi.mocked(makeOpenRouterRequest);

vi.mock('../helpers', () => ({
    detectLanguageFromPath: vi.fn().mockReturnValue('typescript'),
    formatPrompt: vi.fn().mockReturnValue('Formatted prompt'),
    formatValidationResult: vi.fn(),
    loadValidationPrompt: vi.fn().mockReturnValue('Mock prompt template'),
    validateParams: vi.fn(),
}));

vi.mock('../../adapters/openrouter', () => ({
    makeOpenRouterRequest: vi.fn().mockResolvedValue({
        duration: 1000,
        model: 'claude-3-sonnet',
        text: '# Mock validation result\n**Оценка:** 85/100\n**Статус:** ✅ Высокое качество',
        tokensUsed: 100,
    }),
}));

// ✅ Безопасное мокирование file-reader модуля
vi.mock('../../../adapters/file-reader', async (importOriginal) => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    const actual = await importOriginal<typeof import('../../../adapters/file-reader')>();

    return {
        ...actual,
        readFileContent: vi.fn(),
    };
});

describe('validateCode', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Настраиваем мок OpenRouter API для каждого теста
        mockMakeOpenRouterRequest.mockResolvedValue({
            duration: 1000,
            model: 'claude-3-sonnet',
            text: '# Mock validation result\n**Оценка:** 85/100\n**Статус:** ✅ Высокое качество',
            tokensUsed: 100,
        });
    });

    it('должен успешно валидировать код из content источника', async () => {
        const params: ValidationParams = {
            input: {
                data: 'function hello() { return "world"; }',
                type: 'content',
            },
            language: 'javascript',
            validationType: 'code',
        };

        const result = await validateCode(params);

        expect(result).toEqual({
            duration: expect.any(Number),
            issues: [],
            metadata: expect.any(Object),
            promptUsed: expect.any(String),
            score: expect.any(Number),
            success: true,
            tokensUsed: expect.any(Number),
            type: 'code',
        });
    });

    it('должен валидировать код из файла', async () => {
        const mockReadFile = vi.mocked(readFileContent);
        mockReadFile.mockResolvedValue({
            content: 'const x = 1;',
            encoding: 'utf8',
            path: '/path/to/file.ts',
            size: 13,
            success: true,
        });

        const params: ValidationParams = {
            input: {
                data: '/path/to/file.ts',
                type: 'file',
            },
            validationType: 'tests',
        };

        const result = await validateCode(params);

        expect(mockReadFile).toHaveBeenCalledWith({
            encoding: 'utf8',
            path: '/path/to/file.ts',
        });

        expect(result.success).toBeDefined();
        expect(result.duration).toBeGreaterThanOrEqual(0);
    });

    it('должен использовать стандартный промпт для валидации кода', async () => {
        const params: ValidationParams = {
            customPrompt: 'Validate this custom way',
            input: {
                data: 'test code',
                type: 'content',
            },
            validationType: 'code',
        };

        const result = await validateCode(params);

        expect(result.promptUsed).toBe('Validate this custom way');
    });

    it('должен обрабатывать ошибки валидации', async () => {
        const mockReadFile = vi.mocked(readFileContent);
        mockReadFile.mockRejectedValue(new Error('File not found'));

        const params: ValidationParams = {
            input: {
                data: '/nonexistent/file.ts',
                type: 'file',
            },
            validationType: 'code',
        };

        await expect(validateCode(params)).rejects.toThrow('File not found');
    });

    it('должен автоматически определять язык по расширению файла', async () => {
        const mockReadFile = vi.mocked(readFileContent);
        mockReadFile.mockResolvedValue({
            content: 'const x = 1;',
            encoding: 'utf8',
            path: '/path/to/file.ts',
            size: 13,
            success: true,
        });

        const params: ValidationParams = {
            input: {
                data: '/path/to/file.ts',
                type: 'file',
            },
            validationType: 'code',
        };

        const result = await validateCode(params);

        expect(result.metadata?.['detectedLanguage']).toBe('typescript');
    });

    it('должен включать дополнительные файлы в контекст', async () => {
        const mockReadFile = vi.mocked(readFileContent);
        mockReadFile.mockResolvedValue({
            content: 'const x = 1;',
            encoding: 'utf8',
            path: '/path/to/helper.ts',
            size: 13,
            success: true,
        });

        const params: ValidationParams = {
            additionalFiles: ['/path/to/helper.ts', '/path/to/types.ts'],
            input: {
                data: 'test code',
                type: 'content',
            },
            validationType: 'code',
        };

        const result = await validateCode(params);

        expect(mockReadFile).toHaveBeenCalledTimes(2);

        expect(result.metadata?.['additionalFilesCount']).toBe(2);
    });
});
