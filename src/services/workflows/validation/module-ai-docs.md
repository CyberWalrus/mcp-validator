---
id: module-validation
documentation_type: 'ai-module-documentation'
ai_documentation_version: '2.0.0'
module_context:
    name: 'validation'
    path: 'src/services/workflows/validation'
    parent_package: '@morj/tools.mcp-validator'
    purpose: 'валидация кода и промптов через AI модели - основной модуль пакета'
target_models: ['claude', 'gpt', 'gemini', 'qwen']
size_limits:
    content: { max: 120 }
---

# 🧩 validation

<module_purpose>
Самодостаточный модуль для валидации различных типов контента через AI модели. Поддерживает 9 типов валидации: код, тесты, архитектура, безопасность, производительность, документация, промпты, задачи и кастомная валидация.
</module_purpose>

<public_api>
**Функции:**

- `validateCode(params: ValidationParams): Promise<ValidationResult>` - основная функция валидации
- `loadValidationPrompt(type: ValidationType): string` - загрузка промпта по типу
- `formatValidationResult(aiResponse: AIResponse): ValidationResult` - форматирование ответа AI
- `detectLanguageFromPath(filePath: string): string` - автоопределение языка по пути

**Типы:**

- `ValidationParams` - входные параметры валидации
- `ValidationResponse` - расширенный результат с метаданными
- `AIResponse` - ответ от AI модели

**Константы:**

- `VALIDATION_TYPES` - поддерживаемые типы валидации
- `DEFAULT_LANGUAGE_MAPPINGS` - маппинг расширений файлов на языки
  </public_api>

<usage_examples>
**Основное использование:**

```typescript
import { validateCode } from './validation';

const result = await validateCode({
    validationType: 'code',
    input: { type: 'file', data: 'src/user-service.ts' },
    language: 'typescript',
    context: 'Валидация сервиса пользователей',
});

console.log(`Успех: ${result.success}, Проблемы: ${result.issues.length}`);
```

**Интеграция:**

```typescript
// Использование в MCP pipeline
const validationResult = await handleMCPRequest('validate')
    .then(parseValidationParams)
    .then(validateCode)
    .then(formatMCPResponse);
```

</usage_examples>

<module_structure>

```xml
<module_root name="validation">
  <main_files>
    <file name="index.ts" role="публичный API модуля"/>
    <file name="validate-code.ts" role="основная логика валидации"/>
    <file name="types.ts" role="типы модуля"/>
  </main_files>
  <internal_files>
    <file name="helpers/load-validation-prompt.ts" role="загрузка промптов"/>
    <file name="helpers/format-validation-result.ts" role="форматирование результата"/>
    <file name="helpers/detect-language-from-path.ts" role="определение языка"/>
    <file name="helpers/get-content-from-input.ts" role="получение контента"/>
  </internal_files>
  <tests>
    <directory name="__tests__">
      <file name="validate-code.test.ts" role="тесты основной функции"/>
      <file name="helpers/*.test.ts" role="тесты вспомогательных функций"/>
    </directory>
  </tests>
</module_root>
```

</module_structure>

<dependencies>
**Node.js:** node:path
**Внешние:** zod
**Внутренние:** ../adapters/openrouter, ../adapters/file-reader, ../../../model/types/main
</dependencies>

<notes>
**Особенности:** Поддержка 9 типов валидации, промпты загружаются из markdown файлов, автоопределение языка по расширению
**Ограничения:** Timeout 30 секунд, максимальный размер файла 100KB, зависит от OpenRouter API
</notes>
