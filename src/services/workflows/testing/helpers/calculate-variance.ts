/** Вычисляет дисперсию массива чисел */
export function calculateVariance(values: number[], mean: number): number {
    if (values.length === 0) {
        return 0;
    }

    const squaredDiffs = values.map((value) => (value - mean) ** 2);

    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
}
