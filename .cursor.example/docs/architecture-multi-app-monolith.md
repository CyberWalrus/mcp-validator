---
id: architecture-multi-app-monolith
type: reference
use_cases:
    [
        'multi_app_monolith_architecture',
        'fullstack_monorepos',
        'enterprise_solutions',
        'shared_tooling',
        'multiple_entrypoints',
    ]
prompt_language: ru
response_language: ru
alwaysApply: false
---

# Multi App Monolith — Многоприложенческий монолит

[REFERENCE-BEGIN]

## TIER 1: Expert Role

<expert_role>
You are a Multi App Monolith Architecture Specialist for TypeScript projects.

Responsibilities:

- Enforce Multi App Monolith architecture rules with zero exceptions
- Ensure isolation between multiple applications within one package
- Validate interactions through the common application only
- Guide selection of internal architectures for each application
- Prioritize weak coupling and independent entrypoints for applications

**ВАЖНО: Все ответы должны быть на русском языке.**
</expert_role>

<expert_completion_criteria>
Expert role clearly defines responsibilities specific to Multi App Monolith architecture and includes Russian language requirement for responses.
</expert_completion_criteria>

## TIER 2: Назначение и применение

<exception_handling>
При работе с Multi App Monolith архитектурой возможны следующие исключительные ситуации:

- Проект превышает лимит приложений (более 5–7) → разделение на отдельные пакеты
- Нарушение изоляции → немедленное удаление прямых импортов между приложениями
- Смешивание зависимостей → строгая проверка на импорт только через common
- Неопределенность в выборе внутренней архитектуры → приоритет FSD для фронтенда, Layered Library для common

Приоритеты исправления:

1. **Критичные:** Немедленно исправить (прямые импорты между приложениями)
2. **Средние:** Планировать миграцию приложений в отдельные пакеты
3. **Низкие:** Добавить документацию для новых приложений
   </exception_handling>

<algorithm_motivation>
Multi App Monolith архитектура позволяет объединить несколько самостоятельных приложений в одном пакете, обеспечивая изоляцию и переиспользование общего кода через common, что упрощает монолитную разработку fullstack проектов.
</algorithm_motivation>

<cognitive_triggers>
Давайте пошагово определим, подходит ли проект для Multi App Monolith архитектуры, проанализировав количество приложений, их изоляцию и наличие общего кода.
</cognitive_triggers>

<architecture_scope>
Multi App Monolith — архитектурный тип для пакетов, содержащих несколько самостоятельных приложений (фронтенд, бэкенд, CLI), каждое с собственной архитектурой и точкой входа, с общими модулями в applications/common.
**Назначение:** Монорепозитории с множественными точками входа, fullstack проекты.
**Ключевой принцип:** Изоляция приложений (только через common), слабая связанность, собственные entrypoints.
</architecture_scope>

<scope_completion_criteria>
Architecture scope clearly defines purpose, key principle, and decision criteria for Multi App Monolith usage.
</scope_completion_criteria>

### Алгоритм определения архитектуры

<algorithm_steps>

1. **Анализ приложений:** Определи количество самостоятельных приложений (фронтенд, бэкенд, CLI)
2. **Подсчет entrypoints:**
    - Unix/Linux: `find src/applications -name "index.ts" | wc -l`
    - Проверь наличие common для общих модулей
3. **Оценка изоляции:** Проверь отсутствие прямых импортов между приложениями
4. **Принятие решения:** Применяй правила выбора архитектуры

</algorithm_steps>

Если проект содержит:

- ✓ Несколько (2–7) самостоятельных приложений
- ✓ Общий код в applications/common
- ✓ Изоляцию (импорты только через common)
- ✓ Собственные entrypoints для каждого приложения

### → Multi App Monolith

Иначе → отдельные пакеты (для микросервисов) или FSD (для одного приложения)

<step_completion_criteria>
Алгоритм четко структурирован с пошаговыми инструкциями и критериями принятия решений для Multi App Monolith.
</step_completion_criteria>

<exception_handling>

