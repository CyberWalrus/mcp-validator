import { info } from '../../../lib/helpers/logger';
/* eslint-disable @typescript-eslint/no-use-before-define */
import { ANOMALY_MULTIPLIERS, TIME_VARIANCE_THRESHOLD, VARIANCE_THRESHOLDS } from './consistency-analysis-constants';
import { CONSISTENCY_THRESHOLDS } from './constants';
import type { ConsistencyAnalysis, TestIterationResult } from './types';

/** Выполняет детальный анализ консистентности результатов тестирования */
export function analyzeTestConsistency(results: TestIterationResult[]): ConsistencyAnalysis {
    info('Начинаю анализ консистентности результатов', {
        successfulResults: results.filter((r) => r.success).length,
        totalResults: results.length,
    });

    const successfulResults = results.filter((r) => r.success && r.response);

    if (successfulResults.length === 0) {
        return {
            analysis: 'Невозможно проанализировать консистентность - все тесты завершились ошибкой',
            anomalies: ['Все тесты завершились ошибкой'],
            patterns: [],
            recommendations: [
                'Проверьте корректность промпта',
                'Увеличьте timeout для запросов',
                'Проверьте доступность API',
            ],
            score: 0,
        };
    }

    if (successfulResults.length === 1) {
        return {
            analysis: 'Недостаточно данных для анализа консистентности - только один успешный результат',
            anomalies: [],
            patterns: [],
            recommendations: ['Увеличьте количество итераций тестирования'],
            score: 50,
        };
    }

    const lengthAnalysis = analyzeLengthConsistency(successfulResults);
    const structureAnalysis = analyzeStructureConsistency(successfulResults);
    const timeAnalysis = analyzeTimeConsistency(successfulResults);

    const overallScore = Math.round((lengthAnalysis.score + structureAnalysis.score + timeAnalysis.score) / 3);

    const patterns: string[] = [];
    const anomalies: string[] = [];
    const recommendations: string[] = [];

    patterns.push(...lengthAnalysis.patterns, ...structureAnalysis.patterns, ...timeAnalysis.patterns);

    anomalies.push(...lengthAnalysis.anomalies, ...structureAnalysis.anomalies, ...timeAnalysis.anomalies);

    if (overallScore >= CONSISTENCY_THRESHOLDS.HIGH) {
        recommendations.push(
            'Высокая консистентность - промпт готов к использованию в продакшене',
            'Рекомендуется провести дополнительное тестирование на краевых случаях',
        );
    } else if (overallScore >= CONSISTENCY_THRESHOLDS.MEDIUM) {
        recommendations.push(
            'Умеренная консистентность - рассмотрите улучшения промпта',
            'Добавьте больше конкретных инструкций',
            'Протестируйте с различными контекстами',
        );
    } else {
        recommendations.push(
            'Низкая консистентность - необходима существенная доработка промпта',
            'Добавьте четкие примеры ожидаемых ответов',
            'Разбейте сложную задачу на более простые подзадачи',
            'Увеличьте количество контекста и ограничений',
        );
    }

    const failedResults = results.filter((r) => !r.success);
    if (failedResults.length > 0) {
        anomalies.push(`${failedResults.length} из ${results.length} запросов завершились ошибкой`);
        recommendations.push('Исследуйте причины отказов в запросах');
    }

    const analysis = generateOverallAnalysis(overallScore, successfulResults.length, results.length);

    info('Анализ консистентности завершен', {
        anomalies: anomalies.length,
        patterns: patterns.length,
        score: overallScore,
    });

    return {
        analysis,
        anomalies,
        patterns,
        recommendations,
        score: overallScore,
    };
}

/** Анализирует консистентность длины ответов */
function analyzeLengthConsistency(results: TestIterationResult[]): {
    anomalies: string[];
    patterns: string[];
    score: number;
} {
    const lengths = results.map((r) => r.response!.length);
    const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const maxLength = Math.max(...lengths);
    const minLength = Math.min(...lengths);
    const variance = calculateVariance(lengths, avgLength);
    const coefficientOfVariation = variance / avgLength;

    const score = Math.max(0, Math.min(100, 100 - coefficientOfVariation * 100));

    const patterns: string[] = [];
    const anomalies: string[] = [];

    if (coefficientOfVariation < VARIANCE_THRESHOLDS.LOW) {
        patterns.push('Стабильная длина ответов (вариация < 20%)');
    } else if (coefficientOfVariation < VARIANCE_THRESHOLDS.MEDIUM) {
        patterns.push('Умеренная вариация длины ответов (20-50%)');
    } else {
        anomalies.push('Высокая вариация длины ответов (> 50%)');
    }

    if (maxLength > avgLength * ANOMALY_MULTIPLIERS.LONG_LENGTH) {
        anomalies.push(`Обнаружены аномально длинные ответы (${maxLength} символов)`);
    }

    if (minLength < avgLength * ANOMALY_MULTIPLIERS.SHORT_LENGTH) {
        anomalies.push(`Обнаружены аномально короткие ответы (${minLength} символов)`);
    }

    return { anomalies, patterns, score: Math.round(score) };
}

