# Changelog

## [0.7.7] - 2025-12-17

<small>17.12.2025 11:15</small>

### Changed

- **Uncommitted changes in package.json** – version update to 0.7.7 and test command removal
- **Uncommitted changes in src/services/adapters/openrouter/openrouter-real-client.ts** – provider format update from extra_body to provider.only
- **Uncommitted changes in src/agents/code-validator-agent/call-openai-for-validation.ts** – provider format update from extra_body to provider.only
- **Uncommitted changes in src/agents/verify-info-agent/call-openai-for-verification.ts** – provider format update from extra_body to provider.only
- **Uncommitted changes in end-to-end/constants.ts** – field order update in mock responses

### Fixed

- **Test command fixes**
    - Added missing test:unit and test:e2e commands
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/b5b3faf" target="_blank">b5b3faf</a>

### Docs

- **Code validation prompt updates**
    - Updated code validation prompt
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/ce0434a" target="_blank">ce0434a</a>

## [0.7.6] - 2025-12-17

<small>17.12.2025 11:13</small>

### Changed

- **Uncommitted changes in package.json** – version update to 0.7.6 and test command fixes
- **Uncommitted changes in prompts/validation/validate-code.md** – code validation prompt updates

### Docs

- **Code validation prompt updates**
    - Updated code validation prompt
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/b1402fd" target="_blank">b1402fd</a>

## [0.7.5] - 2025-12-17

<small>17.12.2025 04:20</small>

### Changed

- **Uncommitted changes in package.json** – version update to 0.7.5
- **Uncommitted changes in prompts/validation/validate-code.md** – code validation prompt updates

### Docs

- **Validation prompt updates**
    - Updated validation prompts
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/b8d3199" target="_blank">b8d3199</a>

## [0.7.4] - 2025-12-13

<small>13.12.2025 08:53</small>

### Changed

- **Uncommitted changes in package.json** – version update to 0.7.4
- **Uncommitted changes in prompts/validation/validate-architecture.md** – architecture validation prompt updates
- **Uncommitted changes in prompts/validation/validate-code.md** – code validation prompt updates
- **Uncommitted changes in prompts/validation/validate-documentation.md** – documentation validation prompt updates

### Docs

- **Architecture validation prompt updates**
    - Updated architecture validation prompt
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/1c1eb7f" target="_blank">1c1eb7f</a>

## [0.7.3] - 2025-12-13

<small>13.12.2025 07:50</small>

### Changed

- **Import path fix in MCP server**
    - Fixed import path in mcp-server
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/7cd65ba" target="_blank">7cd65ba</a>

- **Uncommitted changes in package.json** – version update to 0.7.3
- **Uncommitted changes in prompts/validation/validate-architecture.md** – architecture validation prompt updates

### Docs

- **Architecture validation prompt updates**
    - Updated architecture validation prompt
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/91ec82c" target="_blank">91ec82c</a>

## [0.7.2] - 2025-12-13

<small>13.12.2025 07:50</small>

### Changed

- **Uncommitted changes in package.json** – version update to 0.7.2
- **Uncommitted changes in prompts/validation/validate-architecture.md** – architecture validation prompt updates
- **Uncommitted changes in src/server/mcp-server.ts** – import path fix

## [0.7.1] - 2025-12-05

<small>05.12.2025 02:47</small>

### Changed

- **MCP server refactoring to high-level McpServer API**
    - Refactored MCP server to use high-level McpServer API
    - Updated server creation and initialization logic
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/2a46465" target="_blank">2a46465</a>

- **E2E test configuration updates**
    - Updated E2E test configuration
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/50215bc" target="_blank">50215bc</a>

