import { describe, expect, it, vi } from 'vitest';

import { CircuitBreaker } from '../circuit-breaker';

describe('CircuitBreaker', () => {
    it('должен выполнять операции в CLOSED состоянии', async () => {
        const circuitBreaker = new CircuitBreaker();
        const mockOperation = vi.fn().mockResolvedValue('success');

        const result = await circuitBreaker.execute(mockOperation);

        expect(result).toBe('success');
        expect(mockOperation).toHaveBeenCalledTimes(1);
        expect(circuitBreaker.getState().state).toBe('CLOSED');
    });

    it('должен переходить в OPEN состояние после превышения порога ошибок', async () => {
        const circuitBreaker = new CircuitBreaker({
            failureThreshold: 2,
            monitoringWindow: 5000,
            recoveryTimeout: 1000,
        });

        const mockOperation = vi.fn().mockRejectedValue(new Error('test error'));

        // Первая ошибка
        await expect(circuitBreaker.execute(mockOperation)).rejects.toThrow('test error');
        expect(circuitBreaker.getState().state).toBe('CLOSED');

        // Вторая ошибка - должна открыть circuit
        await expect(circuitBreaker.execute(mockOperation)).rejects.toThrow('test error');
        expect(circuitBreaker.getState().state).toBe('OPEN');
    });

    it('должен блокировать операции в OPEN состоянии', async () => {
        const circuitBreaker = new CircuitBreaker({
            failureThreshold: 1,
            monitoringWindow: 5000,
            recoveryTimeout: 1000,
        });

        const mockOperation = vi.fn().mockRejectedValue(new Error('test error'));

        // Открываем circuit
        await expect(circuitBreaker.execute(mockOperation)).rejects.toThrow('test error');
        expect(circuitBreaker.getState().state).toBe('OPEN');

        // Следующая операция должна быть заблокирована
        const successOperation = vi.fn().mockResolvedValue('success');
        await expect(circuitBreaker.execute(successOperation)).rejects.toThrow('Circuit breaker OPEN');
        expect(successOperation).not.toHaveBeenCalled();
    });

    it('должен переходить в HALF_OPEN после recovery timeout', async () => {
        const circuitBreaker = new CircuitBreaker({
            failureThreshold: 1,
            // Короткий timeout для теста
            monitoringWindow: 5000,
            recoveryTimeout: 100,
        });

        const mockOperation = vi.fn().mockRejectedValue(new Error('test error'));

        // Открываем circuit
        await expect(circuitBreaker.execute(mockOperation)).rejects.toThrow('test error');
        expect(circuitBreaker.getState().state).toBe('OPEN');

        // Ждем recovery timeout
        await new Promise((resolve) => {
            setTimeout(() => resolve(undefined), 150);
        });

        // Следующая операция должна перевести в HALF_OPEN
        const successOperation = vi.fn().mockResolvedValue('success');
        const result = await circuitBreaker.execute(successOperation);

        expect(result).toBe('success');
        expect(circuitBreaker.getState().state).toBe('CLOSED'); // Успешная операция закрывает circuit
    });

    it('должен возвращаться в CLOSED после успешной операции в HALF_OPEN', async () => {
        const circuitBreaker = new CircuitBreaker({
            failureThreshold: 1,
            monitoringWindow: 5000,
            recoveryTimeout: 100,
        });

        // Открываем circuit
        const failOperation = vi.fn().mockRejectedValue(new Error('test error'));
        await expect(circuitBreaker.execute(failOperation)).rejects.toThrow('test error');
        expect(circuitBreaker.getState().state).toBe('OPEN');

        // Ждем recovery timeout
        await new Promise((resolve) => {
            setTimeout(() => resolve(undefined), 150);
        });

        // Успешная операция должна закрыть circuit
        const successOperation = vi.fn().mockResolvedValue('success');
        const result = await circuitBreaker.execute(successOperation);

        expect(result).toBe('success');
        expect(circuitBreaker.getState().state).toBe('CLOSED');
    });

    it('должен очищать старые ошибки вне окна мониторинга', async () => {
        const circuitBreaker = new CircuitBreaker({
            failureThreshold: 3,
            monitoringWindow: 100,
            recoveryTimeout: 1000, // Короткое окно для теста
        });

        const mockOperation = vi.fn().mockRejectedValue(new Error('test error'));

        // Добавляем ошибку
        await expect(circuitBreaker.execute(mockOperation)).rejects.toThrow('test error');
        expect(circuitBreaker.getState().recentFailures).toBe(1);

        // Ждем выхода за окно мониторинга
        await new Promise((resolve) => {
            setTimeout(() => resolve(undefined), 150);
        });

        // Проверяем состояние - старые ошибки должны быть очищены
        const state = circuitBreaker.getState();
        expect(state.recentFailures).toBe(0);
    });

    it('должен корректно сбрасываться', async () => {
        const circuitBreaker = new CircuitBreaker({
            failureThreshold: 1,
            monitoringWindow: 5000,
            recoveryTimeout: 1000,
        });

        // Открываем circuit
        const mockOperation = vi.fn().mockRejectedValue(new Error('test error'));
        await expect(circuitBreaker.execute(mockOperation)).rejects.toThrow('test error');
        expect(circuitBreaker.getState().state).toBe('OPEN');

        // Сбрасываем
        circuitBreaker.reset();

        const state = circuitBreaker.getState();
        expect(state.state).toBe('CLOSED');
        expect(state.stats.totalRequests).toBe(0);
        expect(state.stats.failedRequests).toBe(0);
        expect(state.recentFailures).toBe(0);
    });
});
