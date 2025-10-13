# Changelog

## [0.4.2] - 2025-10-13

<small>13.10.2025 11:12</small>

### Fixed

- **Исправления CI/CD и GitHub Actions**
    - Исправлен баг с передачей версии в GitHub релизы
    - Удален дублирующий шаг Get package version
    - Добавлена запись version в GITHUB_OUTPUT в шаге check
    - Теперь релизы создаются с правильным тегом (v0.4.0 вместо v)
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/4f9562467e32ca55c8bacf5b03a2f16c18329016" target="_blank">4f95624</a>

### Changed

- **Улучшения стиля и форматирования**
    - Удалена лишняя пустая строка в GitHub workflow
    - Улучшена читаемость конфигурации CI/CD
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/259aa07eb196ef4155600711a47a8587b1d9c98e" target="_blank">259aa07</a>

## [0.4.0] - 2025-10-13

<small>13.10.2025 10:58</small>

### Changed

- **Крупный рефакторинг архитектуры**
    - Удален старый модуль валидации `src/services/workflows/validation/`
    - Упрощена структура конфигурации и моделей данных
    - Разделены функции на отдельные файлы согласно правилу one_file_one_function
    - Улучшена система логирования и кэширования
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/4622b1e4ef7ae898c9dea1036b533b20c21611f2" target="_blank">4622b1e</a>

- **Улучшения системы тестирования**
    - Добавлены новые модули анализа консистентности (длина, структура, время)
    - Разделены промпты для выполнения и анализа тестов
    - Улучшена система параллельного тестирования промптов
    - Добавлен E2E тест для отслеживания времени выполнения валидации
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/4622b1e4ef7ae898c9dea1036b533b20c21611f2" target="_blank">4622b1e</a>

- **Обновления конфигурации и зависимостей**
    - Обновлен eslint-walrus-config до версии 1.1.0
    - Улучшены настройки CI/CD pipeline
    - Добавлены новые переменные окружения для MCP соединения
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/4622b1e4ef7ae898c9dea1036b533b20c21611f2" target="_blank">4622b1e</a>

### Removed

- **Очистка устаревшего кода**
    - Удален модуль `src/services/workflows/validation/` полностью
    - Удалены устаревшие хелперы и константы конфигурации
    - Убраны избыточные функции и дублирующийся код
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/4622b1e4ef7ae898c9dea1036b533b20c21611f2" target="_blank">4622b1e</a>

## [0.3.0] - 2025-10-13

<small>13.10.2025 09:01</small>

### Added

- **Агенты валидации и тестирования**
    - Добавлены агенты для валидации кода и тестирования промптов
    - Реализована интеграция с OpenAI для валидации через AI
    - Добавлены промпты и парсинг ответов для различных типов валидации
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/26f0f19df3bff8546be0dbcb3879b6f53a4c27a2" target="_blank">26f0f19</a>

- **GitHub Actions для CI/CD**
    - Настроен автоматический пайплайн для сборки и публикации пакета
    - Добавлена проверка качества кода и тестирование
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/96a476f0d0cbc8f9499a19c60dbaa623c1b06e70" target="_blank">96a476f</a>

### Changed

- **Улучшения системы логирования и кэширования**
    - Расширена система логирования с поддержкой различных уровней
    - Улучшено кэширование промптов для повышения производительности
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/073c15a706239c3861bded092d98bef136d86bac" target="_blank">073c15a</a>

- **Рефакторинг моделей конфигурации**
    - Улучшены схемы валидации и типы конфигурации
    - Добавлены хелперы для работы с конфигурацией
    - Упрощена структура моделей данных
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/fb79dac88f3e60d01c0dd565f9770f1986196a89" target="_blank">fb79dac</a>

- **Улучшения OpenRouter адаптера**
    - Оптимизирован клиент для работы с OpenRouter API
    - Улучшена обработка ошибок и производительность
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/b1ebeb6efb95660c4f2248847665ac62d5b74c0b" target="_blank">b1ebeb6</a>

- **Workflow параллельного тестирования**
    - Улучшен процесс параллельного тестирования промптов
    - Добавлены детальные отчеты и анализ консистентности
    - Расширены возможности настройки тестирования
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/81c87ac54b806bfd540b1f02a753e623123dfd46" target="_blank">81c87ac</a>

- **Инструменты валидации и тестирования**
    - Улучшены инструменты валидации кода
    - Добавлены константы и улучшена обработка параметров
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/2b92eb45e973a8cb870628e0efd3ef71bafb9a05" target="_blank">2b92eb4</a>

- **CLI конфигурация**
    - Улучшена обработка конфигурации в CLI
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/879e6e51f48dffac6f0070644ad040872690a81d" target="_blank">879e6e5</a>

### Updated

- **Документация и промпты**
    - Обновлена документация и промпты валидации
    - Улучшены описания инструментов и CLI
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/bd4f9080db0cafb7113e8b4ebf81da80a3951048" target="_blank">bd4f908</a>

- **Конфигурационные файлы**
    - Обновлены конфигурационные файлы проекта
    - Улучшены настройки TypeScript и тестирования
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/1f0cab646cf038e0a8b05d7211d3301c539e638d" target="_blank">1f0cab6</a>

### Fixed

- **E2E тесты и моки**
    - Улучшены E2E тесты и моки для тестирования
    - Добавлены новые типы и конфигурации для тестов
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/cdc1eb1b837c2b08b7fc39b4b803e7a595cf8f50" target="_blank">cdc1eb1</a>

### Removed

- **Очистка устаревших файлов**
    - Удалены устаревшие файлы документации и справочников
    - Убраны шаблоны для AI-документации, архитектуры и код-стайла
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/704f7fd446572892ed5739ddcbabe2920c62a84f" target="_blank">704f7fd</a>

## [0.2.0] - 2025-10-12

### Added

- 📚 **Расширенная документация и примеры для Cursor IDE**
    - Полный набор правил и workflow для разработки (.cursor.example/rules/)
    - Шаблоны документации для модулей и пакетов
    - Примеры архитектурных решений (FSD, Layered, Monolith)
    - Стандарты кодирования и тестирования
    - Команды для генерации changelog и работы с промптами
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/23937ae33a9802fac14d6d9294be5d906acc859d" target="_blank">23937ae</a>

### Changed

- **Улучшения архитектуры и документации**
    - Рефакторинг структуры модулей в architecture.xml
    - Обновление AI документации для всех модулей
    - Улучшение CLI и кэш модулей
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/60b69f11dc6593f55a59e759e15416e42191f2da" target="_blank">60b69f1</a>

- **Рефакторинг процесса запуска приложения**
    - Добавлена функция `start` для обработки необработанных ошибок
    - Улучшены пути импорта для конфигурации
    - Расширена обработка ошибок в тестировании промптов
    - Удалены устаревшие методы получения конфигурации
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/bbe7a5e381fd2f6dd02d1da841941d086a42bbba" target="_blank">bbe7a5e</a>

- **Исправления и улучшения**
    - Обновлен формат URL репозитория в package.json
    - Улучшена навигация и читаемость README
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/f66bf44c96ad39fedfa86c18d0b1d8a0265e02d1" target="_blank">f66bf44</a>

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
