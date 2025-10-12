---
id: module-error-handler
documentation_type: 'ai-module-documentation'
ai_documentation_version: '2.0.0'
module_context:
    name: 'error-handler'
    path: 'src/services/adapters/error-handler'
    parent_package: 'mcp-validator'
    purpose: 'упрощенная обработка ошибок - результат рефакторинга error-formatting'
target_models: ['claude', 'gpt', 'gemini', 'qwen']
size_limits:
    content: { max: 120 }
---

# 🧩 error-handler

<module_purpose>
Упрощенный модуль для обработки и форматирования ошибок в markdown формат, созданный в результате рефакторинга error-formatting. Убраны сложные вложенные lib/model/services структуры, оставлена только необходимая функциональность.
</module_purpose>

<public_api>
**Функции:**

- `renderErrorResponse(error: unknown, context?: string): string` - основная функция рендеринга ошибок
- `formatErrorContext(errorData: ErrorData, templates: ErrorTemplates): string` - форматирование контекста
- `loadErrorTemplate(errorType: string): string` - загрузка шаблонов ошибок
- `detectErrorType(error: unknown): string` - автоопределение типа ошибки

**Helpers:**

- `collectSystemInfo(): SystemInfo` - сбор информации о системе
- `renderTemplate(template: string, variables: TemplateVariables): string` - рендеринг шаблонов

**Типы:**

- `ErrorData` - структурированные данные ошибки
- `ErrorTemplates` - шаблоны для разных типов ошибок
- `SystemInfo` - информация о системе (Node.js версия, OS, память)
- `TemplateVariables` - переменные для подстановки в шаблоны
  </public_api>

<usage_examples>
**Основное использование:**

```typescript
import { renderErrorResponse } from './error-handler';

try {
    await someOperation();
} catch (error) {
    const errorMarkdown = renderErrorResponse(error, 'Валидация кода');
    console.error(errorMarkdown);
    return { success: false, error: errorMarkdown };
}
```

**Интеграция:**

```typescript
// Использование в MCP pipeline
const mcpErrorResponse = await handleMCPRequest(request).catch((error) =>
    createErrorResponse(request.id, renderErrorResponse(error, 'MCP обработка')),
);
```

</usage_examples>

<module_structure>

```xml
<module_root name="error-handler">
  <main_files>
    <file name="index.ts" role="публичный API модуля"/>
    <file name="render-error-response.ts" role="основная функция рендеринга"/>
    <file name="format-error-context.ts" role="форматирование контекста"/>
    <file name="load-error-template.ts" role="загрузка шаблонов"/>
  </main_files>
  <internal_files>
    <file name="helpers/error-type-detector.ts" role="определение типа ошибки"/>
    <file name="helpers/system-info-collector.ts" role="сбор системной информации"/>
    <file name="helpers/template-renderer.ts" role="рендеринг шаблонов"/>
    <file name="types.ts" role="типы модуля"/>
    <file name="constants.ts" role="константы шаблонов"/>
  </internal_files>
  <tests>
    <directory name="__tests__">
      <file name="render-error-response.test.ts" role="тесты основной функции"/>
      <file name="format-error-context.test.ts" role="тесты форматирования"/>
      <file name="helpers/__tests__/*.test.ts" role="тесты helpers"/>
    </directory>
  </tests>
</module_root>
```

</module_structure>

<dependencies>
**Node.js:** node:os, node:process (для системной информации)
**Внешние:** нет
**Внутренние:** ../../../lib/helpers/resource-resolver (для путей к шаблонам), ../../../lib/helpers/logger
</dependencies>

<notes>
**Особенности:** Результат рефакторинга - упрощена структура, убраны вложенные lib/model/services папки, markdown шаблоны из prompts/errors/
**Ограничения:** Зависит от наличия error шаблонов в prompts/errors/, ограничена поддерживаемыми типами ошибок
</notes>