/** Анализирует консистентность структуры ответов */
function analyzeStructureConsistency(results: TestIterationResult[]): {
    anomalies: string[];
    patterns: string[];
    score: number;
} {
    const responses = results.map((r) => r.response!);

    const hasHeaders = responses.map((r) => (r.match(/^#/gm) || []).length);
    const hasList = responses.map((r) => (r.match(/^[-*+]/gm) || []).length);
    const hasNumbers = responses.map((r) => (r.match(/^\d+\./gm) || []).length);

    const headerVariance = calculateVariance(hasHeaders, hasHeaders.reduce((a, b) => a + b, 0) / hasHeaders.length);
    const listVariance = calculateVariance(hasList, hasList.reduce((a, b) => a + b, 0) / hasList.length);
    const numberVariance = calculateVariance(hasNumbers, hasNumbers.reduce((a, b) => a + b, 0) / hasNumbers.length);

    const structureScore = Math.max(
        0,
        100 - ((headerVariance + listVariance + numberVariance) / responses.length) * 100,
    );

    const patterns: string[] = [];
    const anomalies: string[] = [];

    const avgHeaders = hasHeaders.reduce((a, b) => a + b, 0) / hasHeaders.length;
    const avgLists = hasList.reduce((a, b) => a + b, 0) / hasList.length;

    if (avgHeaders > 1) {
        patterns.push('Последовательное использование заголовков');
    }

    if (avgLists > 2) {
        patterns.push('Использование списков для структурирования');
    }

    if (headerVariance > avgHeaders) {
        anomalies.push('Непоследовательное использование заголовков');
    }

    return { anomalies, patterns, score: Math.round(structureScore) };
}

/** Анализирует консистентность времени выполнения */
function analyzeTimeConsistency(results: TestIterationResult[]): {
    anomalies: string[];
    patterns: string[];
    score: number;
} {
    const times = results.map((r) => r.responseTime);
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const variance = calculateVariance(times, avgTime);

    // Избегаем деления на ноль
    const coefficientOfVariation = avgTime > 0 ? variance / avgTime : 0;

    const score = Math.max(0, Math.min(100, 100 - coefficientOfVariation * 50));

    const patterns: string[] = [];
    const anomalies: string[] = [];

    if (avgTime === 0) {
        patterns.push('Мгновенное выполнение (мок-режим)');
    } else if (coefficientOfVariation < TIME_VARIANCE_THRESHOLD) {
        patterns.push(
            `Стабильное время выполнения (${Math.round(avgTime)}мс ±${Math.round(coefficientOfVariation * 100)}%)`,
        );
    } else if (coefficientOfVariation < VARIANCE_THRESHOLDS.HIGH) {
        patterns.push('Умеренная вариация времени выполнения');
    } else {
        anomalies.push('Высокая вариация времени выполнения');
    }

    const slowRequests = times.filter((time) => time > avgTime * ANOMALY_MULTIPLIERS.SLOW_TIME);
    if (slowRequests.length > 0) {
        anomalies.push(`${slowRequests.length} запросов выполнялись значительно дольше среднего`);
    }

    return { anomalies, patterns, score: Math.round(score) };
}

/** Генерирует общий анализ на основе скора */
function generateOverallAnalysis(score: number, successfulCount: number, totalCount: number): string {
    const successRate = (successfulCount / totalCount) * 100;

    let qualityDescription: string;
    if (score >= CONSISTENCY_THRESHOLDS.HIGH) {
        qualityDescription = 'высокую консистентность';
    } else if (score >= CONSISTENCY_THRESHOLDS.MEDIUM) {
        qualityDescription = 'умеренную консистентность';
    } else {
        qualityDescription = 'низкую консистентность';
    }

    let qualityDetails: string;
    if (score >= CONSISTENCY_THRESHOLDS.HIGH) {
        qualityDetails = 'стабильны и предсказуемы';
    } else if (score >= CONSISTENCY_THRESHOLDS.MEDIUM) {
        qualityDetails = 'показывают некоторые вариации';
    } else {
        qualityDetails = 'значительно различаются между итерациями';
    }

    return `Промпт демонстрирует ${qualityDescription} с успешностью ${successRate.toFixed(1)}% (${successfulCount}/${totalCount} запросов). Результаты ${qualityDetails}.`;
}

/** Вычисляет дисперсию массива чисел */
function calculateVariance(values: number[], mean: number): number {
    if (values.length === 0) {
        return 0;
    }

    const squaredDiffs = values.map((value) => (value - mean) ** 2);

    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
}
