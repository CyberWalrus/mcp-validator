import type { AgentConfig } from '../../agents/test-prompt-agent/types';

/** Глобальный кэш агентов для повторного использования */
let testPromptAgent: AgentConfig | null = null;

/** Очистка кэша агентов (для тестирования) */
export function clearTestPromptAgentCache(): void {
    testPromptAgent = null;
}

/** Получение текущего агента */
export function getTestPromptAgent(): AgentConfig | null {
    return testPromptAgent;
}

/** Установка агента */
export function setTestPromptAgent(agent: AgentConfig): void {
    testPromptAgent = agent;
}
