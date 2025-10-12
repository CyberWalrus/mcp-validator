---
id: architecture-server-fsd
type: reference
use_cases: ['server_fsd_architecture', 'backend_apps', 'api_servers', 'cli_tools', 'microservices']
prompt_language: ru
response_language: ru
alwaysApply: false
---

# Server FSD — FSD для серверных приложений

[REFERENCE-BEGIN]

## TIER 1: Expert Role

<expert_role>
You are a Server FSD Architecture Specialist for TypeScript backend projects.

Responsibilities:

- Enforce Server FSD architecture rules with zero exceptions
- Ensure flexible layer naming adapted for backend (controllers, services, models)
- Validate modular units with facades and segments for complex modules
- Guide prohibition of cross-imports within layers
- Prioritize encapsulation and custom layer hierarchy for server applications

**ВАЖНО: Все ответы должны быть на русском языке.**
</expert_role>

<expert_completion_criteria>
Expert role clearly defines responsibilities specific to Server FSD architecture and includes Russian language requirement for responses.
</expert_completion_criteria>

## TIER 2: Назначение и применение

<exception_handling>
При работе с Server FSD архитектурой возможны следующие исключительные ситуации:

- Проект превышает лимит слоёв (более 7) → упрощение или миграция на layered_library
- Нарушение иерархии → немедленное корректировка зависимостей между слоями
- Смешивание фронтенд/бэкенд слоёв → строгая проверка на серверные слои (controllers, services)
- Неопределенность в именовании слоёв → приоритет осмысленным названиям по предметной области

Приоритеты исправления:

1. **Критичные:** Немедленно исправить (кросс-импорты в слоях)
2. **Средние:** Планировать рефакторинг слоёв
3. **Низкие:** Документировать кастомные слои
   </exception_handling>

<algorithm_motivation>
Server FSD архитектура адаптирует принципы FSD для серверных приложений, обеспечивая гибкую слоистость и модульность, что упрощает масштабирование бэкенда без нарушения инкапсуляции.
</algorithm_motivation>

<cognitive_triggers>
Давайте пошагово определим, подходит ли проект для Server FSD архитектуры, проанализировав тип приложения, слои и модульность.
</cognitive_triggers>

<architecture_scope>
Server FSD — FSD-подобная архитектура для серверных и консольных приложений с произвольными именами слоёв, адаптированными под бэкенд. Внутри слоёв — модульные единицы с фасадами и сегментами.
**Назначение:** Node.js серверы, API, CLI, микросервисы.
**Ключевой принцип:** Гибкие слои (controllers, services), запрет кросс-импортов, фасады для модулей.
</architecture_scope>

<scope_completion_criteria>
Architecture scope clearly defines purpose, key principle, and decision criteria for Server FSD usage.
</scope_completion_criteria>

### Алгоритм определения архитектуры

<algorithm_steps>

1. **Анализ типа:** Определи, является ли проект серверным/CLI (Node.js, Express, CLI)
2. **Подсчет слоёв:**
    - Unix/Linux: `find src -type d -maxdepth 1 | grep -v __tests__ | wc -l` (исключая src)
    - Проверь наличие серверных слоёв (controllers, services)
3. **Оценка модульности:** Проверь фасады в модулях и отсутствие кросс-импортов
4. **Принятие решения:** Применяй правила выбора архитектуры

</algorithm_steps>

Если проект содержит:

- ✓ Серверный/CLI код без UI
- ✓ 3–7 кастомных слоёв (controllers, services, models)
- ✓ Модульные единицы с фасадами
- ✓ Отсутствие кросс-импортов в слоях

### → Server FSD

Иначе → layered_library (для библиотек) или fsd_standard (для фронтенда)

<step_completion_criteria>
Алгоритм четко структурирован с пошаговыми инструкциями и критериями принятия решений для Server FSD.
</step_completion_criteria>

<exception_handling>

Если слои в пограничной зоне (2–3), проведи дополнительный анализ:

- Если слои тематически серверные → Server FSD
- Если универсальные → layered_library
- При сомнениях → выбери Server FSD для бэкенда

Если слоёв более 7 → обязательно упростить или разделить проект.

</exception_handling>

### Быстрая проверка пригодности

| **Условие** | **✅ Подходит**                | **❌ Не подходит**     |
| ----------- | ------------------------------ | ---------------------- |
| Тип проекта | Сервер/CLI (Node.js, API)      | Фронтенд/UI            |
| Слои        | 3–7 кастомных (controllers)    | FSD-стандарт или <3    |
| Модульность | С фасадами, без кросс-импортов | Плоская структура      |
| Назначение  | API серверы, микросервисы      | Библиотеки компонентов |

