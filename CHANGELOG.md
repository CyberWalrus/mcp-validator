# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-10-12

### Added

- 🚀 MCP сервер для интеграции с Cursor IDE
- ✅ 9 типов валидации контента через AI:
    - `code` - валидация кода
    - `tests` - проверка качества и полноты тестов
    - `architecture` - валидация архитектурных решений
    - `security` - поиск уязвимостей в коде
    - `performance` - анализ производительности
    - `documentation` - проверка качества документации
    - `prompts` - валидация AI промптов
    - `tasks` - проверка задач и требований
    - `custom` - кастомная валидация с пользовательским промптом
- 🧪 Параллельное тестирование промптов (3-10 итераций) для проверки консистентности AI ответов
- 📝 Детальные отчеты об ошибках в Markdown формате
- 🔌 Интеграция с OpenRouter API для доступа к различным AI моделям
- 📦 Поддержка валидации файлов, URL и прямого контента
- ⚙️ Гибкая конфигурация через переменные окружения
- 🎯 Официальные SDK: @modelcontextprotocol/sdk и OpenAI SDK

### Technical

- TypeScript 5.9.3
- Node.js >= 20
- ESM модули
- Сборка через tsup для оптимальной производительности
