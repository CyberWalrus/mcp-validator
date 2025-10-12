import type { TestPromptResult } from '../../model/types/main';

/** Форматирование результата тестирования промпта в markdown */
export function formatTestPromptResult(result: TestPromptResult): string {
    const { totalIterations, successfulIterations, averageDuration, consistencyScore, results, summary } = result;

    const successRate = Math.round((successfulIterations / totalIterations) * 100);

    const overallScore = Math.round(successRate * 0.6 + consistencyScore * 0.4);
    let status: string;
    if (overallScore >= 90) {
        status = '✅ Отлично';
    } else if (overallScore >= 70) {
        status = '⚠️ Хорошо';
    } else {
        status = '❌ Требует доработки';
    }

    return `# 🧪 Результаты тестирования промпта

## Общая статистика
- **Статус:** ${status} (${overallScore}/100)
- **Успешных итераций:** ${successfulIterations}/${totalIterations} (${successRate}%)
- **Консистентность ответов:** ${consistencyScore}/100
- **Среднее время ответа:** ${Math.round(averageDuration)}мс

## Детальные результаты

${results
    .map(
        (testResult) => `
### Итерация ${testResult.iteration}
- **Статус:** ${testResult.isSuccess ? '✅ Успех' : '❌ Ошибка'}
- **Время:** ${testResult.duration}мс
- **Модель:** ${testResult.model}
${testResult.error ? `- **Ошибка:** ${testResult.error}` : ''}
${testResult.isSuccess ? `- **Длина ответа:** ${testResult.content.length} символов` : ''}
`,
    )
    .join('\n')}

## Анализ качества

${summary || 'Анализ недоступен'}

## Рекомендации

${successRate < 80 ? '⚠️ **Стабильность:** Промпт работает нестабильно. Рассмотрите упрощение или уточнение инструкций.' : '✅ **Стабильность:** Промпт работает стабильно.'}

${consistencyScore < 70 ? '⚠️ **Консистентность:** Ответы сильно различаются. Добавьте более четкие ограничения в промпт.' : '✅ **Консистентность:** Ответы предсказуемы и согласованы.'}

${averageDuration > 10000 ? '⚠️ **Производительность:** Медленные ответы. Рассмотрите сокращение сложности промпта.' : '✅ **Производительность:** Быстрые ответы.'}

---

*Параллельное тестирование выполнено через MCP инструмент с AI анализом*
`;
}
