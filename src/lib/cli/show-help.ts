import { info } from '../helpers/logger';

/** Показывает справку о доступных командах */
export function showHelp(): void {
    info(`
🔧 MCP Validator - Инструмент для валидации кода и тестирования промптов

USAGE:
  npx mcp-validator [command] [options]

COMMANDS:
  validate <file|content> [options]  Валидация кода или промпта
  test-prompt <prompt> [options]     Параллельное тестирование промпта

OPTIONS:
  --help, -h        Показать справку
  --version, -v     Показать версию
  --type <type>     Тип валидации (code|tests|architecture|documentation|prompts)
  --language <lang> Язык программирования (опционально)
  --context <text>  Дополнительный контекст
  --iterations <n>  Количество итераций для test-prompt (по умолчанию 5)
  --models <models> Список моделей для тестирования (разделенные запятыми)

EXAMPLES:
  npx mcp-validator validate src/utils.ts --type=code
  npx mcp-validator validate --type=architecture --context="microservice"
  npx mcp-validator test-prompt "Write unit tests" --iterations=3
  npx mcp-validator --version
  npx mcp-validator --help

📖 Больше информации: https://github.com/monorepo/mcp-validator
`);
}
