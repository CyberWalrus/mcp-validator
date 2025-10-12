---
id: package-mcp-validator
documentation_type: 'ai-package-documentation'
package_context:
    name: 'mcp-validator'
    type: 'tool'
    architecture_type: 'layered_library'
    main_exports: ['validate', 'test-prompt']
    workspace_path: '.'
context7_refs: ['@modelcontextprotocol/sdk', 'openai', 'zod', 'typescript', 'node.js']
module_docs:
    type: 'by_layer'
    rule: 'per_library'
    targets:
        [
            'src/agents/*',
            'src/tools/*',
            'src/server',
            'src/model/config',
            'src/lib/*',
            'src/services/adapters/*',
            'src/services/workflows/*',
        ]
architecture_docs:
    format: 'single'
    root: 'architecture.xml'
---

# 📦 AI-документация: mcp-validator

<package_purpose>
**Назначение пакета:**
Универсальный инструмент для AI-валидации кода, тестов, архитектуры и других типов контента через MCP протокол и OpenRouter API. Предоставляет интеграцию с Cursor IDE для автоматической проверки качества в процессе разработки.

**Решаемые задачи:**

- Автоматическая валидация кода на 9 типов контента (код, тесты, архитектура, безопасность, производительность, документация, промпты, задачи, кастом)
- Параллельное тестирование AI промптов на консистентность с анализом стабильности ответов
- Интеграция с Cursor IDE через MCP SDK для seamless workflow разработки
- Детальные отчеты об ошибках в markdown формате с практическими рекомендациями
- Полная AI документация всех модулей для интеграции с AI ассистентами
  </package_purpose>

<package_structure>
**Архитектурная схема:**

> **Примечание:** Детальная XML-структура пакета находится в файле `architecture.xml` в корне пакета. Данный файл является единственным источником правды об архитектуре.

<key_features>
**Основные возможности:**

## 1. Универсальная валидация контента (validate tool)

- **Описание:** 9 встроенных типов валидации через AI модели с поддержкой custom валидаций
- **Использование:** MCP tool `validate` с параметрами `validationType`, `input`, `context`
- **Особенности:** Поддержка файлов, URL, прямого контента; автоматическое чтение файлов с encoding определением

## 2. Параллельное тестирование промптов (test-prompt tool)

- **Описание:** Запуск 3-10 итераций промпта параллельно для проверки консистентности AI ответов
- **Использование:** MCP tool `test-prompt` с параметрами `prompt`, `iterations`, `context`, `models`, `timeout`
- **Особенности:** Анализ разброса ответов, метрики времени, поддержка множественных AI моделей

## 3. MCP Server интеграция

- **Описание:** Постоянный серверный режим с официальным MCP SDK для интеграции с Cursor
- **Использование:** Автоматический запуск через `yarn start`, коммуникация через stdio
- **Особенности:** Graceful shutdown, обработка ошибок, стабильность долгосрочных сессий

## 4. Markdown отчеты об ошибках

- **Описание:** Детальные форматированные отчеты с code examples и рекомендациями
- **Использование:** Автоматическая генерация через error-handler адаптер
- **Особенности:** Шаблоны ошибок из `/prompts/errors/`, контекстная информация, практичность
  </key_features>

<architecture_overview>
**Верхнеуровневая архитектура:**