- **Uncommitted changes in README.md** – documentation updates
- **Uncommitted changes in package.json** – version update to 0.7.1
- **Uncommitted changes in prompts/tools/mcp-tools-description.md** – tool description updates
- **Uncommitted changes in src/model/config/** – configuration module updates
- **Uncommitted changes in src/server/** – server module updates
- **Uncommitted changes in end-to-end/prompts-resources.e2e.test.ts** – new E2E test for prompts resources
- **Uncommitted changes in end-to-end/validate-interactive-tool.e2e.test.ts** – new E2E test for interactive validation tool
- **Uncommitted changes in src/server/elicitation/** – new elicitation module
- **Uncommitted changes in src/server/prompts/** – new prompts module
- **Uncommitted changes in src/server/resources/** – new resources module
- **Uncommitted changes in src/server/transports/** – new transports module
- **Uncommitted changes in src/tools/validate-interactive-tool/** – new interactive validation tool

### Tests

- **Unit tests for MCP server creation**
    - Added comprehensive unit tests for createMcpServer function
    - Tests cover server instance creation, tool registration, and schema validation
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/32c47c0" target="_blank">32c47c0</a>

## [0.7.0] - 2025-12-05

<small>05.12.2025 00:49</small>

### Changed

- **Refactoring MCP server to high-level McpServer API**
    - Migrated from low-level MCP SDK to high-level McpServer API
    - Updated server creation and initialization logic
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/10544b3" target="_blank">10544b3</a>

- **Dependencies update**
    - Updated project dependencies
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/081124e" target="_blank">081124e</a>

- **Uncommitted changes in package.json** – version update to 0.7.0
- **Uncommitted changes in src/server/create-mcp-server.ts** – server creation refactoring
- **Uncommitted changes in src/server/mcp-server.ts** – server startup refactoring
- **Uncommitted changes in vitest.e2e.ci.config.ts** – E2E test configuration updates
- **Uncommitted changes in vitest.e2e.config.ts** – E2E test configuration updates

### Added

- **Unit tests for MCP server creation**
    - Added comprehensive tests for createMcpServer function
    - Tests cover server instance creation, tool registration, and schema validation
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/uncommitted" target="_blank">uncommitted</a>

## [0.6.4] - 2025-11-14

<small>14.11.2025 02:51</small>

### Changed

- **Test validation prompt updates**
    - Updated test validation prompt with detailed Vitest import checks
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/1f8edf4" target="_blank">1f8edf4</a>

- **React component validation rules updates**
    - Updated React component validation rules
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/1dd867a" target="_blank">1dd867a</a>

## [0.6.3] - 2025-11-13

<small>13.11.2025 11:16</small>

### Changed

- **Git ignore updates**
    - Added .vscode exclusion to .gitignore
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/50c743a" target="_blank">50c743a</a>

- **Test validation documentation updates**
    - Updated test validation documentation
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/0e311bb" target="_blank">0e311bb</a>

## [0.6.2] - 2025-11-11

<small>11.11.2025 05:07</small>

### Changed

- **Validation prompts updates**
    - Updated validation prompts with cross-platform rules
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/3c44b61" target="_blank">3c44b61</a>

## [0.6.1] - 2025-11-09

<small>09.11.2025 19:41</small>

### Fixed

- **Server readiness timeout and error handling**
    - Updated server readiness timeout and added error handling with stdout/stderr output
    - Updated server readiness timeout for Windows and added null/undefined checks in E2E cleanup function
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/4ecce5a" target="_blank">4ecce5a</a>
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/70733e1" target="_blank">70733e1</a>

### Changed

- **E2E test linting command updates**
    - Updated E2E test linting command in package.json, added build before execution
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/fec477b" target="_blank">fec477b</a>

- **AI documentation formatting**
    - Added empty lines at end of AI documentation
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/56e8088" target="_blank">56e8088</a>

### Docs

- **Prompt validation updates**
    - Allowed emoji usage in critical prompt places
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/c7128b7" target="_blank">c7128b7</a>

## [0.6.0] - 2025-11-06

<small>06.11.2025 20:06</small>

### Added

- **Verify-info tool for information verification**
    - Added verify-info tool for AI-based information verification with 3 parallel checks
    - Supports text and file inputs, returns combined report with reliability assessment
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/9a74a02" target="_blank">9a74a02</a>

- **Provider metadata and cost information in validation**
    - Added provider metadata and cost information to validation results
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/9d6501c" target="_blank">9d6501c</a>

### Changed

- **CHANGELOG updates**
    - Updated CHANGELOG with new changes including linting improvements, CI/CD simplification, dependency updates, unused code cleanup, and test validation prompt updates
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/a9441c2" target="_blank">a9441c2</a>

- **CI/CD workflow simplification**
    - Simplified CI/CD workflow in publish.yml
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/0a14ae3" target="_blank">0a14ae3</a>

- **Dependencies update**
    - Updated dependencies in yarn.lock
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/96bae5b" target="_blank">96bae5b</a>

### Refactor

- **Unused code removal from error-handler**
    - Removed unused code from error-handler module
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/ce002d1" target="_blank">ce002d1</a>

- **Unused files removal after knip analysis**
    - Removed unused files after knip analysis
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/3c18452" target="_blank">3c18452</a>

### Docs

- **Test validation prompt updates**
    - Updated test validation prompt with improved rules and requirements
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/a07c45e" target="_blank">a07c45e</a>

### Tests

- **E2E tests for verify-info tool**
    - Added E2E tests for verify-info tool
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/bf3f620" target="_blank">bf3f620</a>

## [0.5.18] - 2025-11-04

<small>04.11.2025 17:22</small>

### Changed

- **Улучшение системы линтинга и добавление knip**
    - Добавлена конфигурация knip для обнаружения неиспользуемого кода
    - Обновлен lint скрипт для использования ai-friendly-runner с параллельным выполнением проверок
    - Добавлены отдельные скрипты для lint:eslint, lint:ts, lint:knip, lint:test-unit, lint:test-e2e
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/3fed269900049b51d24c41ecbd0cc39013f8c16f" target="_blank">3fed269</a>

- **Упрощение CI/CD workflow**
    - Упрощен GitHub Actions workflow в publish.yml
    - Удалены избыточные шаги сборки и тестирования из CI/CD
    - Оптимизирован процесс публикации пакета
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/0a14ae33f8a05f5c7308355eebc6719d05d21eb6" target="_blank">0a14ae3</a>

- **Обновление зависимостей**
    - Обновлен yarn.lock с новыми версиями зависимостей
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/96bae5b62dd8cd55236ee2a2a707095ab6b59fae" target="_blank">96bae5b</a>

### Refactor

- **Очистка неиспользуемого кода**
    - Удалены неиспользуемые файлы после анализа knip
    - Удалены устаревшие функции logger (debug, warn, logger-constants)
    - Удалены неиспользуемые хелперы (force-kill-process, kill-process)
    - Удалены пустые файлы конфигурации и типов (model/config/constants.ts, model/schemas/main.ts, model/types/main.ts)
    - Удалены неиспользуемые адаптеры и workflows
    - Обновлены импорты и зависимости после удаления файлов
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/3c18452eed30fd9b619cb8c6543c652eb14947ea" target="_blank">3c18452</a>

### Docs

- **Обновление промпта валидации тестов**
    - Обновлен промпт валидации тестов с улучшенными правилами и требованиями
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/a07c45e46f8c07a877cddce9ac6319726990df06" target="_blank">a07c45e</a>

## [0.5.9] - 2025-10-30

<small>30.10.2025 15:20</small>

### Changed

- **Поддержка Node.js 16+**
    - Заменен встроенный `fetch` на `undici` для совместимости с Node.js 16+
    - Добавлена загрузка env переменных через `dotenv` вместо флага `--env-file`
    - Обновлен `engines.node` в package.json: `>=16.0.0` (было `>=20`)
    - Обновлены зависимости: добавлены `undici@^7.16.0` и `dotenv@^17.2.3`
    - Исправлены unit тесты для работы с новым HTTP клиентом
    - Обновлена документация package-ai-docs.md с новыми требованиями

## [0.4.4] - 2025-10-13

<small>13.10.2025 13:29</small>

### Fixed

- **Исправления CI/CD и GitHub Actions**
    - Исправлена логика извлечения ченжлога в GitHub Actions workflow
    - Убрана настройка ESLINT_USE_FLAT_CONFIG для macOS CI
    - Исправлена Windows-совместимость e2e тестов в CI
    - Исправлена проблема с ESLint на Windows в CI/CD
    - Улучшена стабильность e2e тестов в CI
    - Исправлено падение тестов в CI/CD пайплайне
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/af6dccfefab91fe701a98199bbba1b229a63e56c" target="_blank">af6dccf</a>

- **Исправления кроссплатформенности**
    - Исправлена кроссплатформенность тестов для Windows
    - Исправлены ошибки линтера в регулярных выражениях
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/169b3259bb81f004baf1c0f9a3a379423abec603" target="_blank">169b325</a>

### Added

- **Кроссплатформенное тестирование**
    - Добавлено тестирование на macOS для полной кроссплатформенности
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/85960cb489144ed2ca5163b42fda1a92ea9c04cc" target="_blank">85960cb</a>

### Changed

- **Улучшения CI/CD пайплайна**
    - Упрощена структура CI/CD пайплайна
    - Оптимизирован CI/CD пайплайн для лучшей логики и производительности
    - Улучшен CI/CD pipeline с параллельным тестированием и улучшенной обработкой релизов
    - Удалены избыточные пробелы в CI/CD пайплайне
    - Добавлена сборка пакета перед e2e тестами в CI
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/fe1caea1ef767b9d3bfefa0ebfbbec2eabb4dad9" target="_blank">fe1caea</a>

- **Рефакторинг кода и улучшения**
    - Улучшена валидация параметров в agents, tools и adapters
    - Оптимизированы проверки null/undefined в тестовых workflow helpers
    - Улучшен template rendering и обработка ошибок в error-handler
    - Упрощена логика проверок и catch блоков в helper функциях
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/526111f306e9f77d5fe84169855a03683d844af5" target="_blank">526111f</a>

### Debug

- **Отладка CI/CD**
    - Улучшена отладка для macOS CI проблемы с ESLint
    - Добавлена отладка рабочей директории для macOS CI
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/4ee96b30161960d9ceb1d51b5f72cd487558cd8e" target="_blank">4ee96b3</a>

## [0.4.3] - 2025-10-13

<small>13.10.2025 11:46</small>

### Changed

- **Обновление версии пакета**
    - Обновлена версия пакета до 0.4.3
    - <a href="https://github.com/CyberWalrus/mcp-validator/commit/37cc75e7cab151eb1b822d42c859e64ea4bc796a" target="_blank">37cc75e</a>

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
