import { error, info } from '../../../../lib/helpers/logger';
import type { MCPRequest } from '../types';

/** Состояние буфера для обработки JSON запросов */
type RequestBufferState = {
    buffer: string;
    isProcessing: boolean;
};

/** Буфер для корректной обработки JSON запросов из stdin */
export class RequestBuffer {
    private state: RequestBufferState = {
        buffer: '',
        isProcessing: false,
    };

    /** Обрабатывает входящие данные и извлекает полные JSON объекты */
    processData(data: string, onRequest: (request: MCPRequest) => void): void {
        this.state.buffer += data;

        // Предотвращаем race conditions при concurrent обработке
        if (this.state.isProcessing) {
            return;
        }

        this.state.isProcessing = true;

        try {
            this.extractCompleteRequests(onRequest);
        } finally {
            this.state.isProcessing = false;
        }
    }

    /** Извлекает полные JSON объекты из буфера */
    private extractCompleteRequests(onRequest: (request: MCPRequest) => void): void {
        const lines = this.state.buffer.split('\n');

        // Последняя строка может быть неполной, сохраняем её в буфере
        this.state.buffer = lines.pop() || '';

        for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine) {
                continue;
            }

            try {
                const request = JSON.parse(trimmedLine) as MCPRequest;
                onRequest(request);
            } catch (parseError) {
                error('Ошибка парсинга JSON запроса', {
                    error: parseError,
                    line: trimmedLine.substring(0, 100), // Первые 100 символов для диагностики
                });
            }
        }
    }

    /** Очищает буфер (для тестов и cleanup) */
    clear(): void {
        this.state.buffer = '';
        this.state.isProcessing = false;
        info('Буфер запросов очищен');
    }

    /** Получает текущее состояние буфера (для диагностики) */
    getState(): Readonly<RequestBufferState> {
        return { ...this.state };
    }
}
