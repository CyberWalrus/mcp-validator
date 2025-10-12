import { calculateVariance } from '../calculate-variance';

describe('calculateVariance', () => {
    it('должен возвращать 0 для пустого массива', () => {
        const result = calculateVariance([], 0);
        expect(result).toBe(0);
    });

    it('должен правильно вычислять дисперсию', () => {
        const values = [1, 2, 3, 4, 5];
        const mean = 3;
        const result = calculateVariance(values, mean);

        // Дисперсия для [1,2,3,4,5] относительно среднего 3 = ((1-3)^2 + (2-3)^2 + (3-3)^2 + (4-3)^2 + (5-3)^2) / 5 = (4+1+0+1+4)/5 = 2
        expect(result).toBe(2);
    });

    it('должен правильно работать с одним элементом', () => {
        const result = calculateVariance([5], 5);
        expect(result).toBe(0);
    });

    it('должен правильно работать с отрицательными числами', () => {
        const values = [-1, 0, 1];
        const mean = 0;
        const result = calculateVariance(values, mean);

        // ((−1−0)^2 + (0−0)^2 + (1−0)^2) / 3 = (1+0+1)/3 = 2/3
        expect(result).toBeCloseTo(2 / 3);
    });
});
