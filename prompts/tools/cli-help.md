# mcp-validator - Упрощенный MCP валидатор

## Использование

```bash
mcp-validator              # Запуск MCP сервера (stdio режим)
mcp-validator --version    # Показать версию
mcp-validator --help       # Показать справку
```

## Режимы работы

### MCP сервер (по умолчанию)

Запускается в stdio режиме для интеграции с Cursor IDE:

```bash
mcp-validator
```

### CLI версия

Показывает справку и версию:

```bash
mcp-validator --help
mcp-validator --version
```

## Переменные окружения

Создайте файл `.env` в корне проекта:

```env
# Уровень логирования
LOG_LEVEL=INFO

# API ключ OpenRouter (обязательный)
OPENROUTER_API_KEY=your_key_here

# Timeout запросов (опциональный)
REQUEST_TIMEOUT=30000
```

## Доступные команды MCP

- **validate**: валидация кода (9 типов)
- **test-prompt**: параллельное тестирование промптов

## Требования

- Node.js 20+
- Переменная окружения OPENROUTER_API_KEY

## Производительность

- Время запуска: < 1 секунды
- Использование памяти: < 100MB
- Покрытие тестами: 90%+
