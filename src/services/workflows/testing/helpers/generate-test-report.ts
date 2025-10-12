import type { ConsistencyAnalysis, ParallelTestParams, TestIterationResult } from '../types';

/** Генерирует отчет по результатам тестирования */
export function generateTestReport(
    params: ParallelTestParams,
    results: TestIterationResult[],
    consistency: ConsistencyAnalysis,
): string {
    const successfulTests = results.filter((r) => r.success).length;
    const failedTests = results.filter((r) => !r.success).length;
    const averageTime = Math.round(results.reduce((sum, r) => sum + r.responseTime, 0) / results.length);

    return `# 🧪 Отчет тестирования промпта

## 📊 Статистика
- **Всего тестов:** ${results.length}
- **Успешных:** ${successfulTests}
- **Неудачных:** ${failedTests}
- **Среднее время:** ${averageTime}мс
- **Оценка консистентности:** ${consistency.score}/100

## 🎯 Промпт
\`\`\`
${params.prompt}
\`\`\`

${params.context ? `**Контекст:** ${params.context}` : ''}

## 📈 Анализ консистентности

${consistency.analysis}

${
    consistency.patterns && consistency.patterns.length > 0
        ? `### ✅ Паттерны\n${consistency.patterns.map((p) => `- ${p}`).join('\n')}`
        : ''
}

${
    consistency.anomalies && consistency.anomalies.length > 0
        ? `### ⚠️ Аномалии\n${consistency.anomalies.map((a) => `- ${a}`).join('\n')}`
        : ''
}

${
    consistency.recommendations && consistency.recommendations.length > 0
        ? `### 💡 Рекомендации\n${consistency.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}`
        : ''
}

## 📋 Детали тестов

| Итерация | Статус | Время (мс) | Детали |
|----------|--------|------------|--------|
${results
    .map(
        (r) =>
            `| ${r.iteration} | ${r.success ? '✅' : '❌'} | ${r.responseTime} | ${
                r.success ? `${r.response?.length || 0} символов` : r.error || 'Ошибка'
            } |`,
    )
    .join('\n')}

---
*Отчет сгенерирован: ${new Date().toISOString()}*`;
}