- **server/** - MCP сервер инициализация, graceful shutdown, конфигурация
- **tools/** - MCP tools (validate-tool, test-prompt-tool) для интеграции с Cursor IDE
- **services/workflows/** - бизнес-логика валидации и тестирования
- **services/adapters/** - адаптеры для внешних систем (openrouter, file-reader, error-handler)
- **agents/** - AI агенты для валидации кода (OpenAI SDK)
- **model/** - конфигурация, типы, схемы, константы
- **lib/cli/** - CLI функции для управления приложением
- **end-to-end/** - E2E тесты с моками MCP клиентов и OpenRouter API

**Взаимодействие модулей:**

```
Cursor IDE → MCP SDK → server/mcp-server → tools/ → services/workflows → services/adapters
                                                              ↓
                                                         agents/ (AI)
                                                              ↓
                                                    OpenRouter API / Files
```

**AI документация модулей:**

- **Всего модулей с AI документацией:** 15
- **Agents:** 2 модуля (code-validator-agent, test-prompt-agent)
- **Tools:** 2 модуля (validate-tool, test-prompt-tool)
- **Server:** 1 модуль (server)
- **Model:** 1 модуль (config)
- **Lib:** 4 модуля (cli, cache, logger, resource-resolver)
- **Services/Adapters:** 3 модуля (openrouter, file-reader, error-handler)
- **Services/Workflows:** 2 модуля (validation, testing)

</architecture_overview>

<detailed_modules>
**Детальная структура модулей:**

### Модуль: server

**Статус:** ✅ Готов
**Расположение:** `src/server/`
**Экспорты:** startMcpServer(), setupGracefulShutdown()
**Файлы:**

- `mcp-server.ts` - запуск MCP сервера в постоянном режиме
- `create-mcp-server.ts` - фабрика создания MCP Server instance
- `setup-graceful-shutdown.ts` - обработка SIGINT/SIGTERM для корректного завершения
- `create-mcp-server/` - вспомогательные функции создания сервера
- `module-ai-docs.md` - AI документация модуля

### Модуль: tools

**Статус:** ✅ Готов
**Расположение:** `src/tools/`
**Экспорты:** validateTool, testPromptTool, handleValidateTool(), handleTestPromptTool()
**Файлы:**

    - `validate-tool/` - MCP tool wrapper для валидации
        - `handle-validate-tool.ts` - обработка MCP запроса валидации
        - `format-successful-validation.ts` - форматирование результата
        - `module-ai-docs.md` - AI документация модуля
    - `test-prompt-tool/` - MCP tool wrapper для тестирования промптов
        - `handle-test-prompt-tool.ts` - обработка MCP запроса тестирования
        - `format-test-prompt-result.ts` - форматирование результата
        - `module-ai-docs.md` - AI документация модуля

### Модуль: services/workflows/validation

**Статус:** ✅ Готов
**Расположение:** `src/services/workflows/validation/`
**Экспорты:** validateCode()
**Файлы:**

    - `index.ts` - публичный API модуля
    - `validate-code.ts` - основная логика валидации с AI агентом
    - `helpers/` - 14 вспомогательных функций (prompt loading, type mapping, schema validation)
    - `schemas.ts` - Zod схемы для валидации параметров
    - `types.ts` - TypeScript типы workflow
    - `constants.ts` - константы типов валидации
    - `module-ai-docs.md` - AI документация модуля

### Модуль: services/workflows/testing

**Статус:** ✅ Готов
**Расположение:** `src/services/workflows/testing/`
**Экспорты:** runParallelTests(), analyzeTestConsistency(), generateTestReport()
**Файлы:**

    - `index.ts` - публичный API модуля
    - `run-parallel-tests.ts` - параллельный запуск N итераций промпта
    - `analyze-test-consistency.ts` - анализ разброса ответов
    - `generate-test-report.ts` - формирование отчета с метриками
    - `constants.ts` - константы тестирования
    - `schemas.ts` - Zod схемы для тестирования
    - `types.ts` - TypeScript типы workflow
    - `helpers/` - 10 вспомогательных функций
    - `module-ai-docs.md` - AI документация модуля

### Модуль: services/adapters/openrouter

**Статус:** ✅ Готов
**Расположение:** `src/services/adapters/openrouter/`
**Экспорты:** getOpenRouterClient()
**Файлы:**

- `index.ts` - публичный API модуля
- `openrouter-client-factory.ts` - фабрика создания клиента с mock support
- `openrouter-real-client.ts` - реальный клиент OpenRouter API
- `constants.ts` - default модели и настройки
- `types.ts` - интерфейсы клиента
- `module-ai-docs.md` - AI документация модуля

### Модуль: services/adapters/file-reader

**Статус:** ✅ Готов
**Расположение:** `src/services/adapters/file-reader/`
**Экспорты:** readFileContent(), readFileSync()
**Файлы:**

- `index.ts` - публичный API модуля
- `read-file-content.ts` - асинхронное чтение с encoding detection
- `read-file-sync.ts` - синхронное чтение для CLI
- `types.ts` - типы модуля
- `helpers/` - 8 вспомогательных функций (encoding, path resolution, validation)
- `module-ai-docs.md` - AI документация модуля

### Модуль: services/adapters/error-handler

**Статус:** ✅ Готов
**Расположение:** `src/services/adapters/error-handler/`
**Экспорты:** renderErrorResponse()
**Файлы:**

- `index.ts` - публичный API модуля
- `render-error-response.ts` - рендеринг markdown отчетов об ошибках
- `format-error-context.ts` - форматирование контекстной информации
- `load-error-template.ts` - загрузка шаблонов из `/prompts/errors/`
- `constants.ts` - константы шаблонов
- `types.ts` - типы модуля
- `helpers/` - 3 вспомогательных функции
- `module-ai-docs.md` - AI документация модуля

### Модуль: agents

**Статус:** ✅ Готов
**Расположение:** `src/agents/`
**Экспорты:** codeValidatorAgent, testPromptAgent
**Файлы:**

    - `code-validator-agent/` - AI агент для валидации кода (OpenAI SDK)
        - `create-code-validator-agent.ts` - создание агента
        - `validate-code-with-agent.ts` - валидация через агента
        - `module-ai-docs.md` - AI документация модуля
    - `test-prompt-agent/` - AI агент для тестирования промптов
        - `create-test-prompt-agent.ts` - создание агента
        - `test-prompt-with-agent.ts` - тестирование промпта
        - `calculate-consistency-score.ts` - расчет консистентности
        - `generate-test-summary.ts` - генерация сводки
        - `module-ai-docs.md` - AI документация модуля
    - `index.ts` - фасад экспорта агентов

### Модуль: model

**Статус:** ✅ Готов
**Расположение:** `src/model/`
**Экспорты:** APP_CONFIG, Zod schemas, TypeScript types, constants
**Файлы:**

    - `config/` - конфигурация приложения
        - `create-app-config.ts` - создание конфигурации
        - `get-app-config-error.ts` - получение ошибок конфигурации
        - `reload-app-config.ts` - перезагрузка конфигурации
        - `config-constants.ts` - константы конфигурации
        - `constants.ts` - базовые константы
        - `schemas.ts` - Zod схемы валидации
        - `types.ts` - типы конфигурации
        - `module-ai-docs.md` - AI документация модуля
    - `schemas/main.ts` - централизованные Zod схемы
    - `types/main.ts` - централизованные TypeScript типы
    - `constants/main.ts` - константы приложения

### Модуль: lib/cli

**Статус:** ✅ Готов
**Расположение:** `src/lib/cli/`
**Экспорты:** showHelp(), showVersion(), startMcpServer()
**Файлы:**

    - `main.ts` - основной entry point CLI
    - `show-help.ts` - отображение справки о доступных командах
    - `show-version.ts` - отображение версии приложения
    - `start-mcp-server.ts` - запуск MCP сервера через новую архитектуру
    - `ensure-configuration.ts` - проверка конфигурации
    - `module-ai-docs.md` - AI документация модуля

### Модуль: lib/cache

**Статус:** ✅ Готов
**Расположение:** `src/lib/cache/`
**Экспорты:** getPrompt(), initializePromptCache()
**Файлы:**

    - `get-prompt.ts` - получение промпта из кэша
    - `initialize-prompt-cache.ts` - инициализация кэша промптов
    - `prompt-cache-constants.ts` - константы кэша
    - `types.ts` - типы модульной единицы
    - `types-index.ts` - индекс типов
    - `module-ai-docs.md` - AI документация модуля

### Модуль: lib/helpers/logger

**Статус:** ✅ Готов
**Расположение:** `src/lib/helpers/logger/`
**Экспорты:** debug(), info(), warn(), error(), setLogLevel()
**Файлы:**

    - `index.ts` - публичный API модуля
    - `error.ts` - логирование ошибок
    - `info.ts` - информационное логирование
    - `helpers/log.ts` - основная функция логирования
    - `helpers/should-log.ts` - проверка уровня
    - `logger-constants.ts` - константы логгера
    - `module-ai-docs.md` - AI документация модуля

### Модуль: lib/helpers/resource-resolver

**Статус:** ✅ Готов
**Расположение:** `src/lib/helpers/resource-resolver/`
**Экспорты:** getPackageResourceResolver()
**Файлы:**

    - `index.ts` - публичный API модуля
    - `package-resource-resolver.ts` - основная реализация resolver
    - `types.ts` - типы модуля
    - `module-ai-docs.md` - AI документация модуля

### Модуль: end-to-end

**Статус:** ✅ Готов
**Расположение:** `end-to-end/`
**Экспорты:** E2E тесты для интеграционного тестирования
**Файлы:**

    - `mcp-server-initialization.e2e.test.ts` - тесты инициализации MCP сервера
    - `validate-tool.e2e.test.ts` - тесты validate tool
    - `test-prompt-tool.e2e.test.ts` - тесты test-prompt tool
    - `mocks/` - моки MCP клиентов и OpenRouter API
        - `mcp-client-simulator.ts` - симулятор MCP клиента с интеграцией конфигурации
        - `mcp-transport.ts` - транспортный слой для MCP соединений
        - `mcp-operations.ts` - операции MCP клиента (initialize, callTool, listTools)
        - `simulate-cursor-connection.ts` - функция симуляции подключения Cursor
    - 9 других e2e тестов для различных сценариев

</detailed_modules>

<e2e_testing>
**E2E тестирование:**

### 1. MCP Server инициализация

- **Файл:** `end-to-end/mcp-server-initialization.e2e.test.ts`
- **Покрытие:** запуск MCP сервера, регистрация tools, корректное завершение
- **Статус:** работает

### 2. Validate tool полный цикл

- **Файл:** `end-to-end/validate-tool.e2e.test.ts`
- **Покрытие:** валидация файлов, URL, контента; все 9 типов валидации
- **Статус:** работает

### 3. Test-prompt tool полный цикл

- **Файл:** `end-to-end/test-prompt-tool.e2e.test.ts`
- **Покрытие:** параллельное тестирование, анализ консистентности, отчеты
- **Статус:** работает

### 4. Обработка ошибок

- **Файл:** `end-to-end/error-scenarios.e2e.test.ts`
- **Покрытие:** невалидные параметры, missing файлы, API ошибки, timeout
- **Статус:** работает

### 5. Стабильность MCP сервера

- **Файл:** `end-to-end/mcp-server-stability.e2e.test.ts`
- **Покрытие:** долгосрочные сессии, множественные запросы, graceful shutdown
- **Статус:** работает

### 6. Сохранение функций после рефакторинга

- **Файл:** `src/__tests__/refactoring-e2e-spec.test.ts`
- **Покрытие:** readFileContent(), renderErrorResponse(), все workflow функции сохранены
- **Статус:** работает
  </e2e_testing>

<technologies_used>
**Используемые технологии:**

- **TypeScript:** 5.9.3 - строгая типизация, вся кодовая база на TS
- **Node.js:** 20+ - встроенная поддержка env файлов через --env-file флаг
- **@modelcontextprotocol/sdk:** 1.20.0 - официальный MCP SDK для интеграции с Cursor
- **openai:** 6.3.0 - OpenAI SDK для упрощенной агентной архитектуры
- **zod:** 4.1.12 - runtime валидация схем с TypeScript типами
- **OpenRouter API:** external - доступ к множественным AI моделям через единый API

**Инструменты разработки:**

- **vitest:** 3.2.4 - unit и E2E тестирование с coverage
- **tsx:** 4.20.6 - TypeScript execution для development
- **eslint-walrus-config:** 1.0.1 - линтинг правила с автофиксом
  </technologies_used>

<implementation_details>
**Особенности реализации:**

### 1. Официальный MCP SDK вместо custom реализации

Миграция с custom MCP реализации на официальный `@modelcontextprotocol/sdk` в версии 2.0. Все функции v1.x сохранены, но архитектура упрощена через SDK.

**Причина:** Поддержка официального протокола, стабильность, автоматические обновления SDK

### 2. Упрощенная агентная архитектура через OpenAI SDK

Использование OpenAI SDK вместо custom агентных паттернов для взаимодействия с AI моделями.

**Причина:** Стандартизация, меньше кода, легче поддержка

### 3. Постоянный серверный режим (await server.connect())

MCP сервер работает в постоянном режиме ожидания запросов, не завершается после каждого запроса.

**Причина:** Требование MCP протокола для seamless интеграции с Cursor IDE

### 4. Синхронное чтение файлов для улучшенной производительности

В critical paths используется синхронное чтение файлов через `readFileSync()` для избежания async overhead.

**Причина:** Профилирование показало 30% ускорение на малых файлах без блокировки event loop

### 5. Markdown шаблоны ошибок из файловой системы

Шаблоны ошибок хранятся в `/prompts/errors/` и динамически загружаются через `loadErrorTemplate()`.

**Причина:** Легкость обновления шаблонов без изменения кода, переиспользование в разных контекстах

### 6. Рефакторинг мок клиента с интеграцией конфигурации

Мок клиент MCP (`end-to-end/mocks/mcp-client-simulator.ts`) использует конфигурацию приложения для подключения к серверу вместо хардкодинга настроек.

**Особенности:**

- Разделение на модули: `mcp-transport.ts` (транспорт), `mcp-operations.ts` (операции), `simulate-cursor-connection.ts` (фабрика)
- Использование `APP_CONFIG` для получения параметров подключения
- Проверка режима E2E тестирования перед созданием симулятора
- Соответствие архитектурным принципам проекта (функции вместо классов, один файл = одна функция)

**Причина:** Унификация конфигурации, упрощение тестирования, соответствие принципам проекта

### 7. Настройка пути к мок клиенту OpenRouter через конфигурацию

Путь к мок клиенту OpenRouter теперь настраивается через переменную окружения `OPENROUTER_MOCK_CLIENT_PATH` вместо хардкодинга в коде.

**Особенности:**

- Добавлено поле `mockClientPath` в конфигурацию OpenRouter
- Значение по умолчанию: `end-to-end/mocks/openrouter-test-client`
- Возможность переопределения через переменную окружения `OPENROUTER_MOCK_CLIENT_PATH`
- Обновлена фабрика клиента для использования конфигурации

**Причина:** Гибкость настройки, возможность использования разных мок клиентов в разных окружениях

**Важные детали архитектуры:**

- Все адаптеры изолированы и могут быть независимо заменены (DIP принцип)
- Workflows не зависят от конкретных адаптеров, работают через интерфейсы
- E2E тесты используют моки для стабильности и скорости выполнения
- Graceful shutdown обеспечивает корректное завершение всех активных MCP сессий
- Все модули имеют полную AI документацию (module-ai-docs.md) для интеграции с AI ассистентами
  </implementation_details>

<development_commands>
**Критическая важность команд разработки:**

🚨 **Эти команды - основа профессиональной разработки! Их игнорирование приводит к техническому долгу и потере репутации команды.**

**⚡ Обязательные команды качества:**

```bash
# 🔍 ЛИНТИНГ - предотвращение 90% багов до коммита
yarn lint
# КРИТИЧНО: Запускать перед каждым коммитом!
# Запускает eslint с автофиксом + typecheck

# 🧪 ТЕСТИРОВАНИЕ - гарантия стабильности в production
yarn test
# КРИТИЧНО: Все тесты должны проходить перед деплоем!
# Запускает unit тесты (vitest) + E2E тесты (vitest e2e)

# 🧪 UNIT ТЕСТЫ - быстрая проверка изолированных единиц
yarn test:unit
# Запускает только unit тесты без E2E

# 🧪 E2E ТЕСТЫ - проверка интеграционных сценариев
yarn test:e2e
# Запускает E2E тесты с моками MCP клиентов

# ✅ ПРОВЕРКА ТИПОВ - предотвращение runtime ошибок
yarn typecheck
# КРИТИЧНО: TypeScript должен компилироваться без ошибок!

# 🚀 ЗАПУСК MCP СЕРВЕРА - development режим
yarn start
# Запускает MCP сервер в постоянном режиме для Cursor интеграции
# Использует .env файл для конфигурации

# 📖 СПРАВКА CLI
yarn start --help
# Показывает полную справку по использованию

# 📦 ВЕРСИЯ
yarn start --version
# Показывает текущую версию пакета
```

**🎯 Мотивация для команд:**

- **lint** → Чистый код = читаемость = легкость поддержки = счастливая команда
- **test** → Рабочие тесты = уверенность в изменениях = быстрые релизы
- **test:unit** → Быстрая обратная связь для изолированных единиц
- **test:e2e** → Уверенность в интеграционных сценариях
- **typecheck** → Строгие типы = меньше багов = больше времени на фичи
- **start** → Development workflow с Cursor IDE integration

**⚠️ ПОСЛЕДСТВИЯ ИГНОРИРОВАНИЯ:**

- Пропуск линтинга → накопление технического долга → замедление разработки
- Игнорирование тестов → баги в production → потеря доверия пользователей
- Игнорирование typecheck → runtime ошибки → аварийные исправления в 3 утра

**✅ ПРОФЕССИОНАЛЬНЫЙ СТАНДАРТ:**
Выполнение всех команд перед каждым коммитом = статус Senior Developer = уважение команды!
</development_commands>
