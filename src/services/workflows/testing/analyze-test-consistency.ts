import { info } from '../../../lib/helpers/logger';
import { analyzeLengthConsistency } from './helpers/analyze-length-consistency';
import { analyzeStructureConsistency } from './helpers/analyze-structure-consistency';
import { analyzeTimeConsistency } from './helpers/analyze-time-consistency';
import { CONSISTENCY_THRESHOLDS } from './constants';
import type { ConsistencyAnalysis, TestIterationResult } from './types';

/** Генерирует общий анализ на основе результатов */
function generateOverallAnalysis(score: number, successfulCount: number, totalCount: number): string {
    const successRate = Math.round((successfulCount / totalCount) * 100);

    if (score >= CONSISTENCY_THRESHOLDS.HIGH && successRate >= 90) {
        return `Отличная консистентность (${score}/100) с высоким процентом успеха (${successRate}%). Промпт готов к использованию в продакшене.`;
    }
    if (score >= CONSISTENCY_THRESHOLDS.MEDIUM && successRate >= 70) {
        return `Умеренная консистентность (${score}/100) с приемлемым процентом успеха (${successRate}%). Рекомендуется дополнительная настройка.`;
    }
    if (score >= CONSISTENCY_THRESHOLDS.LOW && successRate >= 50) {
        return `Низкая консистентность (${score}/100) с проблемным процентом успеха (${successRate}%). Требуется существенная доработка.`;
    }

    return `Критически низкая консистентность (${score}/100) с неприемлемым процентом успеха (${successRate}%). Промпт требует полной переработки.`;
}

/** Выполняет детальный анализ консистентности результатов тестирования */
export function analyzeTestConsistency(results: TestIterationResult[]): ConsistencyAnalysis {
    info('Начинаю анализ консистентности результатов', {
        isSuccessfulResults: results.filter((r) => r.isSuccess).length,
        totalResults: results.length,
    });

    const isSuccessfulResults = results.filter((r) => r.isSuccess && r.content);

    if (isSuccessfulResults.length === 0) {
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

    if (isSuccessfulResults.length === 1) {
        return {
            analysis: 'Недостаточно данных для анализа консистентности - только один успешный результат',
            anomalies: [],
            patterns: [],
            recommendations: ['Увеличьте количество итераций тестирования'],
            score: 50,
        };
    }

    const lengthAnalysis = analyzeLengthConsistency(isSuccessfulResults);
    const structureAnalysis = analyzeStructureConsistency(isSuccessfulResults);
    const timeAnalysis = analyzeTimeConsistency(isSuccessfulResults);

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

    const failedResults = results.filter((r) => !r.isSuccess);
    if (failedResults.length > 0) {
        anomalies.push(`${failedResults.length} из ${results.length} запросов завершились ошибкой`);
        recommendations.push('Исследуйте причины отказов в запросах');
    }

    const analysis = generateOverallAnalysis(overallScore, isSuccessfulResults.length, results.length);

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
