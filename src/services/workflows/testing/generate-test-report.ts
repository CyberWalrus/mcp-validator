import { info } from '../../../lib/helpers/logger';
import { generateAIAnalysisSection } from './helpers/generate-ai-analysis-section';
import { generateAnomaliesSection } from './helpers/generate-anomalies-section';
import { generateDetailedResults } from './helpers/generate-detailed-results';
import { generateModelStatistics } from './helpers/generate-model-statistics';
import { generatePatternsSection } from './helpers/generate-patterns-section';
import { generateRecommendationsSection } from './helpers/generate-recommendations-section';
import { generateTechnicalDetails } from './helpers/generate-technical-details';
import { generateTimeStatistics } from './helpers/generate-time-statistics';
import { getConsistencyStatus } from './helpers/get-consistency-status';
import type { ParallelTestResult } from './types';

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