Если количество приложений в пограничной зоне (1–2), проведи дополнительный анализ:

- Если приложения тесно связаны общим кодом → Multi App Monolith
- Если независимы → отдельные пакеты
- При сомнениях → выбери монолит для упрощения разработки

Если приложений более 7 → обязательно разделить на микросервисы или отдельные репозитории.

</exception_handling>

### Быстрая проверка пригодности

| **Условие**  | **✅ Подходит**         | **❌ Не подходит**    |
| ------------ | ----------------------- | --------------------- |
| Приложения   | 2–7 самостоятельных     | 1 или >10             |
| Изоляция     | Только через common     | Прямые импорты        |
| Общий код    | В applications/common   | Нет переиспользования |
| Entry points | Собственные для каждого | Один общий            |

### Основные характеристики

- **Множественные приложения:** Каждое приложение — самостоятельный проект
- **Слабая связанность:** Приложения взаимодействуют только через публичные API common
- **Собственные архитектуры:** Каждое приложение может использовать любую внутреннюю архитектуру
- **Общие модули:** Переиспользуемый код в приложении common
- **Множественные точки входа:** Каждое приложение имеет собственный entrypoint

## TIER 3: Структура проекта

<output_format>

При описании структуры проекта используй XML-схему с четкими ролями файлов и их назначением. Для каждого элемента указывай:

- `name` — имя файла/директории
- `role` — роль (application, layer, module, facade, function, types, unit_test)
- `purpose` — назначение
- `exports` — что экспортирует (для фасадов)

</output_format>

<cognitive_triggers>
Давайте пошагово разберем обязательную структуру Multi App Monolith, начиная с applications, добавляя внутренние слои и common.
</cognitive_triggers>

### Базовая схема

