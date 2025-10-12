import type { ValidationResponse } from '../../../../workflows/validation/types';
import { formatValidationResponse } from '../format-validation-response';

describe('formatValidationResponse', () => {
    it('должен форматировать успешный результат валидации с полной метаинформацией', () => {
        const result: ValidationResponse = {
            duration: 1500,
            issues: [],
            metadata: {
                additionalFilesCount: 3,
                detectedLanguage: 'typescript',
                fullResponse: '# Анализ кода\n**Оценка:** 95/100\n**Статус:** ✅ Высокое качество',
                model: 'claude-3.5-sonnet',
            },
            promptUsed: 'Test prompt',
            score: 95,
            success: true,
            tokensUsed: 250,
            type: 'code',
        };

        const formatted = formatValidationResponse(result);

        expect(formatted).toContain('# Анализ кода');
        expect(formatted).toContain('**Оценка:** 95/100');
        expect(formatted).toContain('**Статус:** ✅ Высокое качество');
        expect(formatted).toContain('🔧 **Анализ кода завершен**');
        expect(formatted).toContain('Время выполнения: 1500мс');
        expect(formatted).toContain('Использовано токенов: 250');
        expect(formatted).toContain('Модель: claude-3.5-sonnet');
        expect(formatted).toContain('Язык: typescript');
        expect(formatted).toContain('Дополнительных файлов: 3');
        expect(formatted).toContain('Статус обработки: ✅ Успешно');
    });

    it('должен форматировать неуспешный результат валидации', () => {
        const result: ValidationResponse = {
            duration: 800,
            issues: ['Критическая ошибка в коде', 'Предупреждение о стиле'],
            metadata: {
                fullResponse: '# Результат валидации\n❌ Обнаружены критические проблемы',
                model: 'gpt-4',
            },
            promptUsed: 'Validation prompt',
            score: 45,
            success: false,
            type: 'code',
        };

        const formatted = formatValidationResponse(result);

        expect(formatted).toContain('# Результат валидации');
        expect(formatted).toContain('❌ Обнаружены критические проблемы');
        expect(formatted).toContain('Время выполнения: 800мс');
        expect(formatted).toContain('Модель: gpt-4');
        expect(formatted).toContain('Статус обработки: ❌ С ошибками');
        expect(formatted).not.toContain('Использовано токенов');
        expect(formatted).not.toContain('Язык:');
        expect(formatted).not.toContain('Дополнительных файлов:');
    });

    it('должен обрабатывать результат без fullResponse в метаданных', () => {
        const result: ValidationResponse = {
            duration: 1200,
            issues: [],
            metadata: {
                model: 'claude-3-haiku',
            },
            promptUsed: 'Test prompt',
            score: 85,
            success: true,
            type: 'tests',
        };

        const formatted = formatValidationResponse(result);

        expect(formatted).toContain('Ответ не получен');
        expect(formatted).toContain('Время выполнения: 1200мс');
        expect(formatted).toContain('Модель: claude-3-haiku');
        expect(formatted).toContain('Статус обработки: ✅ Успешно');
    });

    it('должен обрабатывать результат без метаданных', () => {
        const result: ValidationResponse = {
            duration: 500,
            issues: [],
            promptUsed: 'Simple prompt',
            score: 90,
            success: true,
            type: 'documentation',
        };

        const formatted = formatValidationResponse(result);

        expect(formatted).toContain('Ответ не получен');
        expect(formatted).toContain('Время выполнения: 500мс');
        expect(formatted).not.toContain('Модель:');
        expect(formatted).not.toContain('Язык:');
        expect(formatted).not.toContain('Использовано токенов');
    });

    it('должен форматировать результат с токенами но без других метаданных', () => {
        const result: ValidationResponse = {
            duration: 2000,
            issues: [],
            metadata: {
                fullResponse: 'Simple response from AI',
            },
            promptUsed: 'Prompt with tokens',
            score: 80,
            success: true,
            tokensUsed: 150,
            type: 'architecture',
        };

        const formatted = formatValidationResponse(result);

        expect(formatted).toContain('Simple response from AI');
        expect(formatted).toContain('Время выполнения: 2000мс');
        expect(formatted).toContain('Использовано токенов: 150');
        expect(formatted).not.toContain('Модель:');
        expect(formatted).not.toContain('Язык:');
    });

    it('должен корректно обрабатывать нулевое количество дополнительных файлов', () => {
        const result: ValidationResponse = {
            duration: 1000,
            issues: [],
            metadata: {
                additionalFilesCount: 0,
                fullResponse: 'Analysis complete',
            },
            promptUsed: 'Test prompt',
            score: 88,
            success: true,
            type: 'code',
        };

        const formatted = formatValidationResponse(result);

        expect(formatted).toContain('Analysis complete');
        expect(formatted).toContain('Дополнительных файлов: 0');
    });

    it('должен обрабатывать многострочный fullResponse', () => {
        const result: ValidationResponse = {
            duration: 1800,
            issues: [],
            metadata: {
                fullResponse: `# Подробный анализ
                
## Результаты проверки
✅ Код соответствует стандартам
⚠️ Найдены незначительные замечания

## Рекомендации
- Добавить комментарии
- Оптимизировать производительность`,
                model: 'gpt-4-turbo',
            },
            promptUsed: 'Multiline test',
            score: 78,
            success: true,
            type: 'prompts',
        };

        const formatted = formatValidationResponse(result);

        expect(formatted).toContain('# Подробный анализ');
        expect(formatted).toContain('## Результаты проверки');
        expect(formatted).toContain('## Рекомендации');
        expect(formatted).toContain('Модель: gpt-4-turbo');
    });

    it('должен правильно отображать все возможные поля метаданных', () => {
        const result: ValidationResponse = {
            duration: 3000,
            issues: ['Minor issue'],
            metadata: {
                additionalFilesCount: 5,
                detectedLanguage: 'javascript',
                fullResponse: 'Complete analysis response',
                model: 'claude-3.5-sonnet-20241022',
            },
            promptUsed: 'Complete test prompt',
            score: 92,
            success: true,
            tokensUsed: 500,
            type: 'architecture',
        };

        const formatted = formatValidationResponse(result);

        expect(formatted).toContain('Complete analysis response');
        expect(formatted).toContain('Время выполнения: 3000мс');
        expect(formatted).toContain('Использовано токенов: 500');
        expect(formatted).toContain('Модель: claude-3.5-sonnet-20241022');
        expect(formatted).toContain('Язык: javascript');
        expect(formatted).toContain('Дополнительных файлов: 5');
        expect(formatted).toContain('Статус обработки: ✅ Успешно');
    });
});
