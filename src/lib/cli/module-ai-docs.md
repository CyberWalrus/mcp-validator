---
id: module-cli
documentation_type: 'ai-module-documentation'
ai_documentation_version: '2.0.0'
module_context:
    name: 'cli'
    path: 'src/lib/cli'
    parent_package: 'mcp-validator'
    purpose: 'CLI интерфейс для управления MCP валидатором'
target_models: ['claude', 'gpt', 'gemini', 'qwen']
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
import { showHelp, showVersion, startMcpServer } from './cli';

// Обработка CLI аргументов
const args = process.argv.slice(2);

if (args.includes('--version')) {
    showVersion();
    return;
}

if (args.includes('--help')) {
    showHelp();
    return;
}

// По умолчанию запуск MCP сервера
await startMcpServer();
```

**Интеграция:**

```typescript
// Основной entry point приложения в src/index.ts
import { showHelp, showVersion, startMcpServer } from './lib/cli';

export function main(): void {
    const args = process.argv.slice(2);

    try {
        if (args.includes('--version')) showVersion();
        else if (args.includes('--help')) showHelp();
        else await startMcpServer();
    } catch (err) {
        error('Критическая ошибка запуска', { error: err });
        process.exit(1);
    }
}
```

</usage_examples>

<module_structure>

```xml
<module name="cli">
    <facade name="main.ts" role="unit_facade" exports="main"/>
    <file name="show-help.ts" role="function" purpose="генерация справочной информации"/>
    <file name="show-version.ts" role="function" purpose="отображение версии пакета"/>
    <file name="start-mcp-server.ts" role="function" purpose="запуск MCP сервера"/>
    <file name="ensure-configuration.ts" role="helper" purpose="проверка конфигурации"/>
    <test name="__tests__/show-help.test.ts" role="unit_test" purpose="тесты справки"/>
    <test name="__tests__/show-version.test.ts" role="unit_test" purpose="тесты версии"/>
    <test name="__tests__/start-mcp-server.test.ts" role="unit_test" purpose="тесты запуска сервера"/>
</module>
```

</module_structure>

<dependencies>
**Node.js:** node:process, node:fs (для чтения package.json)
**Внешние:** нет
**Внутренние:** ../../server, ../helpers/logger, ../helpers/resource-resolver, ../../model/config
</dependencies>

<notes>
**Особенности:** Простой CLI без внешних зависимостей, автоматическое чтение версии из package.json, graceful обработка ошибок
**Ограничения:** Только базовые CLI команды (help, version, start), нет advanced CLI features (subcommands, options parsing)
</notes>