```xml
<package_root>
  <source_directory name="src">
    <entrypoint name="index.ts" purpose="Общая точка входа пакета (опционально)" />
    <directory name="applications" purpose="Контейнер приложений">
      <application name="admin-frontend" purpose="Фронтенд для админов">
        <entrypoint name="index.ts" purpose="Точка входа приложения" />
        <layer name="pages" purpose="FSD структура">
          <module name="dashboard">
            <facade name="index.ts" role="slice_facade" purpose="Фасад модуля" exports="Dashboard" />
            <segment name="ui" purpose="UI компоненты">
              <file name="Dashboard.tsx" role="component" purpose="Основной компонент" />
            </segment>
            <directory name="__tests__" purpose="Тесты модуля">
              <test name="dashboard.test.tsx" role="unit_test" />
            </directory>
          </module>
        </layer>
        <directory name="__tests__" purpose="Тесты приложения">
          <test name="admin.test.tsx" role="unit_test" />
        </directory>
      </application>
      <application name="public-frontend" purpose="Публичный фронтенд">
        <entrypoint name="index.ts" purpose="Точка входа приложения" />
        <layer name="pages" purpose="Страницы">
          <module name="home">
            <facade name="index.ts" role="slice_facade" exports="HomePage" />
            <segment name="ui" purpose="UI компоненты">
              <file name="HomePage.tsx" role="component" />
            </segment>
          </module>
        </layer>
        <directory name="__tests__" purpose="Тесты приложения">
          <test name="public.test.tsx" role="unit_test" />
        </directory>
      </application>
      <application name="api-server" purpose="Backend API">
        <entrypoint name="index.ts" purpose="Точка входа сервера" />
        <layer name="controllers" purpose="Контроллеры">
          <module name="user-controller">
            <facade name="index.ts" role="unit_facade" exports="userController" />
            <file name="user-controller.ts" role="function" purpose="Контроллер пользователя" />
            <directory name="__tests__">
              <test name="user-controller.test.ts" role="unit_test" />
            </directory>
          </module>
        </layer>
        <layer name="services" purpose="Сервисы">
          <module name="user-service">
            <facade name="index.ts" role="unit_facade" exports="userService" />
            <directory name="__tests__">
              <test name="user-service.test.ts" role="unit_test" />
            </directory>
          </module>
        </layer>
      </application>
      <application name="cli-tools" purpose="CLI инструменты">
        <entrypoint name="index.ts" purpose="Точка входа CLI" />
        <layer name="commands" purpose="Команды CLI">
          <module name="build-command">
            <facade name="index.ts" role="unit_facade" exports="buildCommand" />
            <file name="build.ts" role="workflow" purpose="Команда сборки" />
            <directory name="__tests__">
              <test name="build.test.ts" role="unit_test" />
            </directory>
          </module>
          <module name="deploy-command">
            <facade name="index.ts" role="unit_facade" exports="deployCommand" />
            <directory name="__tests__">
              <test name="deploy.test.ts" role="unit_test" />
            </directory>
          </module>
        </layer>
        <directory name="__tests__">
          <test name="cli.test.ts" role="unit_test" />
        </directory>
      </application>
      <application name="common" purpose="Общие модули">
        <entrypoint name="index.ts" purpose="Фасад общих модулей" />
        <layer name="lib" purpose="Общие утилиты">
          <directory name="helpers">
            <module name="format-date">
              <facade name="index.ts" role="unit_facade" exports="formatDate" />
              <file name="format-date.ts" role="helper" />
              <directory name="__tests__">
                <test name="format-date.test.ts" role="unit_test" />
              </directory>
            </module>
          </directory>
          <directory name="hooks">
            <module name="use-api">
              <facade name="index.ts" role="unit_facade" exports="useApi" />
              <directory name="__tests__">
                <test name="use-api.test.ts" role="unit_test" />
              </directory>
            </module>
          </directory>
        </layer>
        <layer name="model" purpose="Общие типы и схемы">
          <directory name="types">
            <module name="user">
              <facade name="index.ts" role="unit_facade" exports="type User" />
              <file name="user.ts" role="types" />
            </module>
          </directory>
          <directory name="schemas">
            <module name="validation">
              <facade name="index.ts" role="unit_facade" exports="userSchema" />
              <file name="validation.ts" role="schemas" />
            </module>
          </directory>
        </layer>
        <layer name="services" purpose="Общие сервисы">
          <directory name="workflows">
            <module name="rebuild-indexes">
              <facade name="index.ts" role="unit_facade" exports="rebuildIndexes" />
              <file name="rebuild-workflow.ts" role="workflow" />
              <directory name="__tests__">
                <test name="rebuild-workflow.test.ts" role="unit_test" />
              </directory>
            </module>
          </directory>
        </layer>
        <directory name="__tests__">
          <test name="common.test.ts" role="unit_test" />
        </directory>
      </application>
    </directory>
    <directory name="__tests__" purpose="Интеграционные тесты пакета">
      <test name="integration.test.ts" role="integration_test" />
    </directory>
  </source_directory>
</package_root>
```

<structure_completion_criteria>
Структура четко определена с XML-схемой, ролями элементов и их назначением для Multi App Monolith.
</structure_completion_criteria>

### Варианты внутренних архитектур приложений

#### Frontend приложения

Могут использовать любую архитектуру:

- **FSD** (`fsd_standard`, `fsd_domain`) — для сложных интерфейсов
- **Server FSD** (`server_fsd`) — для серверных приложений
- **Layered Library** — для простых приложений с группировкой по слоям
- **Single Module** — для очень простых одностраничных приложений

#### Backend приложения

- **Server FSD** (`server_fsd`) — для сложных серверных приложений
- **Layered Library** — группировка по `controllers/`, `services/`, `models/`, `routes/`
- **Single Module** — для простых API с одной областью ответственности

#### CLI приложения

- **Server FSD** (`server_fsd`) — для сложных CLI с множественными командами
- **Single Module** — для простых утилит
- **Layered Library** — для CLI с группировкой по функциональности

#### Common приложение

Рекомендуется **Layered Library** архитектура для организации общего кода по слоям.

## TIER 4: Правила и ограничения

### ✅ Требования

