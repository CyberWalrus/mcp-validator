import type { VerifyInfoResult } from '../../model/config';

/** Форматирование результата проверки информации в markdown */
export function formatVerifyInfoResult(result: VerifyInfoResult): string {
    return result.combinedReport;
}
