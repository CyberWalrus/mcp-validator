/** Парсит результат валидации от AI модели */
export function parseValidationResult(aiResponse: string): {
    issues: string[];
    success: boolean;
    metadata?: Record<string, unknown>;
} {
    const issues: string[] = [];
    let success = true;
    const metadata: Record<string, unknown> = {};

    metadata.fullResponse = aiResponse;

    const problemIndicators = [
        'ошибка',
        'error',
        'баг',
        'bug',
        'проблема',
        'problem',
        'уязвимость',
        'vulnerability',
        'недостаток',
        'issue',
        'предупреждение',
        'warning',
        'критично',
        'critical',
    ];

    const lines = aiResponse.toLowerCase().split('\n');
    let foundProblems = false;

    for (const line of lines) {
        for (const indicator of problemIndicators) {
            if (line.includes(indicator) && line.length > indicator.length + 10) {
                issues.push(line.trim());
                foundProblems = true;
                break;
            }
        }
    }

    // Ищем положительные индикаторы
    const positiveIndicators = [
        'отлично',
        'excellent',
        'хорошо',
        'good',
        'качественно',
        'quality',
        'соответствует',
        'complies',
        'правильно',
        'correct',
        'успешно',
        'success',
    ];

    let hasPositiveIndicators = false;
    for (const indicator of positiveIndicators) {
        if (aiResponse.toLowerCase().includes(indicator)) {
            hasPositiveIndicators = true;
            break;
        }
    }

    // Определяем успешность на основе найденных индикаторов
    if (foundProblems) {
        success = false;
    } else if (hasPositiveIndicators) {
        success = true;
    } else {
        // Если нет явных индикаторов, считаем успешным если нет критичных слов
        const criticalWords = ['fail', 'провал', 'неудача', 'нет', 'невозможно', 'cannot'];
        success = !criticalWords.some((word) => aiResponse.toLowerCase().includes(word));
    }

    // Извлекаем оценку если есть
    const scoreMatch = aiResponse.match(/(\d+)\/(\d+)|(\d+)%|score[:\s]*(\d+)/i);
    if (scoreMatch) {
        const score = parseInt(scoreMatch[1] || scoreMatch[3] || scoreMatch[4] || '0', 10);
        metadata.score = score;

        // Если оценка низкая, считаем неуспешным
        if (score < 70) {
            success = false;
            if (issues.length === 0) {
                issues.push(`Низкая оценка: ${score}`);
            }
        }
    }

    return {
        issues,
        metadata,
        success,
    };
}
