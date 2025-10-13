import type { ParsedValidationResponse } from './types';

/** Парсит ответ от OpenAI и извлекает score и issues */
export function parseValidationResponse(responseText: string): ParsedValidationResponse {
    const scoreMatch = responseText.match(/Оценка.*?(\d+)\/100/i);
    const score = scoreMatch !== null && scoreMatch[1] !== undefined ? parseInt(scoreMatch[1], 10) : 75;

    const issues: string[] = [];
    const criticalSection = responseText.match(/critical_issues>(.*?)<\/critical_issues>/s);

    if (criticalSection !== null && criticalSection[1] !== undefined) {
        const criticalIssues = criticalSection[1].match(/- \*\*(.*?)\*\*/g);
        if (criticalIssues !== null) {
            issues.push(...criticalIssues.map((issue: string) => issue.replace(/- \*\*|\*\*/g, '')));
        }
    }

    return {
        issues,
        recommendations: responseText,
        score,
    };
}