### Основные характеристики

- **Серверная адаптация:** Слои адаптированы под бэкенд (controllers, services, models, routes)
- **Гибкая слоистость:** Произвольные имена слоёв по потребностям проекта
- **Модульные единицы:** Каждый модуль имеет фасад `index.ts`
- **Запрет кросс-импортов:** Модули одного слоя не импортируют друг друга
- **Сегментация:** Сложные модули разделяются на сегменты
- **Точка входа:** `src/index.ts` или `src/app/index.ts`

### Типичные серверные слои

| **Слой**       | **Назначение**           | **Содержимое**                 |
| -------------- | ------------------------ | ------------------------------ |
| `controllers`  | HTTP контроллеры и роуты | REST API endpoints, middleware |
| `services`     | Бизнес-логика и сервисы  | Бизнес-процессы, workflow      |
| `models`       | Модели данных и схемы    | TypeScript типы, Zod схемы     |
| `repositories` | Доступ к данным          | Database queries, ORM          |
| `middleware`   | Промежуточное ПО         | Auth, logging, validation      |
| `config`       | Конфигурация приложения  | Environment, settings          |
| `utils`        | Утилиты и хелперы        | Вспомогательные функции        |
| `adapters`     | Адаптеры внешних систем  | External API clients           |
| `gateways`     | Шлюзы к внешним сервисам | Database, message queues       |

## TIER 3: Структура проекта

<output_format>

При описании структуры проекта используй XML-схему с четкими ролями файлов и их назначением. Для каждого элемента указывай:

- `name` — имя файла/директории
- `role` — роль (layer, module, facade, segment, function, types, unit_test)
- `purpose` — назначение
- `exports` — что экспортирует (для фасадов)

</output_format>

<cognitive_triggers>
Давайте пошагово разберем обязательную структуру Server FSD, начиная с слоёв, добавляя модули и сегменты.
</cognitive_triggers>

### Базовая структура

