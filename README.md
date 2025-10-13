# MCP Validator

[![npm version](https://img.shields.io/npm/v/mcp-validator.svg)](https://www.npmjs.com/package/mcp-validator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/mcp-validator.svg)](https://nodejs.org)

## 📋 Оглавление

- [Общая информация](#общая-информация)
- [Подключение к Cursor IDE](#подключение-к-cursor-ide)
- [Переменные окружения](#переменные-окружения)
- [Инструменты MCP](#инструменты-mcp)
- [CLI режим](#cli-режим)
- [Локальный запуск](#локальный-запуск)
- [Дополнительные ресурсы](#дополнительные-ресурсы)

## Общая информация

MCP Validator — инструмент для валидации кода, тестов, архитектуры и промптов через AI с использованием Model Context Protocol (MCP).

### ✨ Возможности

- ✅ **Валидация кода** — проверка TypeScript, JavaScript, Go, Python, Rust и других языков
- 🧪 **Валидация тестов** — анализ качества и полноты тестового покрытия
- 🏗️ **Валидация архитектуры** — проверка архитектурных решений
- 🔒 **Проверка безопасности** — поиск уязвимостей в коде
- ⚡ **Анализ производительности** — рекомендации по оптимизации
- 📝 **Валидация документации** — проверка качества и полноты документации
- 🎯 **Валидация промптов** — проверка качества AI промптов
- 📋 **Валидация задач** — анализ требований и спецификаций
- 🤖 **Тестирование промптов** — параллельное тестирование на консистентность (3-10 итераций)

**Поддерживаемые языки:** TypeScript, JavaScript, Go, Python, Rust, Java, C#, PHP, Ruby, Swift, Kotlin

### Требования

- Node.js >= 20
- API ключ OpenRouter ([получить бесплатно](https://openrouter.ai/))

### 🚀 Быстрый старт

**1. Получите API ключ OpenRouter:**

- Перейдите на [OpenRouter](https://openrouter.ai/keys)
- Создайте новый API ключ

**2. Настройте Cursor IDE:**

- Добавьте конфигурацию в `~/.cursor/mcp.json`

    ```json
    {
        "mcpServers": {
            ... // другие MCP серверы
            "mcp-validator": {
                "command": "npx",
                "args": ["-y", "mcp-validator"],
                "env": {
                    "OPENROUTER_API_KEY": "YOUR_OPENROUTER_API_KEY_HERE"
                }
            }
        }
    }
    ```

- Замените `YOUR_OPENROUTER_API_KEY_HERE` на ваш API ключ OpenRouter
- Перезапустите Cursor IDE

**3. Первая валидация:**

- Попросите AI ассистента в Cursor выполнить валидацию кода через `mcp-validator`
- Если всё настроено правильно, будет автоматически вызван инструмент MCP, который проанализирует файл и вернёт подробный отчёт

### 🔑 Получение API ключа

1. Перейдите на [OpenRouter](https://openrouter.ai/)
2. Зарегистрируйтесь или войдите в аккаунт
3. Перейдите в раздел [Keys](https://openrouter.ai/keys)
4. Создайте новый API ключ
5. Скопируйте ключ для использования в конфигурации

## Рекомендации по моделям

По умолчанию тулза использует

Рекомендуемые модели:

- `openai/gpt-oss-20b:free` (по умолчанию)
- `openai/gpt-oss-120b`
- `openai/gpt-4o-mini`
- `openai/gpt-4o`

## Подключение к Cursor IDE

### Настройка MCP сервера

Добавьте в конфигурацию MCP (`~/.cursor/mcp.json`):

#### Расширенная конфигурация

Для полной настройки с дополнительными параметрами:

```json
{
    "mcpServers": {
        "mcp-validator": {
            "command": "npx",
            "args": ["-y", "mcp-validator"],
            "env": {
                "API_KEY": "sk-or-v1-xxxxxxxxxxxxxx",
                "API_URL": "https://openrouter.ai/api/v1",
                "LOG_LEVEL": "DEBUG",
                "AI_MODEL": "openai/gpt-oss-20b:free",
                "AI_MAX_TOKENS": "50000",
                "AI_TEMPERATURE": "0.7",
                "TIMEOUT_API_REQUEST": "30000",
                "TIMEOUT_VALIDATION": "60000",
                "PROMPTS_PATH": "./custom-prompts"
            }
        }
    }
}
```

### Проверка подключения

После настройки `mcp.json`:

1. **Перезапустите Cursor IDE** для загрузки новой конфигурации
2. **Проверьте статус** в панели MCP (обычно в нижней части IDE)
3. **Используйте инструменты** через команды Cursor или автодополнение

### Устранение проблем подключения

Если MCP сервер не подключается:

```bash
# Проверьте, что пакет установлен
npx mcp-validator --version

# Проверьте конфигурацию
cat ~/.cursor/mcp.json | jq '.mcpServers["mcp-validator"]'

# Проверьте логи в Cursor
# Откройте Developer Tools (Cmd+Option+I) и посмотрите консоль
```

## Cursor Rules

Готовые правила и воркфлоу для Cursor IDE доступны в отдельном репозитории:

👉 **[CyberWalrus/cursor-rules](https://github.com/CyberWalrus/cursor-rules)**

Репозиторий включает:

- Правила воркфлоу (code, prompt, ai-docs, critique)
- Шаблоны архитектур (FSD, Layered Library и др.)
- Стандарты кодирования и документации
- Git workflow команды

## Переменные окружения

### 🔑 Обязательные

| Переменная           | Описание                | Пример                    |
| -------------------- | ----------------------- | ------------------------- |
| `OPENROUTER_API_KEY` | API ключ для OpenRouter | `sk-or-v1-xxxxxxxxxxxxxx` |

### ⚙️ Основные настройки

| Переменная     | Описание                         | По умолчанию  | Возможные значения                  |
| -------------- | -------------------------------- | ------------- | ----------------------------------- |
| `NODE_ENV`     | Среда выполнения                 | `development` | `development`, `production`, `test` |
| `LOG_LEVEL`    | Уровень логирования              | `INFO`        | `DEBUG`, `INFO`, `WARN`, `ERROR`    |
| `PROMPTS_PATH` | Путь к пользовательским промптам | `prompts`     | Любой путь к папке                  |

### 🤖 Настройки AI модели

| Переменная       | Описание                        | По умолчанию              | Диапазон                                    |
| ---------------- | ------------------------------- | ------------------------- | ------------------------------------------- |
| `AI_MODEL`       | Модель AI для валидации         | `openai/gpt-oss-20b:free` | Любая модель OpenAI-совместимого провайдера |
| `AI_MAX_TOKENS`  | Максимальное количество токенов | `100000`                  | 1-1000000                                   |
| `AI_TEMPERATURE` | Температура генерации           | `0.5`                     | 0.0-2.0                                     |

### 🌐 Настройки API

| Переменная | Описание                                    | По умолчанию                   | Диапазон            |
| ---------- | ------------------------------------------- | ------------------------------ | ------------------- |
| `API_KEY`  | API ключ для OpenAI-совместимого провайдера | `sk-or-v1-xxx`                 | Любой валидный ключ |
| `API_URL`  | URL OpenAI-совместимого API                 | `https://openrouter.ai/api/v1` | Любой валидный URL  |

**Поддерживаемые провайдеры:**

- **OpenRouter** (по умолчанию): `https://openrouter.ai/api/v1`
- **OpenAI**: `https://api.openai.com/v1`
- **Anthropic Claude**: `https://api.anthropic.com/v1`
- **Другие OpenAI-совместимые API**

### ⏱️ Настройки таймаутов

| Переменная            | Описание                       | По умолчанию | Единицы      |
| --------------------- | ------------------------------ | ------------ | ------------ |
| `TIMEOUT_API_REQUEST` | Таймаут для API запросов       | `30000`      | миллисекунды |
| `TIMEOUT_VALIDATION`  | Таймаут для процесса валидации | `30000`      | миллисекунды |

### 🔧 Настройки MCP сервера

| Переменная               | Описание             | По умолчанию                     |
| ------------------------ | -------------------- | -------------------------------- |
| `MCP_SERVER_NAME`        | Имя MCP сервера      | `mcp-validator`                  |
| `MCP_SERVER_DESCRIPTION` | Описание сервера     | `Production-ready MCP validator` |
| `MCP_PROTOCOL_VERSION`   | Версия MCP протокола | `2024-11-05`                     |
| `MCP_SERVER_VERSION`     | Версия сервера       | Из `package.json`                |

### 🧪 Настройки для разработки

| Переменная     | Описание                    | По умолчанию | Значения        |
| -------------- | --------------------------- | ------------ | --------------- |
| `MCP_E2E_TEST` | Флаг E2E тестирования       | `false`      | `true`, `false` |
| `NODE_PATH`    | Путь для разрешения модулей | `""`         | Путь к папке    |

### 🚀 Расширенные настройки

| Переменная              | Описание                       | По умолчанию | Единицы      |
| ----------------------- | ------------------------------ | ------------ | ------------ |
| `MAX_PARALLEL_REQUESTS` | Максимум параллельных запросов | `5`          | количество   |
| `HEARTBEAT_INTERVAL`    | Интервал heartbeat             | `30000`      | миллисекунды |
| `REQUEST_BUFFER_SIZE`   | Размер буфера запросов         | `1048576`    | байты (1MB)  |

### 🔧 Скрытые/внутренние переменные

Эти переменные используются внутренне системой и обычно не требуют настройки:

| Переменная                    | Описание                      | По умолчанию                              | Назначение       |
| ----------------------------- | ----------------------------- | ----------------------------------------- | ---------------- |
| `OPENROUTER_MOCK_CLIENT_PATH` | Путь к мок клиенту для тестов | `end-to-end/mocks/openrouter-test-client` | E2E тестирование |

## Инструменты MCP

После успешного подключения MCP сервера в Cursor IDE будут доступны следующие инструменты:

> **💡 Как использовать:** В Cursor IDE инструменты MCP доступны через:
>
> - **Автодополнение** — начните печатать название инструмента
> - **Команды** — используйте `@` для вызова инструментов
> - **Контекстное меню** — правый клик на файле/коде

### 1️⃣ validate — Универсальная валидация

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

### 2️⃣ test-prompt — Тестирование промптов на консистентность

```typescript
{
  "prompt": "Напиши функцию сортировки массива",
  "iterations": 5,
  "context": "Тест консистентности ответов",
  "timeout": 30000
}
```

Результат покажет:

- Консистентность ответов (score 0-100)
- Аномалии во времени выполнения
- Повторяющиеся паттерны в ответах
- Детальный отчет по каждой итерации

## CLI режим

```bash
# Показать справку
mcp-validator --help

# Показать версию
mcp-validator --version
```

## Локальный запуск

### Установка

```bash
npm install mcp-validator
# или
yarn add mcp-validator
```

### Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```env
# Обязательные настройки
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxx

# Основные настройки
NODE_ENV=production
LOG_LEVEL=INFO
PROMPTS_PATH=./custom-prompts

# Настройки AI
DEFAULT_AI_MODEL=openai/gpt-4o-mini
AI_MAX_TOKENS=50000
AI_TEMPERATURE=0.7

# Таймауты
VALIDATION_TIMEOUT=60000
PARALLEL_TEST_TIMEOUT=180000

# MCP сервер
MCP_SERVER_NAME=my-validator
MCP_SERVER_DESCRIPTION="Custom MCP validator for my project"
```

### Запуск MCP сервера

```bash
# Запуск через npx
npx mcp-validator

# Или установка глобально
npm install -g mcp-validator
mcp-validator
```

## Дополнительные ресурсы

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [OpenRouter Documentation](https://openrouter.ai/docs)
- [Cursor IDE](https://cursor.sh/)
- [Cursor Rules](https://github.com/CyberWalrus/cursor-rules) — готовые правила и воркфлоу для Cursor IDE
- [CHANGELOG](CHANGELOG.md) — история изменений
