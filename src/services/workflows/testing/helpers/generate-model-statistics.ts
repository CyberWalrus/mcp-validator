import type { TestIterationResult } from '../types';

/** Генерирует статистику по моделям */
export function generateModelStatistics(results: TestIterationResult[]): string {
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
