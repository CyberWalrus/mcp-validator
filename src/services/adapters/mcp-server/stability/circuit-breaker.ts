import { info, warn } from '../../../../lib/helpers/logger';

/** Состояния circuit breaker */
type CircuitState = 'CLOSED' | 'HALF_OPEN' | 'OPEN';

/** Конфигурация circuit breaker */
type CircuitBreakerConfig = {
    failureThreshold: number;
    // Время до попытки восстановления (мс)
    monitoringWindow: number;
    // Количество ошибок для открытия
    recoveryTimeout: number; // Окно мониторинга ошибок (мс)
};

/** Статистика circuit breaker */
type CircuitBreakerStats = {
    failedRequests: number;
    lastFailureTime: Date | null;
    lastSuccessTime: Date | null;
    successfulRequests: number;
    totalRequests: number;
};

/** Circuit breaker для защиты от каскадных отказов OpenRouter API */
export class CircuitBreaker {
    private state: CircuitState = 'CLOSED';

    private config: CircuitBreakerConfig;

    private stats: CircuitBreakerStats;

    private failures: Date[] = [];

    constructor(config: Partial<CircuitBreakerConfig> = {}) {
        this.config = {
            failureThreshold: 5,
            // 1 минута
            monitoringWindow: 300000,
            // 5 ошибок подряд
            recoveryTimeout: 60000, // 5 минут
            ...config,
        };

        this.stats = {
            failedRequests: 0,
            lastFailureTime: null,
            lastSuccessTime: null,
            successfulRequests: 0,
            totalRequests: 0,
        };

        info('Circuit breaker инициализирован', { config: this.config });
    }

    /** Выполняет операцию через circuit breaker */
    async execute<T>(operation: () => Promise<T>): Promise<T> {
        if (this.state === 'OPEN') {
            if (this.shouldAttemptRecovery()) {
                this.state = 'HALF_OPEN';
                info('Circuit breaker переходит в HALF_OPEN состояние');
            } else {
                throw new Error('Circuit breaker OPEN - операция заблокирована');
            }
        }

        this.stats.totalRequests++;

        try {
            const result = await operation();
            this.onSuccess();

            return result;
        } catch (err) {
            this.onFailure();
            throw err;
        }
    }

    /** Обрабатывает успешное выполнение */
    private onSuccess(): void {
        this.stats.successfulRequests++;
        this.stats.lastSuccessTime = new Date();

        if (this.state === 'HALF_OPEN') {
            this.state = 'CLOSED';
            this.failures = [];
            info('Circuit breaker восстановлен - переход в CLOSED состояние');
        }
    }

    /** Обрабатывает ошибку выполнения */
    private onFailure(): void {
        this.stats.failedRequests++;
        this.stats.lastFailureTime = new Date();
        this.failures.push(new Date());

        // Очищаем старые ошибки вне окна мониторинга
        this.cleanupOldFailures();

        if (this.failures.length >= this.config.failureThreshold) {
            this.state = 'OPEN';
            warn('Circuit breaker открыт из-за превышения порога ошибок', {
                failures: this.failures.length,
                threshold: this.config.failureThreshold,
            });
        }
    }

    /** Проверяет, следует ли попытаться восстановиться */
    private shouldAttemptRecovery(): boolean {
        if (!this.stats.lastFailureTime) {
            return true;
        }

        const timeSinceLastFailure = Date.now() - this.stats.lastFailureTime.getTime();

        return timeSinceLastFailure >= this.config.recoveryTimeout;
    }

    /** Очищает старые ошибки вне окна мониторинга */
    private cleanupOldFailures(): void {
        const cutoffTime = Date.now() - this.config.monitoringWindow;
        this.failures = this.failures.filter((failure) => failure.getTime() > cutoffTime);
    }

    /** Получает текущее состояние circuit breaker */
    getState(): {
        config: CircuitBreakerConfig;
        recentFailures: number;
        state: CircuitState;
        stats: CircuitBreakerStats;
    } {
        this.cleanupOldFailures();

        return {
            config: { ...this.config },
            recentFailures: this.failures.length,
            state: this.state,
            stats: { ...this.stats },
        };
    }

    /** Принудительно сбрасывает circuit breaker */
    reset(): void {
        this.state = 'CLOSED';
        this.failures = [];
        this.stats = {
            failedRequests: 0,
            lastFailureTime: null,
            lastSuccessTime: null,
            successfulRequests: 0,
            totalRequests: 0,
        };

        info('Circuit breaker принудительно сброшен');
    }
}
