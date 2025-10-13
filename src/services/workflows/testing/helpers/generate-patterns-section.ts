import type { ConsistencyAnalysis } from '../types';

/** Генерирует секцию выявленных паттернов */
export function generatePatternsSection(consistency: ConsistencyAnalysis): string {
    if (consistency.patterns === null || consistency.patterns === undefined || consistency.patterns.length === 0) {
        return '';
    }

    return `### ✅ Выявленные паттерны

${consistency.patterns.map((pattern) => `- ${pattern}`).join('\n')}`;
}
