---
id: module-test-prompt-tool
documentation_type: 'ai-module-documentation'
ai_documentation_version: '2.0.0'
module_context:
    name: 'test-prompt-tool'
    path: 'src/api/test-prompt-tool'
    parent_package: '@morj/tools.mcp-validator'
    purpose: 'MCP инструмент test-prompt - новый модуль рефакторинга v1.1.0'
target_models: ['claude', 'gpt', 'gemini', 'qwen']
size_limits:
    content: { max: 120 }
---

# 🧩 test-prompt-tool

<module_purpose>
Самодостаточный модуль MCP инструмента test-prompt, созданный в рамках рефакторинга для инкапсуляции логики тестирования промптов. Предоставляет API для параллельного тестирования с суммарной статистикой.
</module_purpose>

<public_api>
**Функции:**

- `handleTestPromptToolRequest(params: TestPromptInput): Promise<TestPromptResult>` - единственная публичная функция

**Типы:**

- `TestPromptInput` - входные параметры (промпт, итерации, модели, контекст, таймаут)
- `TestPromptResult` - результат с массивом тестов и суммарной статистикой

**Константы:**

- Нет собственных констант (делегирует в testing workflow)
  </public_api>

<usage_examples>
**Основное использование:**

```typescript
import { handleTestPromptToolRequest } from './test-prompt-tool';

// Тестирование промпта с несколькими моделями
const result = await handleTestPromptToolRequest({
    prompt: 'Write unit tests for this TypeScript function',
    iterations: 5,
    models: ['claude-3-sonnet', 'gpt-4'],
    context: 'Тестирование промпта для генерации тестов',
    timeout: 30000,
});

console.log(`Выполнено ${result.results.length} тестов`);
console.log(`Успешно: ${result.summary.successCount}, Ошибок: ${result.summary.errorCount}`);
console.log(`Общее время: ${result.summary.totalDuration}ms`);
```

**Интеграция:**

```typescript
// Интеграция в MCP server pipeline
case 'test-prompt':
    const testResult = await handleTestPromptToolRequest(request.params);
    return formatMCPResponse(request.id, testResult);
```

</usage_examples>

<module_structure>

```xml
<module_root name="test-prompt-tool">
  <main_files>
    <file name="index.ts" role="API с бизнес-логикой суммарной статистики"/>
  </main_files>
  <internal_files>
    <!-- Модуль содержит логику агрегации результатов -->
  </internal_files>
  <tests>
    <directory name="__tests__">
      <file name="index.test.ts" role="интеграционные тесты MCP инструмента"/>
    </directory>
  </tests>
</module_root>
```

</module_structure>

<dependencies>
**Node.js:** нет
**Внешние:** нет
**Внутренние:** ../../services/workflows/testing, ../../model/types/main
</dependencies>

<notes>
**Особенности:** Результат рефакторинга - выделение MCP логики, агрегация статистики (успешные/неуспешные тесты, общее время)
**Ограничения:** Зависит от services/workflows/testing модуля, ограничения наследуются от testing workflow
</notes>
