---
id: module-test-prompt-agent
documentation_type: 'ai-module-documentation'
ai_documentation_version: '2.0.0'
module_context:
    name: 'test-prompt-agent'
    path: 'src/agents/test-prompt-agent'
    parent_package: 'mcp-validator'
    purpose: 'AI агент для тестирования промптов на консистентность'
target_models: ['claude', 'gpt', 'gemini', 'qwen']
size_limits:
    content: { max: 120 }
---

# 🧩 test-prompt-agent

<module_purpose>
AI агент для тестирования промптов на консистентность ответов. Создает агента для параллельного выполнения промптов, анализирует результаты и генерирует отчеты о стабильности AI ответов.
</module_purpose>

<public_api>
**Функции:**

- `createTestPromptAgent(): TestPromptAgent` - создание агента для тестирования
- `testPromptWithAgent(agent: TestPromptAgent, params: TestParams): Promise<TestResult[]>` - тестирование промпта
- `calculateConsistencyScore(results: TestResult[]): number` - расчет консистентности
- `generateTestSummary(results: TestResult[]): string` - генерация сводки тестов

**Типы:**

- `TestPromptAgent` - интерфейс агента тестирования
- `TestParams` - параметры тестирования (промпт, итерации, модели)
- `TestResult` - результат одного теста
  </public_api>

<usage_examples>
**Основное использование:**

```typescript
import { createTestPromptAgent, testPromptWithAgent } from './test-prompt-agent';

const agent = createTestPromptAgent();
const results = await testPromptWithAgent(agent, {
    prompt: 'Write unit tests for this function',
    iterations: 5,
    models: ['claude-3-sonnet', 'gpt-4'],
    context: 'Тестирование промпта для генерации тестов',
});
```

**Интеграция:**

```typescript
// Полный цикл тестирования промпта
const agent = createTestPromptAgent();
const testResults = await testPromptWithAgent(agent, params);
const consistencyScore = calculateConsistencyScore(testResults);
const summary = generateTestSummary(testResults);
```

</usage_examples>

<module_structure>

```xml
<module name="test-prompt-agent">
    <facade name="index.ts" role="unit_facade" exports="createTestPromptAgent, testPromptWithAgent, calculateConsistencyScore, generateTestSummary"/>
    <file name="create-test-prompt-agent.ts" role="function" purpose="создание агента"/>
    <file name="test-prompt-with-agent.ts" role="function" purpose="тестирование промпта"/>
    <file name="calculate-consistency-score.ts" role="function" purpose="расчет консистентности"/>
    <file name="generate-test-summary.ts" role="function" purpose="генерация сводки"/>
    <file name="types.ts" role="types" purpose="типы модульной единицы"/>
</module>
```

</module_structure>

<dependencies>
**Node.js:** нет
**Внешние:** openai
**Внутренние:** ../../model/config, ../../services/adapters/openrouter
</dependencies>

<notes>
**Особенности:** Параллельное выполнение тестов, статистический анализ консистентности, детальные отчеты
**Ограничения:** Требует OPENAI_API_KEY в окружении, ограничен доступными моделями
</notes>
