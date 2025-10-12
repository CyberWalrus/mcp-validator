---
id: module-resource-resolver
documentation_type: 'ai-module-documentation'
ai_documentation_version: '2.0.0'
module_context:
    name: 'resource-resolver'
    path: 'src/lib/helpers/resource-resolver'
    parent_package: '@morj/tools.mcp-validator'
    purpose: 'резолвер путей к ресурсам пакета в разных окружениях'
target_models: ['claude', 'gpt', 'gemini', 'qwen']
size_limits:
    content: { max: 120 }
---

# 🧩 resource-resolver

<module_purpose>
Самодостаточный модуль для корректного разрешения путей к ресурсам пакета (промпты, шаблоны ошибок, package.json) в различных окружениях: разработка, тестирование и production с ESM модульной структурой.
</module_purpose>

<public_api>
**Функции:**

- `getPackageResourceResolver(): ResourceResolver` - получение resolver для пакета
- `resolvePromptPath(type: ValidationType): string` - путь к промпту валидации
- `resolveErrorTemplatePath(errorType: string): string` - путь к шаблону ошибки
- `resolvePackageJsonPath(): string` - путь к package.json файлу

**Интерфейс ResourceResolver:**

- `getPackageRoot(): string` - корневая директория пакета
- `resolveResource(relativePath: string): string` - абсолютный путь к ресурсу
- `validateResourceExists(path: string): boolean` - проверка существования ресурса

**Типы:**

- `ResourceResolver` - интерфейс resolver
- `ValidationType` - типы валидации для промптов
- `ResourcePaths` - структура путей к ресурсам
  </public_api>

<usage_examples>
**Основное использование:**

```typescript
import { getPackageResourceResolver } from './resource-resolver';

const resolver = getPackageResourceResolver();

// Получение пути к промпту
const promptPath = resolver.resolvePromptPath('code');
const prompt = readFileSync(promptPath, 'utf8');

// Получение пути к шаблону ошибки
const errorTemplatePath = resolver.resolveErrorTemplatePath('validation-error');
const template = readFileSync(errorTemplatePath, 'utf8');
```

**Интеграция:**

```typescript
// Использование в validation для загрузки промптов
const resolver = getPackageResourceResolver();
const promptPath = resolver.resolvePromptPath(validationType);
const promptTemplate = await readFileContent({ type: 'file', data: promptPath });
```

</usage_examples>

<module_structure>

```xml
<module_root name="resource-resolver">
  <main_files>
    <file name="index.ts" role="публичный API модуля"/>
    <file name="package-resource-resolver.ts" role="основная реализация resolver"/>
    <file name="types.ts" role="типы модуля"/>
  </main_files>
  <internal_files>
    <!-- Модуль простой, внутренних файлов нет -->
  </internal_files>
  <tests>
    <directory name="__tests__">
      <file name="package-resource-resolver.test.ts" role="тесты основной функциональности"/>
    </directory>
  </tests>
</module_root>
```

</module_structure>

<dependencies>
**Node.js:** node:path, node:url (для import.meta.url), node:fs (для проверки существования)
**Внешние:** нет
**Внутренние:** нет (базовый утилитарный модуль)
</dependencies>

<notes>
**Особенности:** Работа с ESM import.meta.url, динамическое определение корня пакета, поддержка разных окружений
**Ограничения:** Только для файлов внутри пакета, зависит от правильной структуры пакета, ESM only
</notes>
