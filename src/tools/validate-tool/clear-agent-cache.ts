import type { AgentConfig } from '../../agents/code-validator-agent/types';

/** Глобальный кэш агентов для повторного использования */
let codeValidatorAgent: AgentConfig | null = null;

/** Очистка кэша агентов (для тестирования) */
export function clearAgentCache(): void {
    codeValidatorAgent = null;
}

/** Получение текущего агента */
export function getCodeValidatorAgent(): AgentConfig | null {
    return codeValidatorAgent;
}

/** Установка агента */
export function setCodeValidatorAgent(agent: AgentConfig): void {
    codeValidatorAgent = agent;
}
