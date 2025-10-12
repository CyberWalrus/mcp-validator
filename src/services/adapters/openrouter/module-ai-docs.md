---
id: module-openrouter
documentation_type: 'ai-module-documentation'
ai_documentation_version: '2.0.0'
module_context:
    name: 'openrouter'
    path: 'src/services/adapters/openrouter'
    parent_package: '@morj/tools.mcp-validator'
    purpose: 'объединенный клиент OpenRouter API - результат рефакторинга v1.1.0'
target_models: ['claude', 'gpt', 'gemini', 'qwen']
size_limits:
    content: { max: 120 }
---

# 🧩 openrouter

<module_purpose>
Объединенный модуль для работы с OpenRouter API, созданный в результате рефакторинга openrouter-client + openrouter-factory. Предоставляет единый интерфейс для отправки запросов к различным AI моделям с поддержкой test/production режимов.
</module_purpose>

<public_api>
**Функции:**

- `makeOpenRouterRequest(params: OpenRouterParams): Promise<OpenRouterResponse>` - отправка запроса к AI модели
- `getOpenRouterClient(): Promise<OpenRouterClientFunction>` - получение клиента (test/prod режимы)
- `createOpenRouterClient(config: OpenRouterConfig): OpenRouterClientFunction` - создание клиента

**Типы:**

- `OpenRouterParams` - параметры запроса (модель, сообщения, температура)
- `OpenRouterResponse` - ответ от API с токенами и метаданными
- `OpenRouterConfig` - конфигурация клиента API
- `OpenRouterClientFunction` - тип функции клиента

**Константы:**

- `DEFAULT_MODEL` - модель по умолчанию (claude-3-sonnet)
- `REQUEST_TIMEOUT` - таймаут запросов (30 секунд)
- `SUPPORTED_MODELS` - список поддерживаемых моделей
  </public_api>

<usage_examples>
**Основное использование:**

```typescript
import { makeOpenRouterRequest, getOpenRouterClient } from './openrouter';

// Прямой запрос
const response = await makeOpenRouterRequest({
    model: 'claude-3-sonnet',
    messages: [{ role: 'user', content: 'Проанализируй этот код' }],
    temperature: 0.7
});

// Через фабрику клиентов
const client = await getOpenRouterClient();
const result = await client({ model: 'gpt-4', messages: [...] });
```

**Интеграция:**

```typescript
// Использование в validation workflow
const aiResponse = await makeOpenRouterRequest({
    model: 'claude-3-sonnet',
    messages: [{ role: 'system', content: validationPrompt }],
});
const validationResult = parseValidationResponse(aiResponse.text);
```

</usage_examples>

<module_structure>

```xml
<module_root name="openrouter">
  <main_files>
    <file name="index.ts" role="публичный API - объединенный клиент"/>
    <file name="openrouter-client-factory.ts" role="фабрика клиентов test/prod"/>
    <file name="types.ts" role="типы OpenRouter интеграции"/>
  </main_files>
  <internal_files>
    <!-- Модуль объединен, внутренних файлов нет -->
  </internal_files>
  <tests>
    <directory name="__tests__">
      <file name="index.test.ts" role="тесты основного клиента"/>
      <file name="openrouter-client-factory.test.ts" role="тесты фабрики"/>
    </directory>
  </tests>
</module_root>
```

</module_structure>

<dependencies>
**Node.js:** нет
**Внешние:** openai (для совместимости с OpenRouter API)
**Внутренние:** ../../../model/config, ../../../e2e/mocks/openrouter-test-client (в тестовом режиме)
</dependencies>

<notes>
**Особенности:** Результат рефакторинга - объединение client+factory, автоматическое переключение test/prod режимов, кеширование клиента
**Ограничения:** Требует OPENROUTER_API_KEY в окружении, ограничен моделями доступными в OpenRouter
</notes>
