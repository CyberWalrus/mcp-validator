import type { VerificationCheckResult, VerifyInfoInput, VerifyInfoResult } from '../../model/config';
import { fetchOpenAIForVerification } from './call-openai-for-verification';
import { combineVerificationResults } from './combine-verification-results';
import { formatVerificationPrompt } from './format-verification-prompt';
import { getVerificationContent } from './get-verification-content';
import type { AgentConfig } from './types';

/** Результат проверки с метаданными */
type CheckResultWithMetadata = {
    check: VerificationCheckResult;
    provider?: string;
    totalCost?: string;
};

/** Выполняет одну проверку информации указанного типа */
async function performSingleCheck(
    agent: AgentConfig,
    content: string,
    verifyInput: VerifyInfoInput,
    checkType: 'check1' | 'check2' | 'check3',
): Promise<CheckResultWithMetadata> {
    const startTime = Date.now();
    const verificationPrompt = formatVerificationPrompt(content, verifyInput, checkType);

    try {
        const { responseContent, tokensUsed, provider, totalCost } = await fetchOpenAIForVerification(
            agent,
            verificationPrompt,
        );

        if (responseContent === '') {
            return {
                check: {
                    checkType,
                    content: '',
                    duration: Date.now() - startTime,
                    error: 'Не удалось получить результат проверки от агента',
                    isSuccess: false,
                    tokensUsed: 0,
                },
            };
        }

        const check: VerificationCheckResult = {
            checkType,
            content: responseContent.trim(),
            duration: Date.now() - startTime,
            isSuccess: true,
            tokensUsed,
        };

        return {
            check,
            ...(provider ? { provider } : {}),
            ...(totalCost ? { totalCost } : {}),
        };
    } catch (err: unknown) {
        return {
            check: {
                checkType,
                content: '',
                duration: Date.now() - startTime,
                error: err instanceof Error ? err.message : String(err),
                isSuccess: false,
                tokensUsed: 0,
            },
        };
    }
}

/** Проверка информации через VerifyInfoAgent с 3 параллельными проверками */
export async function verifyInfoWithAgent(agent: AgentConfig, verifyInput: VerifyInfoInput): Promise<VerifyInfoResult> {
    try {
        const contentResult = await getVerificationContent(verifyInput);

        if (contentResult.success === false) {
            return {
                checks: [],
                combinedReport: `# Ошибка получения контента\n\n${contentResult.error}`,
                error: contentResult.error,
                success: false,
                totalDuration: 0,
                totalTokensUsed: 0,
            };
        }

        const checkTypes: Array<'check1' | 'check2' | 'check3'> = ['check1', 'check2', 'check3'];

        const checkPromises = checkTypes.map((checkType) =>
            performSingleCheck(agent, contentResult.content, verifyInput, checkType),
        );

        const checkResults = await Promise.all(checkPromises);

        const checks = checkResults.map((result) => result.check);

        const metadata: Record<string, unknown> = {};

        const providers = new Set<string>();
        const totalCosts = new Set<string>();

        checkResults.forEach((result) => {
            if (result.provider) {
                providers.add(result.provider);
            }
            if (result.totalCost) {
                totalCosts.add(result.totalCost);
            }
        });

        if (providers.size > 0) {
            metadata.provider = Array.from(providers).join(', ');
        }
        if (totalCosts.size > 0) {
            metadata.totalCost = Array.from(totalCosts).join(', ');
        }

        const result = combineVerificationResults(checks);

        return {
            ...result,
            ...(Object.keys(metadata).length > 0 ? { metadata } : {}),
        };
    } catch (err: unknown) {
        return {
            checks: [],
            combinedReport: `# Критическая ошибка проверки информации\n\n${err instanceof Error ? err.message : String(err)}`,
            error: err instanceof Error ? err.message : String(err),
            success: false,
            totalDuration: 0,
            totalTokensUsed: 0,
        };
    }
}
