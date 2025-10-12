---
id: module-logger
documentation_type: 'ai-module-documentation'
ai_documentation_version: '2.0.0'
module_context:
    name: 'logger'
    path: 'src/lib/helpers/logger'
    parent_package: '@morj/tools.mcp-validator'
    purpose: 'система структурированного логирования с уровнями и JSON форматом'
target_models: ['claude', 'gpt', 'gemini', 'qwen']
size_limits:
    content: { max: 120 }
---

# 🧩 logger

<module_purpose>
Самодостаточный модуль системы логирования для пакета mcp-validator. Предоставляет структурированное логирование с уровнями (DEBUG/INFO/WARN/ERROR), JSON форматом вывода и конфигурацией через переменные окружения.
</module_purpose>

<public_api>
**Функции:**

- `debug(message: string, meta?: object): void` - отладочное логирование
- `info(message: string, meta?: object): void` - информационное логирование
- `warn(message: string, meta?: object): void` - предупреждения
- `error(message: string, meta?: object): void` - ошибки с stack trace
- `setLogLevel(level: LogLevel): void` - динамическое изменение уровня

**Helpers:**

- `shouldLog(level: LogLevel, currentLevel: LogLevel): boolean` - проверка необходимости логирования
- `formatLogEntry(level: LogLevel, message: string, meta?: object): string` - форматирование записи

**Типы:**

- `LogLevel` - уровни логирования ('DEBUG' | 'INFO' | 'WARN' | 'ERROR')
- `LogEntry` - структура записи лога
- `LoggerConfig` - конфигурация логгера
  </public_api>

<usage_examples>
**Основное использование:**

```typescript
import { info, error, debug, warn } from '../lib/helpers/logger';

// Информационное логирование
info('MCP сервер запущен', { port: 8080, version: '1.0.0' });

// Логирование ошибок
error('Ошибка валидации', {
    error: err.message,
    file: 'src/utils.ts',
    validationType: 'code',
});

// Отладочное логирование (только если LOG_LEVEL=DEBUG)
debug('Обработка MCP запроса', { requestId: '123', method: 'validate' });
```

**Интеграция:**

```typescript
// Использование во всех модулях пакета
import { info, error } from '../../../lib/helpers/logger';

export async function validateCode(params: ValidationParams) {
    info('Начинаю валидацию', { type: params.validationType });
    try {
        const result = await performValidation(params);
        info('Валидация завершена', { success: result.success });
        return result;
    } catch (err) {
        error('Ошибка валидации', { error: err });
        throw err;
    }
}
```

</usage_examples>

<module_structure>

```xml
<module_root name="logger">
  <main_files>
    <file name="index.ts" role="публичный API модуля"/>
  </main_files>
  <internal_files>
    <file name="helpers/log.ts" role="основная функция логирования"/>
    <file name="helpers/should-log.ts" role="проверка уровня"/>
    <file name="helpers/format-log-entry.ts" role="форматирование записей"/>
    <file name="types.ts" role="типы логирования"/>
    <file name="constants.ts" role="константы уровней"/>
  </internal_files>
  <tests>
    <directory name="__tests__">
      <file name="logger.test.ts" role="интеграционные тесты"/>
    </directory>
    <directory name="helpers/__tests__">
      <file name="log.test.ts" role="тесты основной функции"/>
      <file name="should-log.test.ts" role="тесты проверки уровня"/>
    </directory>
  </tests>
</module_root>
```

</module_structure>

<dependencies>
**Node.js:** node:process (для переменных окружения), node:console
**Внешние:** нет
**Внутренние:** ../../../model/types/main (для LogLevel типа)
</dependencies>

<notes>
**Особенности:** JSON структурированный вывод, динамическая конфигурация через LOG_LEVEL env переменную, автоматические timestamps
**Ограничения:** Только console вывод, синхронное логирование, зависит от правильности LOG_LEVEL переменной
</notes>
