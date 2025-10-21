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

- `initializeAppConfig(env?: NodeJS.ProcessEnv): void` - инициализация конфигурации приложения из переменных окружения

**Константы:**

- `APP_CONFIG` - глобальная конфигурация приложения (инициализируется через initializeAppConfig)

**Типы:**

- `AppConfig` - основная конфигурация приложения
- `LoggingConfig` - конфигурация логирования
- `OpenRouterConfig` - конфигурация OpenRouter API
- `ValidationConfig` - конфигурация валидации

**Переменные окружения:**

- `API_KEY` - ключ OpenRouter API (обязательный)
- `API_PROVIDERS` - список провайдеров OpenRouter через запятую (опционально, например: Cerebras,OpenAI)
- `API_URL` - URL OpenRouter API (по умолчанию: <https://openrouter.ai/api/v1>)
  </public_api>

<usage_examples>
**Инициализация:**

```typescript
import { initializeAppConfig } from './model/config';

// Инициализация конфигурации в точке входа приложения
initializeAppConfig();
```

**Использование:**

```typescript
import { APP_CONFIG } from './model/config';

// Использование конфигурации после инициализации
const apiKey = APP_CONFIG.api.key;
const logLevel = APP_CONFIG.logging.level;
const modelName = APP_CONFIG.model.name;
const providers = APP_CONFIG.api.providers; // массив провайдеров или undefined
```

**Выбор провайдера:**

```bash
export API_PROVIDERS=Cerebras
export API_KEY=your-key
yarn start
```

**Несколько провайдеров (fallback):**

```bash
export API_PROVIDERS="Cerebras,OpenAI,Qwen"
export API_KEY=your-key
yarn start
```

</usage_examples>

<module_structure>

```xml
<module name="config">
    <facade name="index.ts" role="unit_facade" exports="APP_CONFIG, initializeAppConfig"/>
    <file name="initialize-app-config.ts" role="function" purpose="инициализация конфигурации"/>
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
**Особенности:** Типизированная конфигурация, Zod валидация с дефолтными значениями, глобальная константа APP_CONFIG, инициализация в точке входа
**Ограничения:** Только переменные окружения, требует вызова initializeAppConfig() перед использованием APP_CONFIG
</notes>
