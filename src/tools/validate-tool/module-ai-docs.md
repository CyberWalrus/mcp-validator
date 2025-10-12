---
id: module-validate-tool
documentation_type: 'ai-module-documentation'
ai_documentation_version: '2.0.0'
module_context:
    name: 'validate-tool'
    path: 'src/tools/validate-tool'
    parent_package: '@morj/tools.mcp-validator'
    purpose: 'MCP tool обертка для валидации кода и контента'
target_models: ['claude', 'gpt', 'gemini', 'qwen']
size_limits:
    content: { max: 120 }
---

# 🧩 validate-tool

<module_purpose>
MCP tool обертка для валидации различных типов контента. Предоставляет интерфейс для интеграции с Cursor IDE через MCP протокол, обрабатывает запросы валидации и возвращает структурированные результаты.
</module_purpose>

<public_api>
**Функции:**

- `handleValidateTool(params: ValidateToolParams): Promise<ValidateToolResult>` - обработка MCP запроса валидации
- `validateTool(params: ValidateToolParams): Promise<ValidateToolResult>` - прямая валидация
- `formatSuccessfulValidation(result: ValidationResult): string` - форматирование успешного результата

**Типы:**

- `ValidateToolParams` - параметры MCP tool (validationType, input, context)
- `ValidateToolResult` - результат MCP tool с markdown форматированием
- `ValidationResult` - результат валидации от workflow
  </public_api>

<usage_examples>
**Основное использование:**

```typescript
import { handleValidateTool } from './validate-tool';

const result = await handleValidateTool({
    validationType: 'code',
    input: { type: 'file', data: 'src/user-service.ts' },
    context: 'Валидация сервиса пользователей',
});
```

**Интеграция:**

```typescript
// MCP tool регистрация
const tools = [
    {
        name: 'validate',
        description: 'Валидация кода и контента',
        inputSchema: validateToolSchema,
    },
];

// Обработка MCP запроса
const response = await handleValidateTool(request.params);
```

</usage_examples>

<module_structure>

```xml
<module name="validate-tool">
    <facade name="index.ts" role="unit_facade" exports="handleValidateTool, validateTool, formatSuccessfulValidation"/>
    <file name="handle-validate-tool.ts" role="function" purpose="обработка MCP запроса"/>
    <file name="format-successful-validation.ts" role="function" purpose="форматирование результата"/>
</module>
```

</module_structure>

<dependencies>
**Node.js:** нет
**Внешние:** @modelcontextprotocol/sdk
**Внутренние:** ../../services/workflows/validation, ../../services/adapters/error-handler
</dependencies>

<notes>
**Особенности:** MCP протокол интеграция, markdown форматирование результатов, обработка ошибок
**Ограничения:** Только MCP интерфейс, зависит от validation workflow
</notes>
