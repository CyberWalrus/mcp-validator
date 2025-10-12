---
id: module-config
documentation_type: 'ai-module-documentation'
ai_documentation_version: '2.0.0'
module_context:
    name: 'config'
    path: 'src/model/config'
    parent_package: 'mcp-validator'
    purpose: 'конфигурация приложения через переменные окружения'
target_models: ['claude', 'gpt', 'gemini', 'qwen']
size_limits:
    content: { max: 120 }
---

# 🧩 config

<module_purpose>
Модуль конфигурации приложения для загрузки и валидации настроек через переменные окружения. Предоставляет типизированную конфигурацию для всех компонентов MCP валидатора с поддержкой Zod схем валидации.
</module_purpose>

<public_api>
**Функции:**

- `createAppConfig(): AppConfig` - создание конфигурации приложения
- `reloadAppConfig(): AppConfig` - перезагрузка конфигурации
- `getAppConfigError(): string | null` - получение ошибки конфигурации

**Константы:**

- `APP_CONFIG` - кэшированная конфигурация приложения
- `CACHED_CONFIG` - состояние кэша конфигурации
- `CONFIG_STATE` - состояние конфигурации

**Типы:**

- `AppConfig` - основная конфигурация приложения
- `LoggingConfig` - конфигурация логирования
- `OpenRouterConfig` - конфигурация OpenRouter API
- `ValidationConfig` - конфигурация валидации
  </public_api>

<usage_examples>
**Основное использование:**

```typescript
import { APP_CONFIG } from './config';

// Использование конфигурации
const openrouterKey = APP_CONFIG.openrouter.apiKey;
const logLevel = APP_CONFIG.logging.level;
```

**Интеграция:**

```typescript
// Создание конфигурации в начале приложения
import { createAppConfig } from './model/config';

const config = createAppConfig();
if (config.errors.length > 0) {
    console.error('Ошибки конфигурации:', config.errors);
    process.exit(1);
}
```

</usage_examples>

<module_structure>

```xml
<module name="config">
    <facade name="index.ts" role="unit_facade" exports="APP_CONFIG, createAppConfig, reloadAppConfig, getAppConfigError"/>
    <file name="create-app-config.ts" role="function" purpose="создание конфигурации"/>
    <file name="get-app-config-error.ts" role="function" purpose="получение ошибок"/>
    <file name="reload-app-config.ts" role="function" purpose="перезагрузка"/>
    <file name="config-constants.ts" role="config" purpose="константы конфигурации"/>
    <file name="constants.ts" role="config" purpose="базовые константы"/>
    <file name="schemas.ts" role="schemas" purpose="Zod схемы валидации"/>
    <file name="types.ts" role="types" purpose="типы конфигурации"/>
    <test name="__tests__/env-config.test.ts" role="unit_test" purpose="тесты конфигурации"/>
</module>
```

</module_structure>

<dependencies>
**Node.js:** node:process (для переменных окружения)
**Внешние:** zod
**Внутренние:** нет (базовый модуль конфигурации)
</dependencies>

<notes>
**Особенности:** Типизированная конфигурация, Zod валидация, кэширование, поддержка env переменных
**Ограничения:** Только переменные окружения, требует корректных env значений
</notes>