```xml
<package_root>
  <source_directory name="src">
    <entrypoint name="index.ts" purpose="Точка входа сервера" />
    <layer name="controllers" purpose="HTTP контроллеры">
      <module name="auth">
        <facade name="index.ts" role="unit_facade" purpose="Фасад модуля" exports="authController" />
        <file name="auth-controller.ts" role="function" purpose="Контроллер аутентификации" />
        <segment name="middleware" purpose="Middleware">
          <file name="auth-middleware.ts" role="function" purpose="Middleware аутентификации" />
        </segment>
        <directory name="__tests__" purpose="Тесты модуля">
          <test name="auth.test.ts" role="unit_test" />
        </directory>
      </module>
      <module name="users">
        <facade name="index.ts" role="unit_facade" exports="usersController" />
        <file name="users-controller.ts" role="function" purpose="Контроллер пользователей" />
        <directory name="__tests__">
          <test name="users.test.ts" role="unit_test" />
        </directory>
      </module>
    </layer>
    <layer name="services" purpose="Бизнес-логика">
      <module name="auth-service">
        <facade name="index.ts" role="unit_facade" exports="authService" />
        <segment name="workflows" purpose="Процессы">
          <file name="login-workflow.ts" role="workflow" purpose="Workflow логина" />
        </segment>
        <directory name="__tests__">
          <test name="auth-service.test.ts" role="unit_test" />
        </directory>
      </module>
      <module name="user-service">
        <facade name="index.ts" role="unit_facade" exports="userService" />
        <segment name="workflows" purpose="Процессы">
          <file name="user-workflow.ts" role="workflow" />
        </segment>
        <directory name="__tests__">
          <test name="user-service.test.ts" role="unit_test" />
        </directory>
      </module>
    </layer>
    <layer name="models" purpose="Модели данных">
      <module name="user">
        <facade name="index.ts" role="unit_facade" exports="type User" />
        <file name="user-types.ts" role="types" purpose="Типы пользователя" />
        <file name="user-schemas.ts" role="schemas" purpose="Схемы пользователя" />
        <directory name="__tests__">
          <test name="user.test.ts" role="unit_test" />
        </directory>
      </module>
      <module name="auth">
        <facade name="index.ts" role="unit_facade" exports="type AuthData" />
        <file name="auth-types.ts" role="types" />
        <directory name="__tests__">
          <test name="auth.test.ts" role="unit_test" />
        </directory>
      </module>
    </layer>
    <layer name="repositories" purpose="Доступ к данным">
      <module name="user-repository">
        <facade name="index.ts" role="unit_facade" exports="userRepository" />
        <segment name="queries" purpose="Запросы">
          <file name="user-queries.ts" role="function" purpose="Запросы к БД" />
        </segment>
        <directory name="__tests__">
          <test name="user-repository.test.ts" role="unit_test" />
        </directory>
      </module>
      <module name="auth-repository">
        <facade name="index.ts" role="unit_facade" exports="authRepository" />
        <segment name="queries" purpose="Запросы">
          <file name="auth-queries.ts" role="function" />
        </segment>
        <directory name="__tests__">
          <test name="auth-repository.test.ts" role="unit_test" />
        </directory>
      </module>
    </layer>
    <layer name="middleware" purpose="Промежуточное ПО">
      <module name="auth">
        <facade name="index.ts" role="unit_facade" exports="authMiddleware" />
        <file name="auth-middleware.ts" role="function" purpose="Middleware аутентификации" />
        <directory name="__tests__">
          <test name="auth-middleware.test.ts" role="unit_test" />
        </directory>
      </module>
      <module name="logging">
        <facade name="index.ts" role="unit_facade" exports="loggingMiddleware" />
        <file name="logging-middleware.ts" role="function" purpose="Middleware логирования" />
        <directory name="__tests__">
          <test name="logging.test.ts" role="unit_test" />
        </directory>
      </module>
    </layer>
    <layer name="config" purpose="Конфигурация">
      <module name="database">
        <facade name="index.ts" role="unit_facade" exports="dbConfig" />
        <directory name="__tests__">
          <test name="db-config.test.ts" role="unit_test" />
        </directory>
      </module>
      <module name="app">
        <facade name="index.ts" role="unit_facade" exports="appConfig" />
        <directory name="__tests__">
          <test name="app-config.test.ts" role="unit_test" />
        </directory>
      </module>
    </layer>
    <layer name="utils" purpose="Утилиты">
      <module name="validation">
        <facade name="index.ts" role="unit_facade" exports="validateInput" />
        <directory name="__tests__">
          <test name="validation.test.ts" role="unit_test" />
        </directory>
      </module>
      <module name="helpers">
        <facade name="index.ts" role="unit_facade" exports="formatDate" />
        <directory name="__tests__">
          <test name="helpers.test.ts" role="unit_test" />
        </directory>
      </module>
    </layer>
  </source_directory>
</package_root>
```

<structure_completion_criteria>
Структура четко определена с XML-схемой, ролями элементов и их назначением для Server FSD.
</structure_completion_criteria>

### Пример архитектуры для консольного приложения

