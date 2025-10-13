import { ANOMALY_MULTIPLIERS, VARIANCE_THRESHOLDS } from '../consistency-analysis-constants';
import type { TestIterationResult } from '../types';

type StructureAnalysisResult = {
    anomalies: string[];
    patterns: string[];
    score: number;
};

/** Извлекает структуру из текста ответа */
function extractStructure(content: string): { codeBlocks: number; lists: number; sections: number } {
    const sections = (content.match(/^#{1,6}\s/gm) || []).length;
    const lists = (content.match(/^[\s]*[-*+]\s/gm) || []).length;
    const codeBlocks = (content.match(/```/g) || []).length / 2;

    return { codeBlocks, lists, sections };
}

/** Вычисляет среднюю структуру */
function calculateAverageStructure(structures: Array<{ codeBlocks: number; lists: number; sections: number }>) {
    const total = structures.reduce(
        (acc, structure) => ({
            codeBlocks: acc.codeBlocks + structure.codeBlocks,
            lists: acc.lists + structure.lists,
            sections: acc.sections + structure.sections,
        }),
        { codeBlocks: 0, lists: 0, sections: 0 },
    );

    return {
        codeBlocks: total.codeBlocks / structures.length,
        lists: total.lists / structures.length,
        sections: total.sections / structures.length,
    };
}

/** Вычисляет дисперсию структуры */
function calculateStructureVariance(
    structures: Array<{ codeBlocks: number; lists: number; sections: number }>,
    avgStructure: { codeBlocks: number; lists: number; sections: number },
): number {
    const variances = structures.map((structure) => {
        const sectionDiff = (structure.sections - avgStructure.sections) ** 2;
        const listDiff = (structure.lists - avgStructure.lists) ** 2;
        const codeBlockDiff = (structure.codeBlocks - avgStructure.codeBlocks) ** 2;

        return sectionDiff + listDiff + codeBlockDiff;
    });

    return variances.reduce((sum, variance) => sum + variance, 0) / variances.length;
}

/** Анализирует консистентность структуры ответов */
export function analyzeStructureConsistency(results: TestIterationResult[]): StructureAnalysisResult {
    const structures = results.map((r) => extractStructure(r.content));
    const avgStructure = calculateAverageStructure(structures);
    const variance = calculateStructureVariance(structures, avgStructure);

    const score = Math.max(0, Math.min(100, 100 - variance * 100));

    const patterns: string[] = [];
    const anomalies: string[] = [];

    if (variance < VARIANCE_THRESHOLDS.LOW) {
        patterns.push('Очень стабильная структура ответов');
    } else if (variance < VARIANCE_THRESHOLDS.MEDIUM) {
        patterns.push('Умеренная вариативность структуры ответов');
    } else if (variance < VARIANCE_THRESHOLDS.HIGH) {
        patterns.push('Высокая вариативность структуры ответов');
    } else {
        patterns.push('Критически высокая вариативность структуры ответов');
        anomalies.push('Структура ответов сильно варьируется между итерациями');
    }

    structures.forEach((structure, index) => {
        const diff = Math.abs(structure.sections - avgStructure.sections);
        if (diff > avgStructure.sections * ANOMALY_MULTIPLIERS.STRUCTURE) {
            anomalies.push(`Итерация ${index + 1}: аномальное количество секций (${structure.sections})`);
        }
    });

    return { anomalies, patterns, score };
}
