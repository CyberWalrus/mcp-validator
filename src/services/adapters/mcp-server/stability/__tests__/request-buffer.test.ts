import { describe, expect, it, vi } from 'vitest';

import type { MCPRequest } from '../../types';
import { RequestBuffer } from '../request-buffer';

describe('RequestBuffer', () => {
    it('должен корректно обрабатывать полные JSON объекты', () => {
        const buffer = new RequestBuffer();
        const mockCallback = vi.fn();

        const testRequest: MCPRequest = {
            id: 1,
            jsonrpc: '2.0',
            method: 'test',
        };

        buffer.processData(`${JSON.stringify(testRequest)}\n`, mockCallback);

        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith(testRequest);
    });

    it('должен буферизировать неполные JSON объекты', () => {
        const buffer = new RequestBuffer();
        const mockCallback = vi.fn();

        const testRequest: MCPRequest = {
            id: 1,
            jsonrpc: '2.0',
            method: 'test',
        };

        const jsonString = JSON.stringify(testRequest);
        const firstPart = jsonString.substring(0, jsonString.length / 2);
        const secondPart = jsonString.substring(jsonString.length / 2);

        // Отправляем первую часть
        buffer.processData(firstPart, mockCallback);
        expect(mockCallback).not.toHaveBeenCalled();

        // Отправляем вторую часть с переносом строки
        buffer.processData(`${secondPart}\n`, mockCallback);
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith(testRequest);
    });

    it('должен обрабатывать множественные JSON объекты в одном chunk', () => {
        const buffer = new RequestBuffer();
        const mockCallback = vi.fn();

        const request1: MCPRequest = { id: 1, jsonrpc: '2.0', method: 'test1' };
        const request2: MCPRequest = { id: 2, jsonrpc: '2.0', method: 'test2' };

        const data = `${JSON.stringify(request1)}\n${JSON.stringify(request2)}\n`;
        buffer.processData(data, mockCallback);

        expect(mockCallback).toHaveBeenCalledTimes(2);
        expect(mockCallback).toHaveBeenNthCalledWith(1, request1);
        expect(mockCallback).toHaveBeenNthCalledWith(2, request2);
    });

    it('должен игнорировать пустые строки', () => {
        const buffer = new RequestBuffer();
        const mockCallback = vi.fn();

        buffer.processData('\n\n\n', mockCallback);
        expect(mockCallback).not.toHaveBeenCalled();
    });

    it('должен обрабатывать некорректный JSON без краша', () => {
        const buffer = new RequestBuffer();
        const mockCallback = vi.fn();

        buffer.processData('invalid-json\n', mockCallback);
        expect(mockCallback).not.toHaveBeenCalled();
    });

    it('должен предотвращать race conditions при concurrent обработке', () => {
        const buffer = new RequestBuffer();
        const mockCallback = vi.fn();

        const testRequest: MCPRequest = {
            id: 1,
            jsonrpc: '2.0',
            method: 'test',
        };

        // Симулируем concurrent вызовы
        buffer.processData(`${JSON.stringify(testRequest)}\n`, mockCallback);
        buffer.processData(`${JSON.stringify(testRequest)}\n`, mockCallback);

        // Должен обработать оба запроса без race conditions
        expect(mockCallback).toHaveBeenCalledTimes(2);
    });

    it('должен корректно очищать буфер', () => {
        const buffer = new RequestBuffer();
        const mockCallback = vi.fn();

        // Добавляем неполные данные в буфер
        buffer.processData('{"incomplete":', mockCallback);

        const stateBefore = buffer.getState();
        expect(stateBefore.buffer).toBe('{"incomplete":');

        // Очищаем буфер
        buffer.clear();

        const stateAfter = buffer.getState();
        expect(stateAfter.buffer).toBe('');
        expect(stateAfter.isProcessing).toBe(false);
    });
});
