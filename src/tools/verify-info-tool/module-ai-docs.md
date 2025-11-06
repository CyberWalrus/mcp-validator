---
id: module-verify-info-tool
documentation_type: 'ai-module-documentation'
ai_documentation_version: '2.0.0'
module_context:
    name: 'verify-info-tool'
    path: 'src/tools/verify-info-tool'
    parent_package: 'mcp-validator'
    purpose: 'MCP tool обертка для проверки информации через AI с 3 параллельными проверками'
target_models: ['claude', 'gpt', 'gemini', 'qwen']
size_limits:
    content: { max: 120 }
---

# 🧩 verify-info-tool

<module_purpose>
MCP tool обертка для проверки информации через AI. Предоставляет интерфейс для интеграции с Cursor IDE через MCP протокол, выполняет 3 параллельные проверки информации и возвращает комбинированный отчет.
</module_purpose>

<public_api>
**Функции:**

- `handleVerifyInfoTool(args: unknown): Promise<{ content: string; isError?: boolean }>` - обработка MCP запроса проверки информации
- `formatVerifyInfoResult(result: VerifyInfoResult): string` - форматирование результата в markdown

**Типы:**

- `verifyInfoTool: Tool` - схема MCP инструмента
</public_api>

<key_concepts>
**MCP интеграция:**
- Обрабатывает запросы через MCP протокол
- Валидирует входные параметры
- Использует кэшированный агент для производительности

**Параметры:**
- `input`: объект с `type` (content/file) и `data` (текст или путь к файлу)
- `context`: дополнительный контекст (опционально)
- `encoding`: кодировка файла (опционально, по умолчанию utf8)
</key_concepts>

<usage_example>
```json
{
  "tool": "verify-info",
  "arguments": {
    "input": {
      "type": "content",
      "data": "Информация для проверки..."
    },
    "context": "Дополнительный контекст"
  }
}
```
</usage_example>

