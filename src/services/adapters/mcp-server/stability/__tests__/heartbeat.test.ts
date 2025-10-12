import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { HeartbeatManager } from '../heartbeat';

// Mock process.stderr.write
const mockStderrWrite = vi.fn();
vi.stubGlobal('process', {
    ...process,
    stderr: {
        ...process.stderr,
        write: mockStderrWrite,
    },
});

describe('HeartbeatManager', () => {
    let heartbeatManager: HeartbeatManager;

    beforeEach(() => {
        heartbeatManager = new HeartbeatManager();
        mockStderrWrite.mockClear();
        vi.useFakeTimers();
    });

    afterEach(() => {
        heartbeatManager.stop();
        vi.useRealTimers();
    });

    it('должен запускаться и останавливаться корректно', () => {
        expect(heartbeatManager.getState().isActive).toBe(false);

        heartbeatManager.start();
        expect(heartbeatManager.getState().isActive).toBe(true);

        heartbeatManager.stop();
        expect(heartbeatManager.getState().isActive).toBe(false);
    });

    it('не должен запускаться повторно если уже активен', () => {
        heartbeatManager.start();
        const firstState = heartbeatManager.getState();

        heartbeatManager.start(); // Повторный запуск
        const secondState = heartbeatManager.getState();

        expect(firstState.isActive).toBe(true);
        expect(secondState.isActive).toBe(true);
        // Должен остаться тот же экземпляр
    });

    it('должен отправлять heartbeat сигналы через заданный интервал', () => {
        heartbeatManager.updateConfig({ interval: 1000 });
        heartbeatManager.start();

        // Проверяем что heartbeat еще не отправлен
        expect(mockStderrWrite).not.toHaveBeenCalled();

        // Продвигаем время на интервал
        vi.advanceTimersByTime(1000);

        // Проверяем что heartbeat отправлен
        expect(mockStderrWrite).toHaveBeenCalledTimes(1);
        expect(mockStderrWrite).toHaveBeenCalledWith(expect.stringMatching(/^# \{.*"type":"heartbeat"/));

        // Продвигаем время еще на интервал
        vi.advanceTimersByTime(1000);

        // Должен быть отправлен второй heartbeat
        expect(mockStderrWrite).toHaveBeenCalledTimes(2);
    });

    it('не должен запускаться если отключен в конфигурации', () => {
        heartbeatManager.updateConfig({ enabled: false });
        heartbeatManager.start();

        expect(heartbeatManager.getState().isActive).toBe(false);
    });

    it('должен обновлять конфигурацию и перезапускаться', () => {
        heartbeatManager.start();
        expect(heartbeatManager.getState().isActive).toBe(true);

        // Обновляем конфигурацию
        heartbeatManager.updateConfig({ interval: 2000 });

        // Должен остаться активным с новой конфигурацией
        const state = heartbeatManager.getState();
        expect(state.isActive).toBe(true);
        expect(state.interval).toBe(2000);
    });

    it('должен останавливаться при обновлении конфигурации с enabled: false', () => {
        heartbeatManager.start();
        expect(heartbeatManager.getState().isActive).toBe(true);

        // Отключаем heartbeat
        heartbeatManager.updateConfig({ enabled: false });

        expect(heartbeatManager.getState().isActive).toBe(false);
        expect(heartbeatManager.getState().enabled).toBe(false);
    });

    it('должен обновлять lastHeartbeat при отправке сигналов', () => {
        heartbeatManager.updateConfig({ interval: 1000 });
        heartbeatManager.start();

        const initialTime = heartbeatManager.getState().lastHeartbeat;

        // Продвигаем время и отправляем heartbeat
        vi.advanceTimersByTime(1000);

        const updatedTime = heartbeatManager.getState().lastHeartbeat;
        expect(updatedTime.getTime()).toBeGreaterThan(initialTime.getTime());
    });

    it('должен корректно формировать heartbeat сигнал', () => {
        heartbeatManager.updateConfig({ interval: 1000 });
        heartbeatManager.start();

        vi.advanceTimersByTime(1000);

        expect(mockStderrWrite).toHaveBeenCalledWith(expect.stringMatching(/^# \{/));

        const heartbeatCall = mockStderrWrite.mock.calls[0]?.[0] as string;
        expect(heartbeatCall).toBeDefined();
        const heartbeatData = JSON.parse(heartbeatCall.substring(2, heartbeatCall.length - 1));

        expect(heartbeatData).toMatchObject({
            server: 'mcp-validator',
            timestamp: expect.any(String),
            type: 'heartbeat',
        });
    });
});
