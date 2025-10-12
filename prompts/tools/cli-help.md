# MCP Validator 2.0 - AI-powered Code Quality Tool

## Использование

```bash
yarn start                    # Запуск MCP сервера (по умолчанию)
yarn start --help             # Показать эту справку
yarn start --version          # Показать версию
```

## Возможности

- 9 типов валидации (код, тесты, архитектура, безопасность, производительность, документация, промпты, задачи, кастом)
- Параллельное тестирование промптов с анализом консистентности
- Интеграция с Cursor IDE через MCP протокол
- Поддержка множественных AI моделей через OpenRouter

## Требования

- Node.js 20+
- Переменная OPENROUTER_API_KEY в .env файле

## Обновления в V2.0

✅ Официальный MCP SDK (@modelcontextprotocol/sdk)
✅ Упрощенная агентная архитектура (OpenAI SDK)
✅ Постоянный серверный режим (await server.connect())
✅ Сохранены ВСЕ функции v1.x

## Примеры MCP использования

### validate инструмент

```json
{
  "tool": "validate",
  "arguments": {
    "validationType": "code",
    "input": { "type": "file", "data": "path/to/file.ts" },
    "context": "Проверка качества TypeScript кода"
  }
}
```

### test-prompt инструмент

```json
{
  "tool": "test-prompt",
  "arguments": {
    "prompt": "Напиши функцию для сортировки массива",
    "iterations": 5,
    "context": "Тестирование стабильности промпта"
  }
}
```
