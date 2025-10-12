import { detectErrorType } from '../helpers/error-type-detector';

describe('detectErrorType', () => {
    it('должен определять системные ошибки', () => {
        expect(detectErrorType(-32700)).toBe('system'); // Parse error
        expect(detectErrorType(-32600)).toBe('system'); // Invalid Request
        expect(detectErrorType(-32601)).toBe('system'); // Method not found
        expect(detectErrorType(-32603)).toBe('system'); // Internal error
        expect(detectErrorType(-32002)).toBe('system'); // System error
    });

    it('должен определять ошибки валидации', () => {
        expect(detectErrorType(-32602)).toBe('validation'); // Invalid params
        expect(detectErrorType(-32001)).toBe('validation'); // Application error
    });

    it('должен определять файловые ошибки', () => {
        expect(detectErrorType(-32000)).toBe('file'); // Server error
    });

    it('должен возвращать system для неизвестных кодов ошибок', () => {
        expect(detectErrorType(-99999)).toBe('system');
        expect(detectErrorType(500)).toBe('system');
        expect(detectErrorType(0)).toBe('system');
    });
});
