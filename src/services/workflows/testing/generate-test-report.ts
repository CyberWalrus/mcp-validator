/* eslint-disable @typescript-eslint/no-use-before-define */
import { info } from '../../../lib/helpers/logger';
import type { ConsistencyAnalysis, ParallelTestResult, TestIterationResult } from './types';

/** Генерирует подробный отчет о результатах параллельного тестирования */
export function generateTestReport(result: ParallelTestResult): string {
    info('Генерирую отчет о параллельном тестировании', {
        consistencyScore: result.consistency.score,
        totalTests: result.totalTests,
    });

    return `# 🧪 Отчет о параллельном тестировании промпта

## 📊 Общая статистика

| Метрика | Значение |
|---------|----------|
| **Общее количество тестов** | ${result.totalTests} |
| **Успешных тестов** | ${result.successfulTests} (${((result.successfulTests / result.totalTests) * 100).toFixed(1)}%) |
| **Неудачных тестов** | ${result.failedTests} (${((result.failedTests / result.totalTests) * 100).toFixed(1)}%) |
| **Среднее время ответа** | ${result.averageResponseTime}мс |
| **Общее время тестирования** | ${result.metadata.duration}мс |
| **Оценка консистентности** | ${result.consistency.score}/100 |

## 🎯 Исходный промпт

\`\`\`
${result.metadata.originalPrompt}
\`\`\`

${result.metadata.context ? `**Контекст:** ${result.metadata.context}` : ''}

## 📈 Анализ консистентности

**Результат:** ${getConsistencyStatus(result.consistency.score)}

${result.consistency.analysis}

${generatePatternsSection(result.consistency)}

${generateAnomaliesSection(result.consistency)}

${generateRecommendationsSection(result.consistency)}

${generateAIAnalysisSection(result.consistency)}

## 📋 Детальные результаты тестирования

${generateDetailedResults(result.results)}

## 📊 Статистика по моделям

${generateModelStatistics(result.results)}

## ⏱️ Временные характеристики

${generateTimeStatistics(result.results)}

${generateTechnicalDetails(result)}

---

*Отчет сгенерирован: ${new Date().toISOString()}*
*Версия валидатора: ${result.metadata.validatorVersion}*`;
}

/** Определяет статус консистентности на основе оценки */
function getConsistencyStatus(score: number): string {
    if (score >= 80) {
        return '✅ **Высокая консистентность**';
    }
    if (score >= 60) {
        return '⚠️ **Средняя консистентность**';
    }
    if (score >= 40) {
        return '❌ **Низкая консистентность**';
    }

    return '🚨 **Критически низкая консистентность**';
}

/** Генерирует секцию выявленных паттернов */
function generatePatternsSection(consistency: ConsistencyAnalysis): string {
    if (!consistency.patterns || consistency.patterns.length === 0) {
        return '';
    }

    return `### ✅ Выявленные паттерны

${consistency.patterns.map((pattern) => `- ${pattern}`).join('\n')}`;
}

/** Генерирует секцию обнаруженных аномалий */
function generateAnomaliesSection(consistency: ConsistencyAnalysis): string {
    if (!consistency.anomalies || consistency.anomalies.length === 0) {
        return '';
    }

    return `### ⚠️ Обнаруженные аномалии

${consistency.anomalies.map((anomaly) => `- ${anomaly}`).join('\n')}`;
}

/** Генерирует секцию рекомендаций */
function generateRecommendationsSection(consistency: ConsistencyAnalysis): string {
    if (!consistency.recommendations || consistency.recommendations.length === 0) {
        return '';
    }

    return `### 💡 Рекомендации по улучшению

${consistency.recommendations.map((recommendation, index) => `${index + 1}. ${recommendation}`).join('\n')}`;
}

