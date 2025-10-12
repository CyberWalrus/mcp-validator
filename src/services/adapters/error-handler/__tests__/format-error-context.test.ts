import { formatErrorContext } from '../format-error-context';
import type { ErrorContext } from '../types';

describe('formatErrorContext', () => {
    it('должен форматировать полный контекст ошибки', () => {
        const context: ErrorContext = {
            errorCode: -32603,
            errorMessage: 'Internal server error',
            errorType: 'system',
            filePath: '/path/to/file.ts',
            lineNumber: 42,
            stackTrace: 'Error: test\n    at test.ts:1:1',
            systemInfo: {
                memoryUsage: '150MB',
                nodeVersion: 'v20.0.0',
                platform: 'darwin',
                uptime: '2h 30m',
            },
        };

        const result = formatErrorContext(context);

        expect(result['error_type']).toBe('system');
        expect(result['error_message']).toBe('Internal server error');
        expect(result['error_code']).toBe('-32603');
        expect(result['node_version']).toBe('v20.0.0');
        expect(result['platform']).toBe('darwin');
        expect(result['memory_usage']).toBe('150MB');
        expect(result['uptime']).toBe('2h 30m');
        expect(result['stack_trace']).toBe('Error: test\n    at test.ts:1:1');
        expect(result['file_path']).toBe('/path/to/file.ts');
        expect(result['line_number']).toBe('42');
    });

    it('должен использовать значения по умолчанию для отсутствующих полей', () => {
        const context: ErrorContext = {
            errorCode: -32603,
            errorMessage: 'Test error',
            errorType: 'system',
        };

        const result = formatErrorContext(context);

        expect(result['error_type']).toBe('system');
        expect(result['error_message']).toBe('Test error');
        expect(result['node_version']).toBe(process.version);
        expect(result['platform']).toBe(process.platform);
        expect(result['memory_usage']).toMatch(/^\d+MB$/);
        expect(result['stack_trace']).toBe('Стек вызова недоступен');
    });

    it('должен форматировать файловую ошибку', () => {
        const context: ErrorContext = {
            errorCode: -32000,
            errorMessage: 'File not found',
            errorType: 'file',
            filePath: '/missing/file.txt',
            fileSizeLimit: '5MB',
            operation: 'прочитать',
        };

        const result = formatErrorContext(context);

        expect(result['error_type']).toBe('file');
        expect(result['operation']).toBe('прочитать');
        expect(result['file_path']).toBe('/missing/file.txt');
        expect(result['file_size_limit']).toBe('5MB');
    });

    it('должен форматировать ошибку валидации с причинами и решениями', () => {
        const context: ErrorContext = {
            causes: ['Пропущено поле', 'Неверный тип'],
            context: 'API validation',
            errorCode: -32602,
            errorDetails: 'Missing required field',
            errorMessage: 'Invalid parameters',
            errorType: 'validation',
            solutions: ['Добавьте поле', 'Исправьте тип'],
        };

        const result = formatErrorContext(context);

        expect(result['error_type']).toBe('validation');
        expect(result['error_details']).toBe('Missing required field');
        expect(result['causes']).toEqual(['Пропущено поле', 'Неверный тип']);
        expect(result['solutions']).toEqual(['Добавьте поле', 'Исправьте тип']);
        expect(result['context']).toBe('API validation');
    });

    it('должен собирать системную информацию автоматически', () => {
        const context: ErrorContext = {
            errorCode: -32603,
            errorMessage: 'Test error',
            errorType: 'system',
            // systemInfo не указан - должен собрать автоматически
        };

        const result = formatErrorContext(context);

        expect(result['node_version']).toBe(process.version);
        expect(result['platform']).toBe(process.platform);
        expect(result['memory_usage']).toMatch(/^\d+MB$/);
        expect(result['uptime']).toMatch(/^\d+[чм]/);
    });
});
