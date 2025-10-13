import type { ConsistencyAnalysis } from '../types';

/** Генерирует секцию продвинутого AI анализа */
export function generateAIAnalysisSection(consistency: ConsistencyAnalysis): string {
    if (
        consistency.hasAiAnalysis === false ||
        consistency.aiAnalysis === null ||
        consistency.aiAnalysis === undefined
    ) {
        return '';
    }

    return `
## 🤖 Продвинутый AI анализ

${consistency.aiAnalysis}
`;
}
