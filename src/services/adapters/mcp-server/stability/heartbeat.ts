import { info, warn } from '../../../../lib/helpers/logger';

/** Конфигурация heartbeat механизма */
type HeartbeatConfig = {
    // Интервал в миллисекундах
    enabled: boolean;
    interval: number;
};

/** Состояние heartbeat механизма */
type HeartbeatState = {
    intervalId: NodeJS.Timeout | null;
    isActive: boolean;
    lastHeartbeat: Date;
};

/** Heartbeat механизм для поддержания соединения с Cursor IDE */
export class HeartbeatManager {
    private config: HeartbeatConfig = {
        // 30 секунд
        enabled: true,
        interval: 30000,
    };

    private state: HeartbeatState = {
        intervalId: null,
        isActive: false,
        lastHeartbeat: new Date(),
    };

    /** Запускает heartbeat механизм */
    start(): void {
        if (this.state.isActive) {
            warn('Heartbeat уже активен');

            return;
        }

        if (!this.config.enabled) {
            info('Heartbeat отключен в конфигурации');

            return;
        }

        this.state.intervalId = setInterval(() => {
            this.sendHeartbeat();
        }, this.config.interval);

        this.state.isActive = true;
        this.state.lastHeartbeat = new Date();

        info('Heartbeat механизм запущен', {
            interval: this.config.interval,
        });
    }

    /** Останавливает heartbeat механизм */
    stop(): void {
        if (this.state.intervalId) {
            clearInterval(this.state.intervalId);
            this.state.intervalId = null;
        }

        this.state.isActive = false;

        info('Heartbeat механизм остановлен');
    }

    /** Отправляет heartbeat сигнал */
    private sendHeartbeat(): void {
        try {
            // Отправляем минимальный JSON для поддержания соединения
            // Это не полноценный MCP запрос, а служебный сигнал
            const heartbeatSignal = {
                server: 'mcp-validator',
                timestamp: new Date().toISOString(),
                type: 'heartbeat',
            };

            // Отправляем в stderr чтобы не мешать основному JSON-RPC протоколу
            process.stderr.write(`# ${JSON.stringify(heartbeatSignal)}\n`);

            this.state.lastHeartbeat = new Date();
        } catch (err) {
            warn('Ошибка отправки heartbeat', { error: err });
        }
    }

    /** Обновляет конфигурацию heartbeat */
    updateConfig(config: Partial<HeartbeatConfig>): void {
        const wasActive = this.state.isActive;

        if (wasActive) {
            this.stop();
        }

        this.config = { ...this.config, ...config };

        if (wasActive && this.config.enabled) {
            this.start();
        }

        info('Конфигурация heartbeat обновлена', { config: this.config });
    }

    /** Получает текущее состояние heartbeat */
    getState(): Readonly<HeartbeatConfig & HeartbeatState> {
        return {
            ...this.state,
            ...this.config,
        };
    }
}
