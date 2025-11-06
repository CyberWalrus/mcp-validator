import type { VerificationCheckResult, VerifyInfoResult } from '../../model/config';

/** Комбинирует результаты 3 проверок в единый отчет */
export function combineVerificationResults(checks: VerificationCheckResult[]): VerifyInfoResult {
    const totalChecks = checks.length;
    if (totalChecks === 0) {
        return {
            checks: [],
            combinedReport: '# Результаты проверки информации\n\n❌ Нет данных для проверки',
            error: 'Нет данных для проверки',
            overallScore: 0,
            success: false,
            totalDuration: 0,
            totalTokensUsed: 0,
        };
    }

    const successfulChecks = checks.filter((check) => check.isSuccess);
    const totalDuration = checks.reduce((sum, check) => sum + check.duration, 0);
    const totalTokensUsed = checks.reduce((sum, check) => sum + check.tokensUsed, 0);

    const hasSuccessfulChecks = successfulChecks.length > 0;

    let combinedReport = '# Результаты проверки информации\n\n';

    if (!hasSuccessfulChecks) {
        combinedReport += '## ❌ Все проверки завершились с ошибками\n\n';
        checks.forEach((check) => {
            combinedReport += `### ${check.checkType}\n\n`;
            combinedReport += `**Статус:** ❌ Ошибка\n`;
            combinedReport += `**Ошибка:** ${check.error || 'Неизвестная ошибка'}\n\n`;
        });

        return {
            checks,
            combinedReport,
            error: 'Все проверки завершились с ошибками',
            overallScore: 0,
            success: false,
            totalDuration,
            totalTokensUsed,
        };
    }

    combinedReport += `## Общая статистика\n\n`;
    combinedReport += `- **Успешных проверок:** ${successfulChecks.length}/${totalChecks}\n`;
    combinedReport += `- **Общее время:** ${totalDuration}мс\n`;
    combinedReport += `- **Использовано токенов:** ${totalTokensUsed}\n\n`;

    combinedReport += `## Детальные результаты\n\n`;

    checks.forEach((check) => {
        combinedReport += `### ${check.checkType}\n\n`;
        combinedReport += `**Статус:** ${check.isSuccess ? '✅ Успех' : '❌ Ошибка'}\n`;
        combinedReport += `**Время:** ${check.duration}мс\n`;
        combinedReport += `**Токены:** ${check.tokensUsed}\n`;

        if (check.error) {
            combinedReport += `**Ошибка:** ${check.error}\n\n`;
        } else {
            combinedReport += `**Результат:**\n${check.content}\n\n`;
        }
    });

    const averageScore = totalChecks > 0 ? Math.round((successfulChecks.length / totalChecks) * 100) : 0;

    combinedReport += `## Общая оценка\n\n`;
    combinedReport += `**Оценка достоверности:** ${averageScore}/100\n\n`;

    if (averageScore >= 90) {
        combinedReport += `✅ **Высокая достоверность** - информация прошла все проверки успешно.\n`;
    } else if (averageScore >= 70) {
        combinedReport += `⚠️ **Средняя достоверность** - некоторые проверки требуют внимания.\n`;
    } else {
        combinedReport += `❌ **Низкая достоверность** - информация требует дополнительной проверки.\n`;
    }

    return {
        checks,
        combinedReport,
        overallScore: averageScore,
        success: true,
        totalDuration,
        totalTokensUsed,
    };
}
