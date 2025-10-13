import type { TestIterationResult } from '../types';

/** Генерирует детальную таблицу результатов */
export function generateDetailedResults(results: TestIterationResult[]): string {
    const tableHeader = `| Итерация | Статус | Время (мс) | Модель | Детали |
|----------|--------|------------|--------|--------|`;

    const tableRows = results
        .map((result) => {
            const status = result.isSuccess ? '✅' : '❌';
            const details = result.isSuccess
                ? `${result.content?.length || 0} символов`
                : `${result.error?.substring(0, 50)}...` || 'Неизвестная ошибка';

            return `| ${result.iteration} | ${status} | ${result.duration} | ${result.model || 'N/A'} | ${details} |`;
        })
        .join('\n');

    return `${tableHeader}\n${tableRows}`;
}