- [ ] **Множественные entrypoints:** У каждого приложения собственный `index.ts`
- [ ] **Фасады приложений:** Каждое приложение имеет публичный API
- [ ] **Изоляция приложений:** Нет прямых импортов между приложениями (кроме `common`)
- [ ] **Common как медиатор:** Все межприложенческие зависимости через `applications/common`
- [ ] **Собственные архитектуры:** Каждое приложение может иметь свою внутреннюю структуру
- [ ] **Тесты на уровне приложений:** Тесты в `__tests__/` каждого приложения
- [ ] **Нет циклов:** Отсутствие циклических зависимостей между приложениями

### ❌ Запрещено

- Прямые импорты между приложениями (минуя `common`)
- Импорт внутренних деталей других приложений
- Циклические зависимости между приложениями
- Экспорт внутренних модулей `common` без фасадов
- Нарушение архитектурных правил внутри каждого приложения

### Risk Assessment

<cognitive_triggers>
Давайте проанализируем потенциальные риски при использовании Multi App Monolith архитектуры и способы их смягчения.
</cognitive_triggers>

**Потенциальные проблемы и решения:**

| **Риск**                | **Симптомы**                      | **Смягчение**                                                       |
| ----------------------- | --------------------------------- | ------------------------------------------------------------------- |
| Нарушение изоляции      | Прямые импорты между приложениями | ESLint: запрет импортов по путям + проверка зависимостей            |
| Превышение приложений   | >7 приложений                     | Разделение на микросервисы или отдельные пакеты                     |
| Утечка внутренних API   | Экспорт приватных модулей         | Фасады только для публичного API, скрытие internals                 |
| Циклические зависимости | Взаимные импорты приложений       | Граф зависимостей + инструменты анализа (madge, dependency-cruiser) |

<risk_completion_criteria>
Risk Assessment содержит конкретные риски, их симптомы и способы смягчения для Multi App Monolith.
</risk_completion_criteria>

### Примеры импортов

```typescript
// ✅ МОЖНО: из любого приложения импортировать common
import { formatDate, User, validateUser } from 'applications/common';

// ✅ МОЖНО: внешние библиотеки
import { z } from 'zod';
import React from 'react';

// ❌ НЕЛЬЗЯ: прямой импорт между приложениями
import { AdminPanel } from 'applications/admin-frontend';

// ❌ НЕЛЬЗЯ: импорт внутренних деталей common
import { formatDateHelper } from 'applications/common/lib/helpers/format-date/helpers';
```

## TIER 5: Примеры использования

### E-commerce платформа

**Описание:** Полноценная e-commerce система с несколькими фронтендами и бэкендом

```xml
<package_root>
  <source_directory name="src">
    <entrypoint name="index.ts" purpose="Общая точка входа" />
    <directory name="applications">
      <application name="admin-frontend" purpose="Административная панель">
        <entrypoint name="index.ts" />
        <layer name="pages">
          <module name="products">
            <facade name="index.ts" role="slice_facade" exports="ProductsPage" />
            <segment name="ui">
              <file name="ProductsPage.tsx" role="component" />
            </segment>
          </module>
        </layer>
        <directory name="__tests__">
          <test name="admin.test.tsx" role="unit_test" />
        </directory>
      </application>
      <application name="public-frontend" purpose="Публичный магазин">
        <entrypoint name="index.ts" />
        <layer name="pages">
          <module name="catalog">
            <facade name="index.ts" role="slice_facade" exports="CatalogPage" />
            <segment name="ui">
              <file name="CatalogPage.tsx" role="component" />
            </segment>
          </module>
        </layer>
        <directory name="__tests__">
          <test name="public.test.tsx" role="unit_test" />
        </directory>
      </application>
      <application name="api-server" purpose="REST API">
        <entrypoint name="index.ts" />
        <layer name="controllers">
          <module name="product-controller">
            <facade name="index.ts" role="unit_facade" exports="productController" />
            <file name="product-controller.ts" role="function" />
          </module>
        </layer>
      </application>
      <application name="common" purpose="Общие модули">
        <entrypoint name="index.ts" />
        <layer name="model">
          <module name="product">
            <facade name="index.ts" role="unit_facade" exports="type Product" />
            <file name="product.ts" role="types" />
          </module>
        </layer>
      </application>
    </directory>
  </source_directory>
</package_root>
```

