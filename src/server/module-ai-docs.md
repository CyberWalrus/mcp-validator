---
id: module-server
documentation_type: 'ai-module-documentation'
ai_documentation_version: '2.0.0'
module_context:
    name: 'server'
    path: 'src/server'
    parent_package: 'mcp-validator'
    purpose: 'MCP сервер инициализация и graceful shutdown'
target_models: ['claude', 'gpt', 'gemini', 'qwen']
size_limits:
    content: { max: 120 }
---

# 🧩 server

<module_purpose>
Модуль для инициализации и управления MCP сервером. Создает MCP сервер с stdio transport, настраивает graceful shutdown и обеспечивает постоянную работу сервера для интеграции с Cursor IDE.
</module_purpose>

<public_api>
**Функции:**

- `startMcpServer(): Promise<void>` - запуск MCP сервера в постоянном режиме
- `createMcpServer(): Server` - создание MCP сервера с tools
- `setupGracefulShutdown(): void` - настройка graceful shutdown

**Типы:**

- `Server` - тип MCP сервера из SDK
- `StdioServerTransport` - transport для stdio коммуникации
  </public_api>

<usage_examples>
**Основное использование:**

```typescript
import { startMcpServer } from './server';

// Запуск MCP сервера
await startMcpServer();
```

**Интеграция:**

```typescript
// CLI entry point
import { startMcpServer } from './lib/server';

export function main(): void {
    try {
        await startMcpServer();
    } catch (err) {
        error('Критическая ошибка запуска', { error: err });
        process.exit(1);
    }
}
```

</usage_examples>

<module_structure>

```xml
<module name="server">
    <facade name="mcp-server.ts" role="unit_facade" exports="startMcpServer"/>
    <file name="create-mcp-server.ts" role="function" purpose="создание MCP сервера"/>
    <file name="setup-graceful-shutdown.ts" role="function" purpose="настройка graceful shutdown"/>
    <directory name="create-mcp-server" role="helper" purpose="вспомогательные функции создания сервера"/>
</module>
```

</module_structure>

<dependencies>
**Node.js:** node:process
**Внешние:** @modelcontextprotocol/sdk
**Внутренние:** ../lib/cache, ../lib/helpers/logger, ../tools
</dependencies>

<notes>
**Особенности:** Постоянный режим работы, stdio transport, graceful shutdown, инициализация кэша промптов
**Ограничения:** Только stdio transport, требует корректной настройки MCP клиента
</notes>
