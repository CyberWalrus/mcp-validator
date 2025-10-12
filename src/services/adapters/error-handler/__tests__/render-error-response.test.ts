import { renderErrorResponse } from '../render-error-response';
import type { ErrorContext } from '../types';

describe('renderErrorResponse', () => {
    it('должен рендерить системную ошибку с markdown форматированием', () => {
        const errorContext: ErrorContext = {
            errorCode: -32603,
            errorMessage: 'Internal server error',
            errorType: 'system',
            stackTrace: 'Error: Internal server error\n    at test.ts:1:1',
            systemInfo: {
                memoryUsage: '150MB',
                nodeVersion: 'v20.0.0',
                platform: 'darwin',
                uptime: '2h 30m',
            },
        };

        const result = renderErrorResponse(errorContext);

        expect(result.success).toBe(true);
        expect(result.content).toContain('# ⚠️ Системная ошибка');
        expect(result.content).toContain('Internal server error');
        expect(result.content).toContain('v20.0.0');
        expect(result.content).toContain('darwin');
    });

    it('должен рендерить ошибку файловой операции', () => {
        const errorContext: ErrorContext = {
            errorCode: -32000,
            errorMessage: 'File not found',
            errorType: 'file',
            filePath: '/path/to/missing/file.txt',
            operation: 'прочитать',
        };

        const result = renderErrorResponse(errorContext);

        expect(result.success).toBe(true);
        expect(result.content).toContain('# 📁 Ошибка файловой операции');
        expect(result.content).toContain('прочитать файл: /path/to/missing/file.txt');
        expect(result.content).toContain('File not found');
    });

    it('должен рендерить ошибку валидации', () => {
        const errorContext: ErrorContext = {
            causes: ['Пропущено обязательное поле', 'Неверный формат данных'],
            errorCode: -32602,
            errorDetails: 'Missing required field: name',
            errorMessage: 'Invalid parameters',
            errorType: 'validation',
            solutions: ['Добавьте поле name', 'Проверьте формат JSON'],
        };

        const result = renderErrorResponse(errorContext);

        expect(result.success).toBe(true);
        expect(result.content).toContain('# ❌ Ошибка валидации');
        expect(result.content).toContain('Invalid parameters');
        expect(result.content).toContain('Missing required field: name');
        expect(result.content).toContain('Пропущено обязательное поле');
        expect(result.content).toContain('Добавьте поле name');
    });

    it('должен возвращать ошибку при недоступном шаблоне', () => {
        const errorContext: ErrorContext = {
            errorCode: -32603,
            errorMessage: 'Test error',
            errorType: 'nonexistent',
        };

        const result = renderErrorResponse(errorContext);

        expect(result.success).toBe(false);
        expect(result.error).toContain('шаблон не найден');
    });

    it('должен заполнять отсутствующие обязательные поля значениями по умолчанию', () => {
        const errorContext: ErrorContext = {
            errorCode: -32603,
            errorMessage: 'Test error',
            errorType: 'system',
            // Не указываем systemInfo - должны подставиться значения по умолчанию
        };

        const result = renderErrorResponse(errorContext);

        expect(result.success).toBe(true);
        expect(result.content).toContain('Test error');
        expect(result.content).toContain(process.version); // node_version по умолчанию
        expect(result.content).toContain(process.platform); // platform по умолчанию
    });
});
