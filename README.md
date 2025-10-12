# MCP Validator

MCP Validator — инструмент для валидации кода, тестов, архитектуры и промптов через AI с использованием Model Context Protocol (MCP).

## Возможности

- ✅ **Валидация кода** — проверка TypeScript, JavaScript, Go и других языков
- 🧪 **Валидация тестов** — анализ качества и полноты тестового покрытия
- 🏗️ **Валидация архитектуры** — проверка архитектурных решений
- 🔒 **Проверка безопасности** — поиск уязвимостей в коде
- ⚡ **Анализ производительности** — рекомендации по оптимизации
- 📝 **Валидация документации** — проверка качества и полноты документации
- 🤖 **Тестирование промптов** — параллельное тестирование на консистентность (3-10 итераций)

## Установка

```bash
npm install mcp-validator
# или
yarn add mcp-validator
```

## Использование через MCP

### Настройка в Cursor

Добавьте в конфигурацию MCP:

```json
{
  "mcpServers": {
    "mcp-validator": {
      "command": "npx",
      "args": ["mcp-validator"]
    }
  }
}
```

### Доступные инструменты

#### validate — Валидация кода/архитектуры

```typescript
// Валидация TypeScript кода
{
  "validationType": "code",
  "input": {
    "type": "content",
    "data": "export function test() { ... }"
  },
  "language": "typescript"
}

// Валидация файла
{
  "validationType": "code",
  "input": {
    "type": "file",
    "data": "/path/to/file.ts"
  },
  "language": "typescript"
}
```

#### test-prompt — Тестирование промптов

```typescript
{
  "prompt": "Напиши функцию сортировки массива",
  "iterations": 5,
  "context": "Тест консистентности ответов"
}
```

## CLI режим

```bash
# Показать справку
mcp-validator --help

# Показать версию
mcp-validator --version
```

## Переменные окружения

- `OPENROUTER_API_KEY` — API ключ для OpenRouter (обязательно)
- `PROMPTS_PATH` — путь к пользовательским промптам (опционально)

## Требования

- Node.js >= 20
- API ключ OpenRouter

## Лицензия

MIT

## Автор

Пахомов Андрей Николаевич
