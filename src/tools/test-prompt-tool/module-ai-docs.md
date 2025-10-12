---
id: module-test-prompt-tool
documentation_type: 'ai-module-documentation'
ai_documentation_version: '2.0.0'
module_context:
    name: 'test-prompt-tool'
    path: 'src/tools/test-prompt-tool'
    parent_package: 'mcp-validator'
    purpose: 'MCP tool обертка для тестирования промптов на консистентность'
target_models: ['claude', 'gpt', 'gemini', 'qwen']
size_limits:
    content: { max: 120 }
---

# 🧩 test-prompt-tool

<module_purpose>
MCP tool обертка для тестирования промптов на консистентность AI ответов. Предоставляет интерфейс для параллельного тестирования промптов через MCP протокол и возвращает детальные отчеты о стабильности.
</module_purpose>

<public_api>
**Функции:**

- `handleTestPromptTool(params: TestPromptToolParams): Promise<TestPromptToolResult>` - обработка MCP запроса тестирования
- `testPromptTool(params: TestPromptToolParams): Promise<TestPromptToolResult>` - прямое тестирование
- `formatTestPromptResult(result: TestResult[]): string` - форматирование результата тестирования

**Типы:**

- `TestPromptToolParams` - параметры MCP tool (prompt, iterations, models, context)
- `TestPromptToolResult` - результат MCP tool с markdown отчетом
- `TestResult` - результат одного теста промпта
  </public_api>

<usage_examples>
**Основное использование:**

```typescript
import { handleTestPromptTool } from './test-prompt-tool';

const result = await handleTestPromptTool({
    prompt: 'Write unit tests for this function',
    iterations: 5,
    models: ['claude-3-sonnet', 'gpt-4'],
    context: 'Тестирование промпта для генерации тестов',
});
```

**Интеграция:**

```typescript
// MCP tool регистрация
const tools = [
    {
        name: 'test-prompt',
        description: 'Тестирование промптов на консистентность',
        inputSchema: testPromptToolSchema,
    },
];

// Обработка MCP запроса
const response = await handleTestPromptTool(request.params);
```

</usage_examples>

<module_structure>

```xml
<module name="test-prompt-tool">
    <facade name="index.ts" role="unit_facade" exports="handleTestPromptTool, testPromptTool, formatTestPromptResult"/>
    <file name="handle-test-prompt-tool.ts" role="function" purpose="обработка MCP запроса"/>
    <file name="format-test-prompt-result.ts" role="function" purpose="форматирование результата"/>
</module>
```

</module_structure>

<dependencies>
**Node.js:** нет
**Внешние:** @modelcontextprotocol/sdk
**Внутренние:** ../../services/workflows/testing, ../../services/adapters/error-handler
</dependencies>

<notes>
**Особенности:** MCP протокол интеграция, параллельное тестирование, markdown отчеты о консистентности
**Ограничения:** Только MCP интерфейс, зависит от testing workflow
</notes>
