/** Парсит результат валидации от AI модели и возвращает объект с ошибками и статусом */
export function parseValidationResult(aiResponse: string): {
    issues: string[];
    success: boolean;
    metadata?: Record<string, unknown>;
} {
    const issues: string[] = [];
    let isSuccess = true;
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
    let hasFoundProblems = false;

    for (const line of lines) {
        for (const indicator of problemIndicators) {
            if (line.includes(indicator) && line.length > indicator.length + 10) {
                issues.push(line.trim());
                hasFoundProblems = true;
                break;
            }
        }
    }

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

    if (hasFoundProblems) {
        isSuccess = false;
    } else if (hasPositiveIndicators) {
        isSuccess = true;
    } else {
        const criticalWords = ['fail', 'провал', 'неудача', 'нет', 'невозможно', 'cannot'];
        isSuccess = !criticalWords.some((word) => aiResponse.toLowerCase().includes(word));
    }

    const scoreMatch = aiResponse.match(/(\d+)\/(\d+)|(\d+)%|score[:\s]*(\d+)/i);
    if (scoreMatch) {
        const score = parseInt(scoreMatch[1] || scoreMatch[3] || scoreMatch[4] || '0', 10);
        metadata.score = score;

        if (score < 70) {
            isSuccess = false;
            if (issues.length === 0) {
                issues.push(`Низкая оценка: ${score}`);
            }
        }
    }

    return {
        issues,
        metadata,
        success: isSuccess,
    };
}
