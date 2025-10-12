---
id: module-validate-tool
documentation_type: 'ai-module-documentation'
ai_documentation_version: '2.0.0'
module_context:
    name: 'validate-tool'
    path: 'src/api/validate-tool'
    parent_package: '@morj/tools.mcp-validator'
    purpose: 'MCP инструмент validate - новый модуль рефакторинга v1.1.0'
target_models: ['claude', 'gpt', 'gemini', 'qwen']
size_limits:
    content: { max: 120 }
---

# 🧩 validate-tool

<module_purpose>
Самодостаточный модуль MCP инструмента validate, созданный в рамках рефакторинга для инкапсуляции логики валидации. Предоставляет тонкую прослойку между MCP протоколом и validation workflow для чистого разделения ответственности.
</module_purpose>

<public_api>
**Функции:**

- `handleValidateToolRequest(params: ValidationParams): Promise<ValidationResult>` - единственная публичная функция

**Типы:**

- Экспортирует ValidationParams из services/workflows/validation/types
- Экспортирует ValidationResult из model/types/main

**Константы:**

- Нет собственных констант (тонкая прослойка)
  </public_api>

<usage_examples>
**Основное использование:**

```typescript
import { handleValidateToolRequest } from './validate-tool';

// Использование в MCP сервере
const result = await handleValidateToolRequest({
    validationType: 'code',
    input: { type: 'file', data: 'src/utils.ts' },
    language: 'typescript',
    context: 'Валидация утилит',
});

console.log(`Валидация: ${result.success ? 'успешна' : 'с ошибками'}`);
console.log(`Проблемы: ${result.issues.length}`);
```

**Интеграция:**

```typescript
// Интеграция в MCP server pipeline
case 'validate':
    const validationResult = await handleValidateToolRequest(request.params);
    return formatMCPResponse(request.id, validationResult);
```

</usage_examples>

<module_structure>

```xml
<module_root name="validate-tool">
  <main_files>
    <file name="index.ts" role="единственная функция - тонкая прослойка"/>
  </main_files>
  <internal_files>
    <!-- Модуль простой, только API прослойка -->
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
**Внутренние:** ../../services/workflows/validation, ../../model/types/main
</dependencies>

<notes>
**Особенности:** Результат рефакторинга - выделение MCP логики в отдельный модуль, тонкая прослойка без бизнес-логики
**Ограничения:** Полностью зависит от services/workflows/validation модуля
</notes>
