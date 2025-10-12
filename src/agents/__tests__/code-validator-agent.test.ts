import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { initializePromptCache as initPromptCache } from '../../lib/cache';
import type {
    CreateCodeValidatorAgent as CreateCodeValidatorAgentFn,
    ValidateCodeWithAgent as ValidateCodeWithAgentFn,
} from '../code-validator-agent/types';

// Мок OpenAI
vi.mock('openai', () => ({
    default: vi.fn().mockImplementation(() => ({
        chat: {
            completions: {
                create: vi.fn().mockResolvedValue({
                    choices: [
                        {
                            message: {
                                content: `
<validation_result>
<summary>
**Оценка:** 85/100
**Статус:** ✅ Production Ready
</summary>
<critical_issues>
- **[БЛОКИРУЮЩИЙ]** Нет критических проблем
</critical_issues>
</validation_result>
                                `,
                            },
                        },
                    ],
                }),
            },
        },
    })),
}));

describe('CodeValidatorAgent', () => {
    let agent: ReturnType<CreateCodeValidatorAgentFn>;
    let createCodeValidatorAgent: CreateCodeValidatorAgentFn;
    let validateCodeWithAgent: ValidateCodeWithAgentFn;
    let initializePromptCache: typeof initPromptCache;

    beforeEach(async () => {
        vi.resetModules();
        process.env.OPENROUTER_API_KEY = 'test-key';

        const { reloadAppConfig } = await import('../../model/config');
        await reloadAppConfig();

        const cacheModule = await import('../../lib/cache');
        const agentModule = await import('../code-validator-agent');

        initializePromptCache = cacheModule.initializePromptCache;
        createCodeValidatorAgent = agentModule.createCodeValidatorAgent;
        validateCodeWithAgent = agentModule.validateCodeWithAgent;

        initializePromptCache();
        agent = createCodeValidatorAgent();
    });

    it('должен создать агент с базовым промптом validate-code.md', () => {
        expect(agent).toBeDefined();
        expect(agent.instructions).toContain('Code Quality Validator');
        expect(agent.model).toBe('openai/gpt-oss-120b');
        expect(agent.openai).toBeDefined();
    });

    it('должен динамически загружать правильный промпт для типа prompts', async () => {
        const testInput = {
            input: {
                data: 'Test prompt content',
                type: 'content' as const,
            },
            language: 'markdown',
            validationType: 'prompts' as const,
        };

        const result = await validateCodeWithAgent(agent, testInput);

        // Проверяем что агент теперь использует промпт для валидации промптов
        expect(agent.instructions).toContain('AI Prompt Validator');
        expect(agent.instructions).toContain('validate-prompts');
        expect(result).toBeDefined();
        expect(result.type).toBe('prompts');
    });

    it('должен динамически загружать правильный промпт для типа code', async () => {
        const testInput = {
            input: {
                data: 'function test() { return true; }',
                type: 'content' as const,
            },
            language: 'typescript',
            validationType: 'code' as const,
        };

        const result = await validateCodeWithAgent(agent, testInput);

        // Проверяем что агент использует промпт для валидации кода
        expect(agent.instructions).toContain('Code Quality Validator');
        expect(result).toBeDefined();
        expect(result.type).toBe('code');
    });

    it('должен динамически загружать правильный промпт для типа tests', async () => {
        const testInput = {
            input: {
                data: 'describe("test", () => { it("should work", () => {}); });',
                type: 'content' as const,
            },
            language: 'typescript',
            validationType: 'tests' as const,
        };

        const result = await validateCodeWithAgent(agent, testInput);

        // Проверяем что агент использует промпт для валидации тестов
        expect(agent.instructions).toContain('validate-tests');
        expect(result).toBeDefined();
        expect(result.type).toBe('tests');
    });
});
