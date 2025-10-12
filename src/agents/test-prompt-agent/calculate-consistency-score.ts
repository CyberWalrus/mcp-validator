/** Вычисление индекса консистентности между ответами */
export function calculateConsistencyScore(contents: string[]): number {
    if (contents.length < 2) {
        return 100;
    }
    if (contents.length === 0 || contents[0] === '') {
        return 0;
    }

    const lengths = contents.map((c) => c.length);
    const avgLength = lengths.reduce((sum, len) => sum + len, 0) / lengths.length;

    const lengthVariance = lengths.reduce((sum, len) => sum + (len - avgLength) ** 2, 0) / lengths.length;
    const lengthConsistency = Math.max(0, 100 - (Math.sqrt(lengthVariance) / avgLength) * 100);

    const firstWords = contents[0].toLowerCase().split(/\s+/).slice(0, 10);
    const keywordConsistency =
        contents.slice(1).reduce((score, content) => {
            const words = content.toLowerCase().split(/\s+/).slice(0, 10);
            const commonWords = firstWords.filter((word) => words.includes(word)).length;

            return score + (commonWords / firstWords.length) * 100;
        }, 0) /
        (contents.length - 1);

    return Math.round(lengthConsistency * 0.3 + keywordConsistency * 0.7);
}
