import type { TestIterationResult } from '../../model/config';

/** Генерация краткого отчета о тестировании */
export function generateTestSummary(results: TestIterationResult[], consistencyScore: number): string {
    const successful = results.filter((r: TestIterationResult) => r.isSuccess).length;
    const total = results.length;
    const successRate = Math.round((successful / total) * 100);

    let qualityStatus: string;
    if (successRate >= 90) {
        qualityStatus = '✅ **Отлично** - промпт работает стабильно';
    } else if (successRate >= 70) {
        qualityStatus = '⚠️ **Хорошо** - есть небольшие проблемы';
    } else {
        qualityStatus = '❌ **Требует доработки** - много неудачных попыток';
    }

    let consistencyStatus: string;
    if (consistencyScore >= 80) {
        consistencyStatus = '✅ **Высокая консистентность** - ответы предсказуемы';
    } else if (consistencyScore >= 60) {
        consistencyStatus = '⚠️ **Средняя консистентность** - есть вариативность';
    } else {
        consistencyStatus = '❌ **Низкая консистентность** - ответы сильно различаются';
    }

    return `
# Результаты тестирования промпта

## Общая статистика
- **Успешных итераций:** ${successful}/${total} (${successRate}%)
- **Консистентность ответов:** ${consistencyScore}/100
- **Среднее время ответа:** ${Math.round(results.reduce((sum, r) => sum + r.duration, 0) / results.length)}мс

## Оценка качества
${qualityStatus}

${consistencyStatus}
`.trim();
}
