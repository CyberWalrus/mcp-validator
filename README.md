# MCP Validator

[![npm version](https://img.shields.io/npm/v/mcp-validator.svg)](https://www.npmjs.com/package/mcp-validator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/mcp-validator.svg)](https://nodejs.org)

MCP Validator — инструмент для валидации кода, тестов, архитектуры и промптов через AI с использованием Model Context Protocol (MCP).

## ✨ Возможности

- ✅ **Валидация кода** — проверка TypeScript, JavaScript, Go и других языков
- 🧪 **Валидация тестов** — анализ качества и полноты тестового покрытия
- 🏗️ **Валидация архитектуры** — проверка архитектурных решений
- 🔒 **Проверка безопасности** — поиск уязвимостей в коде
- ⚡ **Анализ производительности** — рекомендации по оптимизации
- 📝 **Валидация документации** — проверка качества и полноты документации
- 🎯 **Валидация промптов** — проверка качества AI промптов
- 📋 **Валидация задач** — анализ требований и спецификаций
- 🤖 **Тестирование промптов** — параллельное тестирование на консистентность (3-10 итераций)

## 📦 Установка

```bash
npm install mcp-validator
# или
yarn add mcp-validator
```

## 🔑 Получение API ключа

1. Перейдите на [OpenRouter](https://openrouter.ai/)
2. Зарегистрируйтесь или войдите в аккаунт
3. Перейдите в раздел [Keys](https://openrouter.ai/keys)
4. Создайте новый API ключ
5. Скопируйте ключ и добавьте в переменные окружения:

```bash
export OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxx
```

Или создайте файл `.env` в корне проекта:

```env
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxx
```

## 🚀 Использование через MCP

### Настройка в Cursor

Добавьте в конфигурацию MCP (`~/.cursor/mcp.json`):

```json
{
    "mcpServers": {
        "mcp-validator": {
            "command": "npx",
            "args": ["mcp-validator"],
            "env": {
                "OPENROUTER_API_KEY": "sk-or-v1-xxxxxxxxxxxxxx"
            }
        }
    }
}
```

### Доступные инструменты

#### 1️⃣ validate — Универсальная валидация

**Валидация кода:**

```typescript
{
  "validationType": "code",
  "input": {
    "type": "content",
    "data": "export function test() { return 42; }"
  },
  "language": "typescript"
}
```

**Валидация тестов:**

```typescript
{
  "validationType": "tests",
  "input": {
    "type": "file",
    "data": "/path/to/test.spec.ts"
  },
  "language": "typescript"
}
```

**Валидация архитектуры:**

```typescript
{
  "validationType": "architecture",
  "input": {
    "type": "file",
    "data": "/path/to/architecture.xml"
  }
}
```

**Проверка безопасности:**

```typescript
{
  "validationType": "security",
  "input": {
    "type": "content",
    "data": "const password = 'hardcoded123';"
  },
  "language": "typescript"
}
```

**Анализ производительности:**

```typescript
{
  "validationType": "performance",
  "input": {
    "type": "file",
    "data": "/path/to/component.tsx"
  },
  "language": "typescript"
}
```

**Валидация документации:**

```typescript
{
  "validationType": "documentation",
  "input": {
    "type": "file",
    "data": "/path/to/README.md"
  }
}
```

**Валидация промптов:**

```typescript
{
  "validationType": "prompts",
  "input": {
    "type": "content",
    "data": "Your AI prompt text here"
  }
}
```

**Валидация задач:**

```typescript
{
  "validationType": "tasks",
  "input": {
    "type": "content",
    "data": "User story or requirement specification"
  }
}
```

**Кастомная валидация:**

```typescript
{
  "validationType": "custom",
  "input": {
    "type": "content",
    "data": "Your content here"
  },
  "customPrompt": "Check if this code follows our team conventions",
  "language": "typescript"
}
```

**Валидация из URL:**

```typescript
{
  "validationType": "code",
  "input": {
    "type": "url",
    "data": "https://raw.githubusercontent.com/user/repo/main/file.ts"
  },
  "language": "typescript"
}
```

#### 2️⃣ test-prompt — Тестирование промптов на консистентность

```typescript
{
  "prompt": "Напиши функцию сортировки массива",
  "iterations": 5,
  "context": "Тест консистентности ответов",
  "models": ["openai/gpt-oss-120b"],
  "timeout": 30000
}
```

Результат покажет:

- Консистентность ответов (score 0-100)
- Аномалии во времени выполнения
- Повторяющиеся паттерны в ответах
- Детальный отчет по каждой итерации

## 🖥️ CLI режим

```bash
# Показать справку
mcp-validator --help

# Показать версию
mcp-validator --version
```

## ⚙️ Переменные окружения

### Обязательные

- `OPENROUTER_API_KEY` — API ключ для OpenRouter ([получить здесь](https://openrouter.ai/keys))

### Опциональные

- `PROMPTS_PATH` — путь к пользовательским промптам (по умолчанию: `prompts`)
- `LOG_LEVEL` — уровень логирования: `DEBUG`, `INFO`, `WARN`, `ERROR` (по умолчанию: `INFO`)
- `DEFAULT_AI_MODEL` — модель AI по умолчанию (по умолчанию: `openai/gpt-oss-120b`)
- `AI_MAX_TOKENS` — максимальное количество токенов (по умолчанию: `100000`)
- `AI_TEMPERATURE` — температура генерации 0-2 (по умолчанию: `0.5`)
- `VALIDATION_TIMEOUT` — таймаут валидации в мс (по умолчанию: `30000`)

Полный список переменных окружения смотрите в файле `.env.example`.

## 🔧 Troubleshooting

### Ошибка: "OPENROUTER_API_KEY is required"

**Проблема:** Не установлен API ключ OpenRouter.

**Решение:**

1. Получите API ключ на [OpenRouter](https://openrouter.ai/keys)
2. Установите переменную окружения:

    ```bash
    export OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxx
    ```

3. Или добавьте в конфигурацию MCP:

    ```json
    {
        "mcpServers": {
            "mcp-validator": {
                "env": {
                    "OPENROUTER_API_KEY": "ваш-ключ"
                }
            }
        }
    }
    ```

### Ошибка: "Failed to read prompt file"

**Проблема:** Не найдены файлы промптов.

**Решение:**

1. Убедитесь, что пакет установлен корректно: `npm install mcp-validator`
2. Проверьте, что папка `prompts` существует в пакете
3. Если используете пользовательские промпты, проверьте путь в `PROMPTS_PATH`

### MCP сервер не отвечает в Cursor

**Проблема:** Cursor не может подключиться к MCP серверу.

**Решение:**

1. Проверьте конфигурацию в `~/.cursor/mcp.json`
2. Перезапустите Cursor IDE
3. Проверьте логи в консоли разработчика Cursor
4. Убедитесь, что установлена версия Node.js >= 20:

    ```bash
    node --version
    ```

### Медленная валидация

**Проблема:** Валидация занимает слишком много времени.

**Решение:**

1. Увеличьте `VALIDATION_TIMEOUT`:

    ```bash
    export VALIDATION_TIMEOUT=60000
    ```

2. Используйте более быструю модель AI
3. Проверьте скорость интернет-соединения

### Ошибки OpenRouter API

**Проблема:** Ошибки от OpenRouter API (rate limit, quota exceeded).

**Решение:**

1. Проверьте баланс на [OpenRouter](https://openrouter.ai/)
2. Проверьте лимиты вашего API ключа
3. Подождите несколько минут и повторите попытку

## 📋 Требования

- Node.js >= 20
- API ключ OpenRouter ([получить бесплатно](https://openrouter.ai/))

## 📄 Лицензия

MIT

## 👤 Автор

Andrey Pakhomov

## 🤝 Вклад в проект

Приветствуются issues и pull requests на [GitHub](https://github.com/CyberWalrus/mcp-validator)!

## 📚 Дополнительные ресурсы

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [OpenRouter Documentation](https://openrouter.ai/docs)
- [Cursor IDE](https://cursor.sh/)
