import { JSON_RPC_ERROR_CODES } from '../../constants';
import { createMarkdownErrorResponse } from '../create-markdown-error-response';

describe('createMarkdownErrorResponse', () => {
    it('должен создавать успешный MCP ответ с markdown для системной ошибки', () => {
        const response = createMarkdownErrorResponse(
            'test-id',
            JSON_RPC_ERROR_CODES.INTERNAL_ERROR,
            'Internal server error',
        );

        expect(response.id).toBe('test-id');
        expect(response.jsonrpc).toBe('2.0');
        expect(response.error).toBeUndefined();
        expect(response.result).toBeDefined();
        const result = response.result as { content: Array<{ text: string; type: string }> };
        expect(result.content).toHaveLength(1);
        expect(result.content?.[0]?.type).toBe('text');
        expect(result.content?.[0]?.text).toContain('# ⚠️ Системная ошибка');
        expect(result.content?.[0]?.text).toContain('Internal server error');
    });

    it('должен создавать ответ с markdown для ошибки валидации', () => {
        const response = createMarkdownErrorResponse(123, JSON_RPC_ERROR_CODES.INVALID_PARAMS, 'Invalid parameters');

        expect(response.id).toBe(123);
        const result = response.result as { content: Array<{ text: string; type: string }> };
        expect(result.content[0]?.text).toContain('# ❌ Ошибка валидации');
        expect(result.content[0]?.text).toContain('Invalid parameters');
    });

    it('должен создавать ответ с markdown для файловой ошибки', () => {
        const response = createMarkdownErrorResponse(
            'file-error',
            -32000, // Server error (файловые операции)
            'File not found',
            {
                filePath: '/path/to/file.txt',
                operation: 'прочитать',
            },
        );

        expect(response.id).toBe('file-error');
        const result = response.result as { content: Array<{ text: string; type: string }> };
        expect(result.content[0]?.text).toContain('# 📁 Ошибка файловой операции');
        expect(result.content[0]?.text).toContain('File not found');
        expect(result.content[0]?.text).toContain('/path/to/file.txt');
        expect(result.content[0]?.text).toContain('прочитать');
    });

    it('должен включать дополнительный контекст в ответ', () => {
        const response = createMarkdownErrorResponse(
            'context-test',
            JSON_RPC_ERROR_CODES.INTERNAL_ERROR,
            'System failure',
            {
                filePath: '/app/src/file.ts',
                operation: 'выполнить валидацию',
                stackTrace: 'Error: System failure\n    at file.ts:42:1',
            },
        );

        const result = response.result as { content: Array<{ text: string; type: string }> };
        expect(result.content[0]?.text).toContain('System failure');
        expect(result.content[0]?.text).toContain('Error: System failure');
        expect(result.content[0]?.text).toContain('file.ts:42:1');
    });

    it('должен возвращать fallback markdown при ошибке рендеринга', () => {
        // Передаем невалидный errorCode чтобы вызвать fallback
        const response = createMarkdownErrorResponse('fallback-test', 999999, 'Unknown error');

        expect(response.id).toBe('fallback-test');
        const result = response.result as { content: Array<{ text: string; type: string }> };
        expect(result.content[0]?.text).toContain('# ⚠️');
        expect(result.content[0]?.text).toContain('999999');
        expect(result.content[0]?.text).toContain('Unknown error');
    });

    it('должен корректно обрабатывать различные типы ID', () => {
        const stringResponse = createMarkdownErrorResponse('string-id', -32603, 'Error');
        const numberResponse = createMarkdownErrorResponse(42, -32603, 'Error');
        const undefinedResponse = createMarkdownErrorResponse('undefined', -32603, 'Error');

        expect(stringResponse.id).toBe('string-id');
        expect(numberResponse.id).toBe(42);
        expect(undefinedResponse.id).toBe('undefined');

        [stringResponse, numberResponse, undefinedResponse].forEach((response) => {
            expect(response.jsonrpc).toBe('2.0');
            const result = response.result as { content: Array<{ text: string; type: string }> };
            expect(result.content[0]?.type).toBe('text');
        });
    });
});