### Betting платформа

**Описание:** Букмекерская платформа с операторским и игроковским интерфейсами

```xml
<package_root>
  <source_directory name="src">
    <entrypoint name="index.ts" />
    <directory name="applications">
      <application name="operator-frontend" purpose="Интерфейс операторов">
        <entrypoint name="index.ts" />
        <layer name="widgets">
          <module name="bet-management">
            <facade name="index.ts" role="slice_facade" exports="BetManagement" />
            <segment name="ui">
              <file name="BetManagement.tsx" role="component" />
            </segment>
          </module>
        </layer>
      </application>
      <application name="player-frontend" purpose="Интерфейс игроков">
        <entrypoint name="index.ts" />
        <layer name="features">
          <module name="live-betting">
            <facade name="index.ts" role="slice_facade" exports="LiveBetting" />
            <segment name="ui">
              <file name="LiveBetting.tsx" role="component" />
            </segment>
          </module>
        </layer>
      </application>
      <application name="admin-frontend" purpose="Административная панель">
        <entrypoint name="index.ts" />
        <layer name="pages">
          <module name="reports">
            <facade name="index.ts" role="slice_facade" exports="ReportsPage" />
            <segment name="ui">
              <file name="ReportsPage.tsx" role="component" />
            </segment>
          </module>
        </layer>
      </application>
      <application name="api-server" purpose="Основной API">
        <entrypoint name="index.ts" />
        <layer name="routes">
          <module name="bet-routes">
            <facade name="index.ts" role="unit_facade" exports="betRoutes" />
            <file name="bet-routes.ts" role="function" />
          </module>
        </layer>
      </application>
      <application name="websocket-server" purpose="Real-time сервер">
        <entrypoint name="index.ts" />
        <layer name="handlers">
          <module name="live-events">
            <facade name="index.ts" role="unit_facade" exports="liveEventHandler" />
            <file name="live-events.ts" role="function" />
          </module>
        </layer>
      </application>
      <application name="cli-tools" purpose="Инструменты управления">
        <entrypoint name="index.ts" />
        <layer name="commands">
          <module name="bet-management-command">
            <facade name="index.ts" role="unit_facade" exports="betManagementCmd" />
            <file name="bet-management.ts" role="workflow" />
          </module>
        </layer>
      </application>
      <application name="common" purpose="Бизнес-логика и типы">
        <entrypoint name="index.ts" />
        <layer name="services">
          <module name="bet-calculation">
            <facade name="index.ts" role="unit_facade" exports="calculateOdds" />
            <file name="bet-calculation.ts" role="function" />
          </module>
        </layer>
        <layer name="model">
          <module name="bet">
            <facade name="index.ts" role="unit_facade" exports="type Bet" />
            <file name="bet.ts" role="types" />
          </module>
        </layer>
      </application>
    </directory>
  </source_directory>
</package_root>
```

**Примечание:** Каждое приложение использует подходящую внутреннюю архитектуру; common — Layered Library.

## TIER 6: XML-схема для валидатора

