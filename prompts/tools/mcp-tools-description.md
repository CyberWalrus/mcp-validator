# MCP Tools

## validate

Универсальная валидация через AI. Типы: `code`, `tests`, `architecture`, `prompts`, `documentation`.

**Параметры:**

- `validationType`: code|tests|architecture|prompts|documentation
- `input`: { `type`: file|content|url, `data`: абсолютный путь (ОБЯЗАТЕЛЬНО!), `encoding`?: utf8|utf16le|ascii }
- `context`: дополнительный контекст (опционально)
- `language`: язык (по умолчанию typescript)

**⚠️ ВСЕГДА используйте абсолютный путь в `data`:**

```json
{
  "tool": "validate",
  "arguments": {
    "validationType": "code",
    "input": {
      "type": "file",
      "data": "/Users/name/project/src/file.ts"
    }
  }
}
```

## Выбор типа

| Тип | Когда | Что проверяет |
|-----|-------|---------------|
| **code** | Новый/измененный код | Качество, стиль, naming, типы |
| **tests** | Новые/измененные тесты | Покрытие, моки, производительность |
| **architecture** | Проектирование/рефакторинг | FSD, layered, фасады |
| **prompts** | Новые/измененные промпты | YAML frontmatter, TIER, XML |
| **documentation** | Новые/измененные docs | Шаблоны, YAML, XML |

**⚠️ Всегда используйте `data`, НЕ `path` (иначе ошибка -32602):**

```json
// ❌ НЕПРАВИЛЬНО
"path": "/path/file.ts"

// ✅ ПРАВИЛЬНО
"data": "/absolute/path/file.ts"
```

## test-prompt

Параллельное тестирование промпта (3-10 итераций).

```json
{
  "tool": "test-prompt",
  "arguments": {
    "prompt": "Твой промпт здесь",
    "iterations": 3
  }
}
```

## verify-info

Проверка информации через 3 параллельные AI проверки с комбинированным отчётом достоверности.

**Параметры:**

- `input`: { `type`: content|file, `data`: текст или путь к файлу }
- `context`: дополнительный контекст (опционально)
- `encoding`: кодировка файла (опционально, по умолчанию utf8)

```json
{
  "tool": "verify-info",
  "arguments": {
    "input": {
      "type": "content",
      "data": "TypeScript был создан Microsoft в 2012 году"
    }
  }
}
```

## validate-interactive

Интерактивная валидация с выбором типа через диалоговое окно (elicitation).

**Параметры:**

- `filePath`: абсолютный путь к файлу (ОБЯЗАТЕЛЬНО!)
- `validationType`: тип валидации (опционально, если не указан — появится диалог выбора)
- `language`: язык (по умолчанию typescript)
- `context`: дополнительный контекст (опционально)

```json
{
  "tool": "validate-interactive",
  "arguments": {
    "filePath": "/Users/name/project/src/file.ts"
  }
}
```

**Как работает:**

1. Если `validationType` не указан — появится диалоговое окно с выбором типа
2. Пользователь выбирает: code, tests, architecture, prompts, documentation
3. Запускается валидация с выбранным типом

**Преимущества:**

- Не нужно запоминать типы валидации
- Быстрый выбор через UI
- Поддержка отмены операции

## Переменные окружения

- `API_KEY` - API ключ OpenRouter (обязательно)
