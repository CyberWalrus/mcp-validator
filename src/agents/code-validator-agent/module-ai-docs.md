---
id: module-code-validator-agent
documentation_type: 'ai-module-documentation'
ai_documentation_version: '2.0.0'
module_context:
    name: 'code-validator-agent'
    path: 'src/agents/code-validator-agent'
    parent_package: 'mcp-validator'
    purpose: 'AI агент для валидации кода через OpenAI SDK'
target_models: ['claude', 'gpt', 'gemini', 'qwen']
size_limits:
    content: { max: 120 }
---

# 🧩 code-validator-agent

<module_purpose>
AI агент для валидации кода через OpenAI SDK. Создает и управляет OpenAI клиентом, выполняет валидацию кода с использованием AI моделей и возвращает структурированные результаты с оценками качества.
</module_purpose>

<public_api>
**Функции:**

- `createCodeValidatorAgent(): CodeValidatorAgent` - создание агента с OpenAI клиентом
- `validateCodeWithAgent(agent: CodeValidatorAgent, params: ValidationParams): Promise<ValidationResult>` - валидация через агента

**Типы:**

- `CodeValidatorAgent` - интерфейс агента валидации
- `ValidationParams` - параметры валидации (код, тип, контекст)
- `ValidationResult` - результат валидации с оценками и рекомендациями
  </public_api>

<usage_examples>
**Основное использование:**

```typescript
import { createCodeValidatorAgent, validateCodeWithAgent } from './code-validator-agent';

const agent = createCodeValidatorAgent();
const result = await validateCodeWithAgent(agent, {
    code: 'function add(a, b) { return a + b; }',
    validationType: 'code',
    language: 'typescript',
    context: 'Валидация функции сложения',
});
```

**Интеграция:**

```typescript
// Использование в validation workflow
const agent = createCodeValidatorAgent();
const validationResult = await validateCodeWithAgent(agent, {
    code: fileContent,
    validationType: 'code',
    language: detectLanguage(filePath),
    context: 'Валидация сервиса пользователей',
});
```

</usage_examples>

<module_structure>

```xml
<module name="code-validator-agent">
    <facade name="index.ts" role="unit_facade" exports="createCodeValidatorAgent, validateCodeWithAgent"/>
    <file name="create-code-validator-agent.ts" role="function" purpose="создание агента"/>
    <file name="validate-code-with-agent.ts" role="function" purpose="валидация через агента"/>
    <file name="types.ts" role="types" purpose="типы модульной единицы"/>
    <test name="__tests__/code-validator-agent.test.ts" role="unit_test" purpose="unit тесты"/>
</module>
```

</module_structure>

<dependencies>
**Node.js:** нет
**Внешние:** openai
**Внутренние:** ../../model/config, ../../services/adapters/openrouter
</dependencies>

<notes>
**Особенности:** Использует OpenAI SDK для прямого взаимодействия с AI моделями, структурированные результаты валидации
**Ограничения:** Требует OPENAI_API_KEY в окружении, зависит от доступности OpenAI API
</notes>
