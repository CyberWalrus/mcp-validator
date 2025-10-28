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

## Переменные окружения

- `API_KEY` - API ключ OpenRouter (обязательно)
