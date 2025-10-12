import type { ParallelTestResult } from '../../../workflows/testing/types';

/** Форматирует отчет тестирования промпта */
export function formatTestPromptResponse(testResult: ParallelTestResult): string {
    // Определяем статус и иконку по оценке
    let statusIcon: string;
    let statusText: string;

    if (testResult.consistency.score >= 80) {
        statusIcon = '✅';
        statusText = 'Высокая консистентность';
    } else if (testResult.consistency.score >= 60) {
        statusIcon = '⚠️';
        statusText = 'Умеренная консистентность';
    } else {
        statusIcon = '❌';
        statusText = 'Низкая консистентность';
    }

    // Создаем заголовок отчета
    const header = `# 🧪 Результат тестирования промпта

## 📊 Сводка результатов

**Оценка консистентности:** ${testResult.consistency.score}/100
**Статус:** ${statusIcon} ${statusText}
**Всего тестов:** ${testResult.totalTests}
**Успешных:** ${testResult.successfulTests}
**Неудачных:** ${testResult.failedTests}
**Среднее время ответа:** ${testResult.averageResponseTime}мс

## 🔍 Анализ консистентности

${testResult.consistency.analysis}`;

    // Добавляем секцию паттернов, если они есть
    let patternsSection = '';
    if (testResult.consistency.patterns.length > 0) {
        patternsSection = `

### 📋 Выявленные паттерны:

${testResult.consistency.patterns.map((pattern) => `- ${pattern}`).join('\n')}`;
    }

    // Добавляем секцию аномалий, если они есть
    let anomaliesSection = '';
    if (testResult.consistency.anomalies.length > 0) {
        anomaliesSection = `

### ⚠️ Аномалии:

${testResult.consistency.anomalies.map((anomaly) => `- ${anomaly}`).join('\n')}`;
    }

    // Добавляем секцию рекомендаций, если они есть
    let recommendationsSection = '';
    if (testResult.consistency.recommendations.length > 0) {
        recommendationsSection = `

### 💡 Рекомендации:

${testResult.consistency.recommendations.map((recommendation) => `- ${recommendation}`).join('\n')}`;
    }

    // Создаем секцию метаданных
    const metaData = `

---

🧪 **Параллельное тестирование завершено**

**Метаинформация:**
- Время выполнения: ${testResult.metadata.duration}мс
- Использованные модели: ${testResult.metadata.models.join(', ')}
- Начало тестирования: ${testResult.metadata.startTime}
- Окончание: ${testResult.metadata.endTime}`;

    // Если есть AI-анализ, используем его, иначе создаем отчет из частей
    if (testResult.consistency.aiAnalysis) {
        return `${testResult.consistency.aiAnalysis}\n\n${metaData}`;
    }

    return `${header}${patternsSection}${anomaliesSection}${recommendationsSection}\n${metaData}`;
}
