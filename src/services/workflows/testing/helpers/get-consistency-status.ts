/** Определяет статус консистентности на основе оценки */
export function getConsistencyStatus(score: number): string {
    if (score >= 80) {
        return '✅ **Высокая консистентность**';
    }
    if (score >= 60) {
        return '⚠️ **Средняя консистентность**';
    }
    if (score >= 40) {
        return '❌ **Низкая консистентность**';
    }

    return '🚨 **Критически низкая консистентность**';
}
