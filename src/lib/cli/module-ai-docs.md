---
id: module-cli
documentation_type: "ai-module-documentation"
ai_documentation_version: "2.0.0"
module_context:
  name: "cli"
  path: "src/lib/cli"
  parent_package: "@morj/tools.mcp-validator"
  purpose: "CLI интерфейс для управления MCP валидатором"
target_models: ["claude", "gpt", "gemini", "qwen"]
size_limits:
  content: { max: 120 }
---

# 🧩 cli

<module_purpose>
Самодостаточный модуль командной строки для пакета mcp-validator. Предоставляет CLI интерфейс для отображения справки, версии и запуска MCP сервера в stdio режиме для интеграции с Cursor IDE.
</module_purpose>

<public_api>
**Функции:**

- `showHelp(): void` - отображение справки с командами и примерами
- `showVersion(): void` - отображение версии пакета из package.json
- `startMcpServer(): Promise<void>` - запуск MCP сервера в постоянном режиме через новую архитектуру

**Типы:**

- Нет собственных типов (простой CLI интерфейс)

**Константы:**

- Нет собственных констант (использует helpers)
  </public_api>

<usage_examples>
**Основное использование:**

```typescript
import { showHelp, showVersion, startMcpServer } from "./cli";

// Обработка CLI аргументов
const args = process.argv.slice(2);

if (args.includes("--version")) {
  showVersion();
  return;
}

if (args.includes("--help")) {
  showHelp();
  return;
}

// По умолчанию запуск MCP сервера
await startMcpServer();
```

**Интеграция:**

```typescript
// Основной entry point приложения в src/index.ts
import { showHelp, showVersion, startMcpServer } from "./lib/cli";

export function main(): void {
  const args = process.argv.slice(2);

  try {
    if (args.includes("--version")) showVersion();
    else if (args.includes("--help")) showHelp();
    else await startMcpServer();
  } catch (err) {
    error("Критическая ошибка запуска", { error: err });
    process.exit(1);
  }
}
```

</usage_examples>

<module_structure>

```xml
<module_root name="cli">
  <main_files>
    <file name="show-help.ts" role="генерация справочной информации"/>
    <file name="show-version.ts" role="отображение версии пакета"/>
    <file name="start-mcp-server.ts" role="запуск MCP сервера"/>
  </main_files>
  <internal_files>
    <!-- Модуль простой, только основные функции -->
  </internal_files>
  <tests>
    <directory name="__tests__">
      <file name="show-help.test.ts" role="тесты справки"/>
      <file name="show-version.test.ts" role="тесты версии"/>
      <file name="start-mcp-server.test.ts" role="тесты запуска сервера"/>
    </directory>
  </tests>
</module_root>
```

</module_structure>

<dependencies>
**Node.js:** node:process, node:fs (для чтения package.json)
**Внешние:** нет
**Внутренние:** ../../server/mcp-server, ../helpers/logger, ../helpers/resource-resolver
</dependencies>

<notes>
**Особенности:** Простой CLI без внешних зависимостей, автоматическое чтение версии из package.json, graceful обработка ошибок
**Ограничения:** Только базовые CLI команды (help, version, start), нет advanced CLI features (subcommands, options parsing)
</notes>
