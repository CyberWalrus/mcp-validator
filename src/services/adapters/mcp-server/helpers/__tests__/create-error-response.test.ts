import { JSON_RPC_ERROR_CODES } from '../../constants';
import { createErrorResponse } from '../create-error-response';

describe('createErrorResponse', () => {
    it('должен создавать корректный JSON-RPC ответ с ошибкой для числового id', () => {
        const id = 123;
        const code = JSON_RPC_ERROR_CODES.INVALID_PARAMS;
        const message = 'Invalid parameters provided';

        const response = createErrorResponse(id, code, message);

        expect(response).toEqual({
            error: {
                code: JSON_RPC_ERROR_CODES.INVALID_PARAMS,
                message: 'Invalid parameters provided',
            },
            id: 123,
            jsonrpc: '2.0',
        });
    });

    it('должен создавать корректный JSON-RPC ответ с ошибкой для строкового id', () => {
        const id = 'test-request-123';
        const code = JSON_RPC_ERROR_CODES.METHOD_NOT_FOUND;
        const message = 'Method not found';

        const response = createErrorResponse(id, code, message);

        expect(response).toEqual({
            error: {
                code: JSON_RPC_ERROR_CODES.METHOD_NOT_FOUND,
                message: 'Method not found',
            },
            id: 'test-request-123',
            jsonrpc: '2.0',
        });
    });

    it('должен создавать ответ с internal error кодом', () => {
        const id = 456;
        const code = JSON_RPC_ERROR_CODES.INTERNAL_ERROR;
        const message = 'Internal server error occurred';

        const response = createErrorResponse(id, code, message);

        expect(response).toEqual({
            error: {
                code: JSON_RPC_ERROR_CODES.INTERNAL_ERROR,
                message: 'Internal server error occurred',
            },
            id: 456,
            jsonrpc: '2.0',
        });
    });

    it('должен создавать ответ с parse error кодом', () => {
        const id = null as unknown as string;
        const code = JSON_RPC_ERROR_CODES.PARSE_ERROR;
        const message = 'Parse error';

        const response = createErrorResponse(id, code, message);

        expect(response).toEqual({
            error: {
                code: JSON_RPC_ERROR_CODES.PARSE_ERROR,
                message: 'Parse error',
            },
            id: null,
            jsonrpc: '2.0',
        });
    });

    it('должен правильно обрабатывать пустое сообщение', () => {
        const id = 789;
        const code = JSON_RPC_ERROR_CODES.INVALID_REQUEST;
        const message = '';

        const response = createErrorResponse(id, code, message);

        expect(response.error?.message).toBe('');
        expect(response.id).toBe(789);
        expect(response.jsonrpc).toBe('2.0');
    });

    it('должен правильно обрабатывать специальные символы в сообщении', () => {
        const id = 'special-id';
        const code = JSON_RPC_ERROR_CODES.INVALID_PARAMS;
        const message = 'Error with "quotes" and \n newlines';

        const response = createErrorResponse(id, code, message);

        expect(response.error?.message).toBe('Error with "quotes" and \n newlines');
    });

    it('должен сохранять правильную структуру JSON-RPC 2.0', () => {
        const id = 999;
        const code = -32000; // Custom error code
        const message = 'Custom error message';

        const response = createErrorResponse(id, code, message);

        expect(response).toHaveProperty('jsonrpc', '2.0');
        expect(response).toHaveProperty('id', 999);
        expect(response).toHaveProperty('error');
        expect(response.error).toHaveProperty('code', -32000);
        expect(response.error).toHaveProperty('message', 'Custom error message');
        expect(response).not.toHaveProperty('result');
    });

    it('должен работать с различными типами error кодов', () => {
        const testCases = [
            { code: JSON_RPC_ERROR_CODES.INVALID_REQUEST, id: 1, message: 'Invalid request' },
            { code: JSON_RPC_ERROR_CODES.METHOD_NOT_FOUND, id: 2, message: 'Method not found' },
            { code: JSON_RPC_ERROR_CODES.INVALID_PARAMS, id: 3, message: 'Invalid params' },
            { code: JSON_RPC_ERROR_CODES.INTERNAL_ERROR, id: 4, message: 'Internal error' },
        ];

        testCases.forEach((testCase) => {
            const response = createErrorResponse(testCase.id, testCase.code, testCase.message);

            expect(response.id).toBe(testCase.id);
            expect(response.error?.code).toBe(testCase.code);
            expect(response.error?.message).toBe(testCase.message);
        });
    });
});