```xml
<package_root>
  <source_directory name="src">
    <entrypoint name="index.ts" purpose="Точка входа CLI" />
    <layer name="commands" purpose="CLI команды">
      <module name="migrate">
        <facade name="index.ts" role="unit_facade" exports="migrateCommand" />
        <file name="migrate-command.ts" role="workflow" />
        <segment name="handlers" purpose="Обработчики">
          <file name="database-migrate.ts" role="function" />
        </segment>
        <directory name="__tests__">
          <test name="migrate.test.ts" role="unit_test" />
        </directory>
      </module>
      <module name="seed">
        <facade name="index.ts" role="unit_facade" exports="seedCommand" />
        <file name="seed-command.ts" role="workflow" />
        <directory name="__tests__">
          <test name="seed.test.ts" role="unit_test" />
        </directory>
      </module>
    </layer>
    <layer name="services" purpose="Бизнес-сервисы">
      <module name="database">
        <facade name="index.ts" role="unit_facade" exports="dbService" />
        <file name="connection.ts" role="function" />
        <segment name="migrations" purpose="Миграции">
          <file name="migration-runner.ts" role="workflow" />
        </segment>
        <directory name="__tests__">
          <test name="db-service.test.ts" role="unit_test" />
        </directory>
      </module>
      <module name="file-system">
        <facade name="index.ts" role="unit_facade" exports="fsService" />
        <directory name="__tests__">
          <test name="fs-service.test.ts" role="unit_test" />
        </directory>
      </module>
    </layer>
    <layer name="models" purpose="Модели">
      <module name="migration">
        <facade name="index.ts" role="unit_facade" exports="type Migration" />
        <file name="migration-types.ts" role="types" />
        <directory name="__tests__">
          <test name="migration.test.ts" role="unit_test" />
        </directory>
      </module>
      <module name="config">
        <facade name="index.ts" role="unit_facade" exports="type Config" />
        <file name="config-types.ts" role="types" />
        <directory name="__tests__">
          <test name="config.test.ts" role="unit_test" />
        </directory>
      </module>
    </layer>
    <layer name="adapters" purpose="Адаптеры">
      <module name="database">
        <facade name="index.ts" role="unit_facade" exports="postgresAdapter" />
        <file name="postgres-adapter.ts" role="function" />
        <directory name="__tests__">
          <test name="db-adapter.test.ts" role="unit_test" />
        </directory>
      </module>
      <module name="file-system">
        <facade name="index.ts" role="unit_facade" exports="fsAdapter" />
        <file name="fs-adapter.ts" role="function" />
        <directory name="__tests__">
          <test name="fs-adapter.test.ts" role="unit_test" />
        </directory>
      </module>
    </layer>
    <layer name="config" purpose="Конфигурация">
      <module name="cli">
        <facade name="index.ts" role="unit_facade" exports="cliConfig" />
        <file name="cli-config.ts" role="config" />
        <directory name="__tests__">
          <test name="cli-config.test.ts" role="unit_test" />
        </directory>
      </module>
      <module name="app">
        <facade name="index.ts" role="unit_facade" exports="appConfig" />
        <file name="app-config.ts" role="config" />
        <directory name="__tests__">
          <test name="app-config.test.ts" role="unit_test" />
        </directory>
      </module>
    </layer>
    <layer name="utils" purpose="Утилиты">
      <module name="logger">
        <facade name="index.ts" role="unit_facade" exports="logger" />
        <directory name="__tests__">
          <test name="logger.test.ts" role="unit_test" />
        </directory>
      </module>
      <module name="helpers">
        <facade name="index.ts" role="unit_facade" exports="formatDate" />
        <directory name="__tests__">
          <test name="helpers.test.ts" role="unit_test" />
        </directory>
      </module>
    </layer>
  </source_directory>
</package_root>
```

## TIER 4: Правила и ограничения

### ✅ Требования

- [ ] **Фасады модулей:** У каждого модуля есть `index.ts` как Public API
- [ ] **Запрет кросс-импортов:** Модули одного слоя не импортируют друг друга
- [ ] **Сегментная организация:** Сложные модули разделяются на сегменты
- [ ] **Именованные экспорты:** Только именованные экспорты
- [ ] **Инкапсуляция:** Внутренние детали модулей скрыты
- [ ] **Тесты рядом:** Тесты в `__tests__/` на уровне модулей

### ❌ Запрещено

- Кросс-импорты между модулями одного слоя
- Прямой импорт из внутренних частей модулей
- Экспорт вспомогательных элементов через главные фасады
- `Default` экспорты
- Циклические зависимости между слоями

### Рекомендации по слоям

- **Определи иерархию:** Установи чёткую иерархию зависимостей между слоями
- **Документируй правила:** Явно опиши в команде, какой слой от какого может зависеть
- **Ограничь количество:** Не более 5-7 слоёв для поддержания простоты
- **Осмысленные названия:** Используй термины предметной области проекта

### Risk Assessment

<cognitive_triggers>
Давайте проанализируем потенциальные риски при использовании Server FSD архитектуры и способы их смягчения.
</cognitive_triggers>

**Потенциальные проблемы и решения:**

| **Риск**                  | **Симптомы**                | **Смягчение**                                         |
| ------------------------- | --------------------------- | ----------------------------------------------------- |
| Нарушение иерархии слоёв  | Неправильные зависимости    | ESLint: правила импортов по слоям + граф зависимостей |
| Превышение слоёв          | >7 слоёв, сложность         | Упрощение или миграция на layered_library             |
| Кросс-импорты в слоях     | Импорты между модулями слоя | Запрет в ESLint + рефакторинг модулей                 |
| Неосмысленные имена слоёв | Смешение ответственностей   | Документация + team review слоёв                      |

<risk_completion_criteria>
Risk Assessment содержит конкретные риски, их симптомы и способы смягчения для Server FSD.
</risk_completion_criteria>

## TIER 5: Примеры использования

### API сервер с контроллерами и сервисами

**Описание:** REST API сервер для аутентификации пользователей

