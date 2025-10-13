import type { ConsistencyAnalysis } from '../types';

/** Генерирует секцию продвинутого AI анализа */
export function generateAIAnalysisSection(consistency: ConsistencyAnalysis): string {
    if (!consistency.hasAiAnalysis || !consistency.aiAnalysis) {
        return '';
    }

    return `
## 🤖 Продвинутый AI анализ

${consistency.aiAnalysis}
`;
}
