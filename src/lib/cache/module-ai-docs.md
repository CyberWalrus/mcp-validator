---
id: module-prompt-cache
documentation_type: 'ai-module-documentation'
ai_documentation_version: '2.0.0'
module_context:
    name: 'prompt-cache'
    path: 'src/lib/cache'
    parent_package: '@morj/tools.mcp-validator'
    purpose: 'кэширование markdown промптов и шаблонов ошибок для MCP инструментов и агентов'
target_models: ['claude', 'gpt', 'gemini', 'qwen']
size_limits:
    content: { max: 120 }
---

# 🧩 prompt-cache

<module_purpose>
Функциональная единица отвечает за загрузку markdown промптов из директории `prompts`, их кэширование в памяти процесса и безопасный
доступ для остальных компонентов MCP валидатора. Гарантирует, что инструменты и агенты получают актуальные шаблоны без повторного
чтения файловой системы при каждом запросе.
</module_purpose>

<public_api>
**Функции:**

- `initializePromptCache(): CacheInitResult` - очищает текущий кэш, считывает все доступные markdown файлы и формирует глобальную
  карту промптов
- `getPrompt(id: string): string` - возвращает содержимое ранее загруженного промпта или выбрасывает ошибку при отсутствии записи

**Типы:**

- `PromptCache` - in-memory карта с промптами по имени файла
- `PromptPaths` - вычисленные абсолютные пути к директориям с промптами разных категорий
- `CacheInitResult` - результат загрузки с количеством промптов и списком ошибок чтения
  </public_api>

<usage_examples>
**Основное использование:**

```typescript
import { initializePromptCache, getPrompt } from '../lib/cache/prompt-cache';

const { loaded } = initializePromptCache();
const validationPrompt = getPrompt('validate-code.md');
console.log(`Загружено промптов: ${loaded}`);
```

**Интеграция:**

```typescript
// Инициализация MCP сервера с подготовкой шаблонов сообщений
const cacheResult = initializePromptCache();
if (cacheResult.errors.length) {
    logger.warn(cacheResult.errors.join('\n'));
}

const prompt = getPrompt('test-prompt.md');
const response = await handleMCPRequest({ prompt });
```

</usage_examples>

<module_structure>

```xml
<module_root name="prompt-cache">
  <main_files>
    <file name="prompt-cache.ts" role="инициализация и публичный API кэша"/>
  </main_files>
  <internal_files>
    <file name="types.ts" role="типизация результатов и конфигурации путей"/>
  </internal_files>
  <tests>
    <directory name="__tests__">
      <file name="prompt-cache.test.ts" role="unit тесты загрузки и чтения промптов"/>
    </directory>
  </tests>
</module_root>
```

</module_structure>

<dependencies>
**Node.js:** node:fs, node:path, node:url
**Внешние:** отсутствуют
**Внутренние:** локальные типы `./types`, markdown файлы из `prompts`
</dependencies>

<notes>
**Особенности:** хранит промпты в памяти процесса, повторные вызовы `getPrompt` работают без чтения диска, ошибки чтения логируются в
тестах через console.error.
**Ограничения:** требуется вызов `initializePromptCache` до первого `getPrompt`, отсутствует автоматическое отслеживание изменений
файловой системы во время работы.
</notes>
