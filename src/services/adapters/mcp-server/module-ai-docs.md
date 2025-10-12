---
id: module-mcp-server
documentation_type: 'ai-module-documentation'
ai_documentation_version: '2.0.0'
module_context:
    name: 'mcp-server'
    path: 'src/services/adapters/mcp-server'
    parent_package: '@morj/tools.mcp-validator'
    purpose: 'MCP протокол сервер для интеграции с Cursor IDE через stdio'
target_models: ['claude', 'gpt', 'gemini', 'qwen']
size_limits:
    content: { max: 120 }
---

# 🧩 mcp-server

<module_purpose>
Самодостаточный модуль MCP (Model Context Protocol) сервера для интеграции с Cursor IDE. Реализует JSON-RPC 2.0 протокол через stdio потоки, обрабатывает MCP запросы и предоставляет validate/test-prompt инструменты.
</module_purpose>

<public_api>
**Функции:**

- `initializeMCPServer(): Promise<MCPServerInfo>` - инициализация MCP сервера
- `handleMCPRequest(request: MCPRequest): Promise<JSONRPCResponse>` - обработка MCP запроса
- `shutdownMCPServer(): void` - корректное завершение сервера
- `getMCPServerInfo(): MCPServerInfo` - информация о состоянии сервера

**Helpers:**

- `handleInitialize(request: InitializeRequest): InitializeResponse` - обработка инициализации
- `handleToolCall(request: ToolCallRequest): Promise<ToolCallResponse>` - выполнение инструментов
- `handleToolsList(request: ToolsListRequest): ToolsListResponse` - список инструментов

**Типы:**

- `MCPServerInfo` - информация о сервере (версия, capabilities, статус)
- `MCPRequest`/`MCPResponse` - типы MCP протокола
- `InitializeRequest`/`ToolCallRequest` - специфичные запросы
  </public_api>

<usage_examples>
**Основное использование:**

```typescript
import { initializeMCPServer, handleMCPRequest } from './mcp-server';

// Инициализация сервера
const serverInfo = await initializeMCPServer();
console.log(`MCP сервер запущен, версия протокола: ${serverInfo.protocolVersion}`);

// Обработка входящего запроса
process.stdin.on('data', async (data) => {
    const request = JSON.parse(data.toString());
    const response = await handleMCPRequest(request);
    process.stdout.write(JSON.stringify(response) + '\n');
});
```

**Интеграция:**

```typescript
// CLI интеграция через stdio
startMcpServer(); // в lib/cli/start-mcp-server.ts
// → initializeMCPServer() → настройка stdio handlers → готовность к запросам от Cursor
```

</usage_examples>

<module_structure>

```xml
<module_root name="mcp-server">
  <main_files>
    <file name="index.ts" role="публичный API модуля"/>
    <file name="initialize-mcp-server.ts" role="инициализация сервера"/>
    <file name="handle-mcp-request.ts" role="центральный роутер запросов"/>
    <file name="shutdown-mcp-server.ts" role="корректное завершение"/>
  </main_files>
  <internal_files>
    <file name="helpers/handle-initialize.ts" role="обработка инициализации"/>
    <file name="helpers/handle-tool-call.ts" role="выполнение инструментов"/>
    <file name="helpers/handle-tools-list.ts" role="список инструментов"/>
    <file name="helpers/create-*.ts" role="вспомогательные функции"/>
    <file name="stability/" role="stability механизмы"/>
  </internal_files>
  <tests>
    <directory name="__tests__">
      <file name="initialize-mcp-server.test.ts" role="тесты инициализации"/>
      <file name="handle-mcp-request.test.ts" role="тесты роутера"/>
      <file name="helpers/__tests__/*.test.ts" role="тесты helpers"/>
    </directory>
  </tests>
</module_root>
```

</module_structure>

<dependencies>
**Node.js:** node:process (для stdio), node:stream
**Внешние:** zod (для валидации MCP схем)
**Внутренние:** ../../../api (для MCP инструментов), ../../../lib/helpers/logger, ../error-handler
</dependencies>

<notes>
**Особенности:** JSON-RPC 2.0 совместимость, stdio транспорт, graceful shutdown, stability механизмы (heartbeat, circuit breaker)
**Ограничения:** Только stdio интерфейс, синхронная обработка запросов, зависит от корректности Cursor MCP клиента
</notes>
