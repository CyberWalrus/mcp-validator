import type { ConsistencyAnalysis } from '../types';

/** Генерирует секцию рекомендаций */
export function generateRecommendationsSection(consistency: ConsistencyAnalysis): string {
    if (
        consistency.recommendations === null ||
        consistency.recommendations === undefined ||
        consistency.recommendations.length === 0
    ) {
        return '';
    }

    return `### 💡 Рекомендации по улучшению

${consistency.recommendations.map((recommendation, index) => `${index + 1}. ${recommendation}`).join('\n')}`;
}