/** Генерирует детальную таблицу результатов */
function generateDetailedResults(results: TestIterationResult[]): string {
    const tableHeader = `| Итерация | Статус | Время (мс) | Модель | Детали |
|----------|--------|------------|--------|--------|`;

    const tableRows = results
        .map((result) => {
            const status = result.success ? '✅' : '❌';
            const details = result.success
                ? `${result.response?.length || 0} символов`
                : `${result.error?.substring(0, 50)}...` || 'Неизвестная ошибка';

            return `| ${result.iteration} | ${status} | ${result.responseTime} | ${result.model || 'N/A'} | ${details} |`;
        })
        .join('\n');

    return `${tableHeader}\n${tableRows}`;
}

/** Генерирует статистику по моделям */
function generateModelStatistics(results: TestIterationResult[]): string {
    const modelStats = new Map<string, { avgTime: number; successful: number; times: number[]; total: number }>();

    results.forEach((result) => {
        const model = result.model || 'Unknown';
        if (!modelStats.has(model)) {
            modelStats.set(model, { avgTime: 0, successful: 0, times: [], total: 0 });
        }

        const stats = modelStats.get(model)!;
        stats.total++;
        stats.times.push(result.responseTime);

        if (result.success) {
            stats.successful++;
        }
    });

    modelStats.forEach((stats) => {
        stats.avgTime = Math.round(stats.times.reduce((a, b) => a + b, 0) / stats.times.length);
    });

    const tableHeader = `| Модель | Тестов | Успешных | Успешность | Среднее время |
|---------|---------|-----------|------------|---------------|`;

    const tableRows = Array.from(modelStats.entries())
        .map(([model, stats]) => {
            const successRate = ((stats.successful / stats.total) * 100).toFixed(1);

            return `| ${model} | ${stats.total} | ${stats.successful} | ${successRate}% | ${stats.avgTime}мс |`;
        })
        .join('\n');

    return modelStats.size > 1 ? `${tableHeader}\n${tableRows}` : '_Использована одна модель для всех тестов_';
}

/** Генерирует статистику по времени выполнения */
function generateTimeStatistics(results: TestIterationResult[]): string {
    const times = results.map((r) => r.responseTime);
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    const avgTime = Math.round(times.reduce((a, b) => a + b, 0) / times.length);

    const sortedTimes = [...times].sort((a, b) => a - b);
    const medianTime =
        sortedTimes.length % 2 === 0
            ? Math.round(
                  ((sortedTimes[sortedTimes.length / 2 - 1] || 0) + (sortedTimes[sortedTimes.length / 2] || 0)) / 2,
              )
            : sortedTimes[Math.floor(sortedTimes.length / 2)] || 0;

    const fastRequests = times.filter((time) => time < avgTime * 0.7).length;
    const slowRequests = times.filter((time) => time > avgTime * 1.5).length;

    return `**Минимальное время:** ${minTime}мс  
**Максимальное время:** ${maxTime}мс  
**Среднее время:** ${avgTime}мс  
**Медианное время:** ${medianTime}мс  

**Распределение:**
- Быстрые запросы (< ${Math.round(avgTime * 0.7)}мс): ${fastRequests}
- Обычные запросы: ${times.length - fastRequests - slowRequests}
- Медленные запросы (> ${Math.round(avgTime * 1.5)}мс): ${slowRequests}`;
}

/** Генерирует техническую информацию */
function generateTechnicalDetails(result: ParallelTestResult): string {
    return `## 🔧 Техническая информация

**Время начала тестирования:** ${result.metadata.startTime}  
**Время окончания:** ${result.metadata.endTime}  
**Общая продолжительность:** ${result.metadata.duration}мс  

**Использованные модели:** ${result.metadata.models.join(', ')}  
**Версия валидатора:** ${result.metadata.validatorVersion}  

**Параметры тестирования:**
- Количество итераций: ${result.totalTests}
- Параллельное выполнение: Да
- Анализ консистентности: Включен`;
}

/** Генерирует секцию продвинутого AI анализа */
function generateAIAnalysisSection(consistency: ConsistencyAnalysis): string {
    if (!consistency.hasAiAnalysis || !consistency.aiAnalysis) {
        return '';
    }

    return `
## 🤖 Продвинутый AI анализ

${consistency.aiAnalysis}
`;
}