```xml
<package_root>
  <source_directory name="src">
    <entrypoint name="index.ts" purpose="Точка входа сервера" />
    <layer name="controllers" purpose="HTTP контроллеры">
      <module name="auth">
        <facade name="index.ts" role="unit_facade" exports="authController" />
        <file name="auth-controller.ts" role="function" purpose="Контроллер аутентификации" />
        <segment name="middleware" purpose="Middleware">
          <file name="auth-middleware.ts" role="function" purpose="Middleware аутентификации" />
        </segment>
        <directory name="__tests__">
          <test name="auth.test.ts" role="unit_test" />
        </directory>
      </module>
    </layer>
    <layer name="services" purpose="Бизнес-логика">
      <module name="auth-service">
        <facade name="index.ts" role="unit_facade" exports="authService" />
        <segment name="workflows" purpose="Процессы">
          <file name="login-workflow.ts" role="workflow" purpose="Workflow логина" />
        </segment>
        <directory name="__tests__">
          <test name="auth-service.test.ts" role="unit_test" />
        </directory>
      </module>
    </layer>
    <layer name="models" purpose="Модели данных">
      <module name="user">
        <facade name="index.ts" role="unit_facade" exports="type User" />
        <file name="user-types.ts" role="types" />
        <file name="user-schemas.ts" role="schemas" />
        <directory name="__tests__">
          <test name="user.test.ts" role="unit_test" />
        </directory>
      </module>
    </layer>
    <layer name="repositories" purpose="Доступ к данным">
      <module name="user-repository">
        <facade name="index.ts" role="unit_facade" exports="userRepository" />
        <segment name="queries" purpose="Запросы">
          <file name="user-queries.ts" role="function" />
        </segment>
        <directory name="__tests__">
          <test name="user-repository.test.ts" role="unit_test" />
        </directory>
      </module>
    </layer>
  </source_directory>
</package_root>
```

### CLI утилита для миграций БД

**Описание:** Консольное приложение для управления миграциями

```xml
<package_root>
  <source_directory name="src">
    <entrypoint name="index.ts" purpose="Точка входа CLI" />
    <layer name="commands" purpose="CLI команды">
      <module name="migrate">
        <facade name="index.ts" role="unit_facade" exports="migrateCommand" />
        <file name="migrate-command.ts" role="workflow" />
        <segment name="handlers" purpose="Обработчики">
          <file name="database-migrate.ts" role="function" />
        </segment>
        <directory name="__tests__">
          <test name="migrate.test.ts" role="unit_test" />
        </directory>
      </module>
      <module name="seed">
        <facade name="index.ts" role="unit_facade" exports="seedCommand" />
        <file name="seed-command.ts" role="workflow" />
        <directory name="__tests__">
          <test name="seed.test.ts" role="unit_test" />
        </directory>
      </module>
    </layer>
    <layer name="services" purpose="Бизнес-сервисы">
      <module name="database">
        <facade name="index.ts" role="unit_facade" exports="dbService" />
        <file name="connection.ts" role="function" />
        <segment name="migrations" purpose="Миграции">
          <file name="migration-runner.ts" role="workflow" />
        </segment>
        <directory name="__tests__">
          <test name="db-service.test.ts" role="unit_test" />
        </directory>
      </module>
      <module name="file-system">
        <facade name="index.ts" role="unit_facade" exports="fsService" />
        <directory name="__tests__">
          <test name="fs-service.test.ts" role="unit_test" />
        </directory>
      </module>
    </layer>
    <layer name="models" purpose="Модели">
      <module name="migration">
        <facade name="index.ts" role="unit_facade" exports="type Migration" />
        <file name="migration-types.ts" role="types" />
        <directory name="__tests__">
          <test name="migration.test.ts" role="unit_test" />
        </directory>
      </module>
      <module name="config">
        <facade name="index.ts" role="unit_facade" exports="type Config" />
        <file name="config-types.ts" role="types" />
        <directory name="__tests__">
          <test name="config.test.ts" role="unit_test" />
        </directory>
      </module>
    </layer>
    <layer name="adapters" purpose="Адаптеры">
      <module name="database">
        <facade name="index.ts" role="unit_facade" exports="postgresAdapter" />
        <file name="postgres-adapter.ts" role="function" />
        <directory name="__tests__">
          <test name="db-adapter.test.ts" role="unit_test" />
        </directory>
      </module>
      <module name="file-system">
        <facade name="index.ts" role="unit_facade" exports="fsAdapter" />
        <file name="fs-adapter.ts" role="function" />
        <directory name="__tests__">
          <test name="fs-adapter.test.ts" role="unit_test" />
        </directory>
      </module>
    </layer>
    <layer name="config" purpose="Конфигурация">
      <module name="cli">
        <facade name="index.ts" role="unit_facade" exports="cliConfig" />
        <file name="cli-config.ts" role="config" />
        <directory name="__tests__">
          <test name="cli-config.test.ts" role="unit_test" />
        </directory>
      </module>
      <module name="app">
        <facade name="index.ts" role="unit_facade" exports="appConfig" />
        <file name="app-config.ts" role="config" />
        <directory name="__tests__">
          <test name="app-config.test.ts" role="unit_test" />
        </directory>
      </module>
    </layer>
    <layer name="utils" purpose="Утилиты">
      <module name="logger">
        <facade name="index.ts" role="unit_facade" exports="logger" />
        <directory name="__tests__">
          <test name="logger.test.ts" role="unit_test" />
        </directory>
      </module>
      <module name="helpers">
        <facade name="index.ts" role="unit_facade" exports="formatDate" />
        <directory name="__tests__">
          <test name="helpers.test.ts" role="unit_test" />
        </directory>
      </module>
    </layer>
  </source_directory>
</package_root>
```

