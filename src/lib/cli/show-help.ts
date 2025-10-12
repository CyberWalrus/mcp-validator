import { info } from '../helpers/logger';

/** Показывает справку о доступных командах */
export function showHelp(): void {
    info(`
🔧 MCP Validator 2.0 - AI-powered Code Quality Tool

ИСПОЛЬЗОВАНИЕ:
  yarn start                    # Запуск MCP сервера (по умолчанию)
  yarn start --help             # Показать эту справку
  yarn start --version          # Показать версию

ВОЗМОЖНОСТИ:
  • 9 типов валидации (код, тесты, архитектура, безопасность, производительность, документация, промпты, задачи, кастом)
  • Параллельное тестирование промптов с анализом консистентности
  • Интеграция с Cursor IDE через MCP протокол
  • Поддержка множественных AI моделей через OpenRouter

ТРЕБОВАНИЯ:
  • Node.js 20+
  • Переменная OPENROUTER_API_KEY в .env файле

ОБНОВЛЕНИЯ В V2.0:
  ✅ Официальный MCP SDK (@modelcontextprotocol/sdk)
  ✅ Упрощенная агентная архитектура (OpenAI SDK)
  ✅ Постоянный серверный режим (await server.connect())
  ✅ Сохранены ВСЕ функции v1.x

ПРИМЕРЫ MCP ИСПОЛЬЗОВАНИЯ:
  validate инструмент:
    {
      "tool": "validate",
      "arguments": {
        "validationType": "code",
        "input": {"type": "file", "data": "path/to/file.ts"},
        "context": "Проверка качества TypeScript кода"
      }
    }

  test-prompt инструмент:
    {
      "tool": "test-prompt", 
      "arguments": {
        "prompt": "Напиши функцию для сортировки массива",
        "iterations": 5,
        "context": "Тестирование стабильности промпта"
      }
    }
`);
}
