import type { ConsistencyAnalysis } from '../types';

/** Генерирует секцию обнаруженных аномалий */
export function generateAnomaliesSection(consistency: ConsistencyAnalysis): string {
    if (consistency.anomalies === null || consistency.anomalies === undefined || consistency.anomalies.length === 0) {
        return '';
    }

    return `### ⚠️ Обнаруженные аномалии

${consistency.anomalies.map((anomaly) => `- ${anomaly}`).join('\n')}`;
}
