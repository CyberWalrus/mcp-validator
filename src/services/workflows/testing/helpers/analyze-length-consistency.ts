import { ANOMALY_MULTIPLIERS, VARIANCE_THRESHOLDS } from '../consistency-analysis-constants';
import type { TestIterationResult } from '../types';

type LengthAnalysisResult = {
    anomalies: string[];
    patterns: string[];
    score: number;
};

/** Вычисляет дисперсию для массива значений */
function calculateVariance(values: number[], mean: number): number {
    const sumSquaredDiffs = values.reduce((sum, value) => sum + (value - mean) ** 2, 0);

    return sumSquaredDiffs / values.length;
}

/** Анализирует консистентность длины ответов */
export function analyzeLengthConsistency(results: TestIterationResult[]): LengthAnalysisResult {
    const lengths = results.map((r) => r.content.length);
    const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = calculateVariance(lengths, avgLength);

    const coefficientOfVariation = avgLength > 0 ? Math.sqrt(variance) / avgLength : 0;

    const score = Math.max(0, Math.min(100, 100 - coefficientOfVariation * 50));

    const patterns: string[] = [];
    const anomalies: string[] = [];

    if (coefficientOfVariation < VARIANCE_THRESHOLDS.LOW) {
        patterns.push('Очень стабильная длина ответов');
    } else if (coefficientOfVariation < VARIANCE_THRESHOLDS.MEDIUM) {
        patterns.push('Умеренная вариативность длины ответов');
    } else if (coefficientOfVariation < VARIANCE_THRESHOLDS.HIGH) {
        patterns.push('Высокая вариативность длины ответов');
    } else {
        patterns.push('Критически высокая вариативность длины ответов');
        anomalies.push('Длина ответов сильно варьируется между итерациями');
    }

    const minLength = Math.min(...lengths);
    const maxLength = Math.max(...lengths);

    if (minLength < avgLength * ANOMALY_MULTIPLIERS.LENGTH) {
        anomalies.push(`Обнаружен очень короткий ответ (${minLength} символов)`);
    }

    if (maxLength > avgLength * ANOMALY_MULTIPLIERS.LENGTH) {
        anomalies.push(`Обнаружен очень длинный ответ (${maxLength} символов)`);
    }

    return { anomalies, patterns, score };
}
