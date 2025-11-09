---
id: module-verify-info-agent
documentation_type: 'ai-module-documentation'
ai_documentation_version: '2.0.0'
module_context:
    name: 'verify-info-agent'
    path: 'src/agents/verify-info-agent'
    parent_package: 'mcp-validator'
    purpose: 'AI агент для проверки информации через OpenAI SDK с 3 параллельными проверками'
target_models: ['claude', 'gpt', 'gemini', 'qwen']
size_limits:
    content: { max: 120 }
---

# 🧩 verify-info-agent

<module_purpose>
AI агент для проверки информации через OpenAI SDK. Выполняет 3 параллельные проверки информации с использованием AI моделей и комбинирует результаты в единый отчет.
</module_purpose>

<public_api>
**Функции:**

- `createVerifyInfoAgent(): VerifyInfoAgentResult` - создание агента с OpenAI клиентом
- `verifyInfoWithAgent(agent: AgentConfig, verifyInput: VerifyInfoInput): Promise<VerifyInfoResult>` - проверка информации через агента с 3 параллельными проверками

**Типы:**

- `AgentConfig` - конфигурация агента
- `VerifyInfoInput` - входные данные для проверки (текст или файл)
- `VerifyInfoResult` - результат проверки с 3 проверками и комбинированным отчетом
- `VerificationCheckResult` - результат одной проверки (check1, check2, check3)
</public_api>

<key_concepts>
**Параллельные проверки:**
- Выполняет 3 независимые проверки одновременно через Promise.all()
- Каждая проверка использует свой промпт (check1, check2, check3)
- Результаты комбинируются в единый отчет с общей оценкой

**Источники данных:**
- Поддерживает текст (content) и файлы (file)
- Автоматически читает файлы с указанной кодировкой
</key_concepts>

<usage_example>
```typescript
import { createVerifyInfoAgent, verifyInfoWithAgent } from './verify-info-agent';

const agent = createVerifyInfoAgent();
const result = await verifyInfoWithAgent(agent, {
    input: {
        type: 'content',
        data: 'Информация для проверки...',
    },
    context: 'Дополнительный контекст',
});

console.log(result.combinedReport);
console.log(result.overallScore);
```
</usage_example>





