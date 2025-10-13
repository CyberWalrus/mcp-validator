import { ANOMALY_MULTIPLIERS, TIME_VARIANCE_THRESHOLD, VARIANCE_THRESHOLDS } from '../consistency-analysis-constants';
import type { TestIterationResult } from '../types';

type TimeAnalysisResult = {
    anomalies: string[];
    patterns: string[];
    score: number;
};

/** Вычисляет дисперсию для массива значений */
function calculateVariance(values: number[], mean: number): number {
    const sumSquaredDiffs = values.reduce((sum, value) => sum + (value - mean) ** 2, 0);

    return sumSquaredDiffs / values.length;
}

/** Анализирует консистентность времени выполнения */
export function analyzeTimeConsistency(results: TestIterationResult[]): TimeAnalysisResult {
    const times = results.map((r) => r.duration);
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const variance = calculateVariance(times, avgTime);

    const coefficientOfVariation = avgTime > 0 ? variance / avgTime : 0;

    const score = Math.max(0, Math.min(100, 100 - coefficientOfVariation * 50));

    const patterns: string[] = [];
    const anomalies: string[] = [];

    if (coefficientOfVariation < TIME_VARIANCE_THRESHOLD) {
        patterns.push('Стабильное время выполнения');
    } else if (coefficientOfVariation < VARIANCE_THRESHOLDS.MEDIUM) {
        patterns.push('Умеренная вариативность времени выполнения');
    } else if (coefficientOfVariation < VARIANCE_THRESHOLDS.HIGH) {
        patterns.push('Высокая вариативность времени выполнения');
    } else {
        patterns.push('Критически высокая вариативность времени выполнения');
        anomalies.push('Время выполнения сильно варьируется между итерациями');
    }

    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);

    if (minTime < avgTime * ANOMALY_MULTIPLIERS.TIME) {
        anomalies.push(`Обнаружено очень быстрое выполнение (${minTime}мс)`);
    }

    if (maxTime > avgTime * ANOMALY_MULTIPLIERS.TIME) {
        anomalies.push(`Обнаружено очень медленное выполнение (${maxTime}мс)`);
    }

    return { anomalies, patterns, score };
}
