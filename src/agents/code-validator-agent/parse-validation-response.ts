import type { ParsedValidationResponse } from './types';

/** Парсит ответ AI и опционально извлекает score */
export function parseValidationResponse(responseText: string): ParsedValidationResponse {
    const scoreMatch = responseText.match(/Оценка.*?(\d+)\/100/i);
    const score = scoreMatch?.[1] ? parseInt(scoreMatch[1], 10) : undefined;

    return {
        issues: [],
        recommendations: responseText,
        score,
    };
}
