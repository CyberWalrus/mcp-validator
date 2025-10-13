import type { TestIterationResult } from '../types';

/** Генерирует статистику по времени выполнения */
export function generateTimeStatistics(results: TestIterationResult[]): string {
    const times = results.map((r) => r.responseTime);
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    const avgTime = Math.round(times.reduce((a, b) => a + b, 0) / times.length);

    const sortedTimes = [...times].sort((a, b) => a - b);
    const medianTime =
        sortedTimes.length % 2 === 0
            ? Math.round(
                  ((sortedTimes[sortedTimes.length / 2 - 1] || 0) + (sortedTimes[sortedTimes.length / 2] || 0)) / 2,
              )
            : sortedTimes[Math.floor(sortedTimes.length / 2)] || 0;

    const fastRequests = times.filter((time) => time < avgTime * 0.7).length;
    const slowRequests = times.filter((time) => time > avgTime * 1.5).length;

    return `**Минимальное время:** ${minTime}мс  
**Максимальное время:** ${maxTime}мс  
**Среднее время:** ${avgTime}мс  
**Медианное время:** ${medianTime}мс  

**Распределение:**
- Быстрые запросы (< ${Math.round(avgTime * 0.7)}мс): ${fastRequests}
- Обычные запросы: ${times.length - fastRequests - slowRequests}
- Медленные запросы (> ${Math.round(avgTime * 1.5)}мс): ${slowRequests}`;
}