**Примечание:** Слои адаптированы для CLI; тесты рядом с модулями.

## TIER 6: XML-схема для валидатора

```xml
<package_root>
  <source_directory name="src">
    <entrypoint name="index.ts" />
    <layer name="controllers" purpose="HTTP контроллеры">
      <module name="auth">
        <facade name="index.ts" role="unit_facade" />
        <file name="auth-controller.ts" role="function" />
        <test name="__tests__/auth-controller.test.ts" role="unit_test" />
      </module>
    </layer>
    <layer name="services" purpose="бизнес-логика">
      <module name="auth-service">
        <facade name="index.ts" role="unit_facade" />
        <segment name="workflows" purpose="процессы">
          <file name="login-workflow.ts" role="workflow" />
        </segment>
      </module>
    </layer>
    <layer name="platform" purpose="инфраструктура">
      <module name="http-client">
        <facade name="index.ts" role="unit_facade" />
        <file name="client.ts" role="function" />
        <test name="__tests__/client.test.ts" role="unit_test" />
      </module>
    </layer>
  </source_directory>
</package_root>
```

## TIER 7: Метаданные для валидатора

### Полная валидация

```xml
<architecture_metadata version="1" language="ts">
  <architecture_type>server_fsd</architecture_type>
  <scope>full</scope>
  <module_units>
    <unit path="src/presentation/auth" layer="presentation" />
    <unit path="src/business/auth-service" layer="business" />
    <unit path="src/platform/http-client" layer="platform" />
  </module_units>
  <entrypoints>
    <entrypoint path="src/index.ts" />
  </entrypoints>
  <ruleset>morj-2025-09</ruleset>
</architecture_metadata>
```

### Частичная валидация

```xml
<architecture_metadata version="1" language="ts">
  <architecture_type>server_fsd</architecture_type>
  <scope>partial</scope>
  <partial_root>src/presentation/auth</partial_root>
  <module_units>
    <unit path="src/presentation/auth" layer="presentation" />
  </module_units>
  <entrypoints>
    <entrypoint path="src/index.ts" />
  </entrypoints>
  <ruleset>morj-2025-09</ruleset>
</architecture_metadata>
```

## TIER 8: Применимость и валидация

### ✅ Подходит для

- **Серверных приложений** (Node.js, Express, Fastify, NestJS)
- **Консольных приложений** (CLI утилиты, скрипты)
- **API серверов** с REST/GraphQL endpoints
- **Микросервисов** с собственной архитектурой
- **Backend библиотек** и SDK
- **Проектов с уникальными архитектурными требованиями**
- **Команд с установленными практиками именования слоёв**

### ❌ Не подходит для

- **Фронтенд приложений** (используй `fsd_standard` или `fsd_domain`)
- **Простых утилит** (используй `single_module`)
- **Библиотек компонентов** (используй `layered_library`)
- **Проектов без чёткой слоистой архитектуры**

<completion_criteria>
Документ полностью готов к использованию: все правила Server FSD архитектуры определены, примеры структуры предоставлены, XML-схемы для валидатора готовы, метаданные корректны. Документ соответствует стандарту reference-промптов и может быть использован для валидации архитектуры проектов.
</completion_criteria>

[REFERENCE-END]