```xml
<package_root>
  <source_directory name="src">
    <entrypoint name="index.ts" />
    <application name="admin-frontend">
      <entrypoint name="index.ts" />
      <layer name="pages" purpose="административные страницы">
        <module name="dashboard">
          <facade name="index.ts" role="slice_facade" />
          <segment name="ui" purpose="UI компоненты">
            <file name="Dashboard.tsx" role="component" />
          </segment>
        </module>
      </layer>
      <test name="__tests__/admin.test.tsx" role="unit_test" />
    </application>
    <application name="public-frontend">
      <entrypoint name="index.ts" />
      <layer name="pages" purpose="публичные страницы">
        <module name="home">
          <facade name="index.ts" role="slice_facade" />
          <segment name="ui" purpose="UI компоненты">
            <file name="Home.tsx" role="component" />
          </segment>
        </module>
      </layer>
      <test name="__tests__/public.test.tsx" role="unit_test" />
    </application>
    <application name="api-server">
      <entrypoint name="index.ts" />
      <layer name="controllers" purpose="контроллеры API">
        <module name="user-controller">
          <facade name="index.ts" role="unit_facade" />
          <file name="user-controller.ts" role="function" />
          <test name="__tests__/user-controller.test.ts" role="unit_test" />
        </module>
      </layer>
    </application>
    <application name="cli-tools">
      <entrypoint name="index.ts" />
      <layer name="commands" purpose="CLI команды">
        <module name="build-command">
          <facade name="index.ts" role="unit_facade" />
          <file name="build.ts" role="workflow" />
          <test name="__tests__/build.test.ts" role="unit_test" />
        </module>
      </layer>
    </application>
    <application name="common">
      <entrypoint name="index.ts" />
      <layer name="lib" purpose="общие утилиты">
        <directory name="helpers">
          <module name="format-date">
            <facade name="index.ts" role="unit_facade" />
            <file name="format-date.ts" role="helper" />
            <test name="__tests__/format-date.test.ts" role="unit_test" />
          </module>
        </directory>
      </layer>
      <layer name="services" purpose="общие сервисы">
        <directory name="workflows">
          <module name="rebuild-indexes">
            <facade name="index.ts" role="unit_facade" />
            <file name="rebuild-workflow.ts" role="workflow" />
            <test name="__tests__/rebuild-workflow.test.ts" role="unit_test" />
          </module>
        </directory>
      </layer>
    </application>
  </source_directory>
</package_root>
```

## TIER 7: Метаданные для валидатора

### Полная валидация

```xml
<architecture_metadata version="1" language="ts">
  <architecture_type>multi_app_monolith</architecture_type>
  <scope>full</scope>
  <module_units>
    <unit path="src/applications/admin-frontend" layer="application" />
    <unit path="src/applications/public-frontend" layer="application" />
    <unit path="src/applications/api-server" layer="application" />
    <unit path="src/applications/cli-tools" layer="application" />
    <unit path="src/applications/common" layer="application" />
  </module_units>
  <entrypoints>
    <entrypoint path="src/index.ts" />
    <entrypoint path="src/applications/admin-frontend/index.ts" />
    <entrypoint path="src/applications/public-frontend/index.ts" />
    <entrypoint path="src/applications/api-server/index.ts" />
    <entrypoint path="src/applications/cli-tools/index.ts" />
    <entrypoint path="src/applications/common/index.ts" />
  </entrypoints>
  <ruleset>morj-2025-09</ruleset>
</architecture_metadata>
```

### Частичная валидация (отдельное приложение)

```xml
<architecture_metadata version="1" language="ts">
  <architecture_type>multi_app_monolith</architecture_type>
  <scope>partial</scope>
  <partial_root>src/applications/public-frontend</partial_root>
  <module_units>
    <unit path="src/applications/public-frontend" layer="application" />
  </module_units>
  <entrypoints>
    <entrypoint path="src/applications/public-frontend/index.ts" />
  </entrypoints>
  <ruleset>morj-2025-09</ruleset>
</architecture_metadata>
```

## TIER 8: Применимость и валидация

### ✅ Подходит для

- Монорепозиториев с множественными точками входа
- Fullstack проектов (фронтенд + бэкенд + CLI в одном пакете)
- Enterprise решений с административными и публичными интерфейсами
- Проектов с общими библиотеками для разных приложений
- Development environments с shared tooling

### ❌ Не подходит для

- Простых одно-приложенческих проектов (используй соответствующий FSD тип)
- Микросервисной архитектуры (каждый сервис — отдельный пакет)
- Проектов без общего кода между приложениями
- Случаев, когда приложения развиваются независимыми командами

<completion_criteria>
Документ полностью готов к использованию: все правила Multi App Monolith архитектуры определены, примеры структуры предоставлены, XML-схемы для валидатора готовы, метаданные корректны. Документ соответствует стандарту reference-промптов и может быть использован для валидации архитектуры проектов.
</completion_criteria>

[REFERENCE-END]
