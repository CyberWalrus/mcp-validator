import type { TestIterationResult } from '../types';

/** Генерирует детальную таблицу результатов */
export function generateDetailedResults(results: TestIterationResult[]): string {
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
