---
id: architecture-fsd-standard
type: reference
use_cases:
    [
        'fsd_standard_architecture',
        'feature_sliced_design',
        'frontend_applications',
        'no_domains',
        'medium_complexity_projects',
    ]
prompt_language: ru
response_language: ru
alwaysApply: false
---

# FSD Standard — Feature-Sliced Design

[REFERENCE-BEGIN]

## TIER 1: Expert Role

<expert_role>
You are a FSD Standard Architecture Specialist for TypeScript/React projects.

Responsibilities:

- Enforce FSD Standard architecture rules with zero exceptions
- Ensure strict layer hierarchy: app → pages → widgets → features → entities → shared → core
- Validate slice facades and segment organization without domain grouping
- Guide proper segment usage (ui, model, service, lib) within slices
- Prioritize no cross-imports between same-layer slices and downward dependencies only

**ВАЖНО: Все ответы должны быть на русском языке.**
</expert_role>

<expert_completion_criteria>
Expert role clearly defines responsibilities specific to FSD Standard architecture and includes Russian language requirement for responses.
</expert_completion_criteria>

## TIER 2: Назначение и применение

<exception_handling>
При работе с FSD Standard архитектурой возможны следующие исключительные ситуации:

- Проект требует доменного разделения → миграция на fsd_domain
- Нарушение иерархии слоёв → немедленное исправление зависимостей
- Кросс-импорты в одном слое → строгая проверка и рефакторинг импортов
- Неопределенность в размещении кода → приоритет по иерархии (pages для страниц, features для фич)

Приоритеты исправления:

1. **Критичные:** Немедленно исправить (нарушение иерархии или кросс-импорты)
2. **Средние:** Планировать рефакторинг слайсов
3. **Низкие:** Добавить фасады для новых слайсов
   </exception_handling>

<algorithm_motivation>
FSD Standard архитектура обеспечивает строгую иерархию слоёв для фронтенд-приложений средней сложности, упрощая масштабирование без доменов и минимизируя зависимости через фасады слайсов.
</algorithm_motivation>

<cognitive_triggers>
Давайте пошагово определим, подходит ли проект для FSD Standard архитектуры, проанализировав сложность, отсутствие доменов и необходимость слоистой иерархии.
</cognitive_triggers>

<architecture_scope>
FSD Standard — архитектурный тип для фронтенд-приложений с Feature-Sliced Design без доменов, где слайсы организуются по функционалу с иерархией app → pages → widgets → features → entities → shared → core.
**Назначение:** Средние и сложные фронтенд-приложения без явного доменного разделения.
**Ключевой принцип:** Строгая иерархия слоёв с зависимостями только вниз, фасады слайсов, запрет кросс-импортов в слое.
</architecture_scope>

<scope_completion_criteria>
Architecture scope clearly defines purpose, key principle, and decision criteria for FSD Standard usage.
</scope_completion_criteria>

### Алгоритм определения архитектуры

<algorithm_steps>

1. **Анализ сложности:** Определи наличие страниц, виджетов, фич и сущностей
2. **Проверка доменов:** Убедись в отсутствии явного доменного разделения
3. **Оценка иерархии:** Проверь необходимость строгой слоистой структуры
4. **Принятие решения:** Применяй правила выбора архитектуры

</algorithm_steps>

Если проект содержит:

- ✓ Среднюю/высокую сложность (множество фич, страниц)
- ✓ Функциональную группировку без доменов
- ✓ Иерархические зависимости (pages зависят от features)
- ✓ Фронтенд-приложение

### → FSD Standard

Иначе → layered_library (для библиотек) или fsd_domain (с доменами)

<step_completion_criteria>
Алгоритм четко структурирован с пошаговыми инструкциями и критериями принятия решений для FSD Standard.
</step_completion_criteria>

<exception_handling>

Если проект в пограничной зоне (малое количество фич), проведи дополнительный анализ:

- Если требуется доменное разделение → fsd_domain
- Если простая структура → layered_library
- При сомнениях → выбери FSD Standard для масштабируемости

Если проект серверный → используй server_fsd.

</exception_handling>

### Быстрая проверка пригодности

| **Условие** | **✅ Подходит**            | **❌ Не подходит**            |
| ----------- | -------------------------- | ----------------------------- |
| Сложность   | Средняя/высокая            | Простая или библиотека        |
| Домены      | Отсутствуют                | Явные домены                  |
| Структура   | Слои: app, pages, features | Без иерархии или с доменами   |
| Тип проекта | Фронтенд-приложение        | Сервер или монолит приложений |

### Основные характеристики

- **Слоистая архитектура:** Строгая иерархия app → pages → widgets → features → entities → shared → core
- **Без доменов:** Слайсы по функционалу, не по бизнес-сущностям
- **Фасады слайсов:** Каждый слайс имеет index.ts
- **Запрет кросс-импортов:** Слайсы одного слоя не импортируют друг друга

## TIER 3: Структура проекта

<output_format>

При описании структуры проекта используй XML-схему с четкими ролями файлов и их назначением. Для каждого элемента указывай:

- `name` — имя файла/директории
- `role` — роль (layer, module, facade, segment, component, function, types, unit_test)
- `purpose` — назначение
- `exports` — что экспортирует (для фасадов)

</output_format>

<cognitive_triggers>
Давайте пошагово разберем структуру FSD Standard, начиная с иерархии слоёв, слайсов и сегментов.
</cognitive_triggers>

### Базовая схема

```xml
<package_root>
  <source_directory name="src">
    <layer name="app" purpose="Точка входа и инициализация">
      <entrypoint name="index.ts" purpose="Фасад приложения" />
      <directory name="providers">
        <file name="global-providers.tsx" role="component" purpose="Глобальные провайдеры" />
      </directory>
      <directory name="styles">
        <file name="global.css" role="asset" purpose="Глобальные стили" />
      </directory>
    </layer>
    <layer name="pages" purpose="Страницы приложения">
      <module name="home">
        <facade name="index.ts" role="slice_facade" purpose="Фасад слайса" exports="HomePage" />
        <segment name="ui" purpose="UI компоненты">
          <file name="main/index.tsx" role="component" purpose="Основная страница" />
        </segment>
        <segment name="route" purpose="Роутинг">
          <file name="index.ts" role="config" purpose="Регистрация роута" />
          <file name="loader.ts" role="function" purpose="Загрузка данных" />
        </segment>
        <directory name="__tests__">
          <test name="home.test.ts" role="unit_test" />
        </directory>
      </module>
      <module name="profile">
        <facade name="index.ts" role="slice_facade" exports="ProfilePage" />
        <segment name="ui">
          <file name="index.tsx" role="component" />
        </segment>
        <segment name="route">
          <file name="index.ts" role="config" />
        </segment>
      </module>
    </layer>
    <layer name="widgets" purpose="Композиции фич">
      <module name="header">
        <facade name="index.ts" role="slice_facade" exports="Header" />
        <segment name="ui">
          <file name="common/Header.tsx" role="component" />
        </segment>
        <directory name="__tests__">
          <test name="header.test.ts" role="unit_test" />
        </directory>
      </module>
    </layer>
    <layer name="features" purpose="Отдельные фичи">
      <module name="auth">
        <facade name="index.ts" role="slice_facade" exports="AuthForm, useAuth" />
        <segment name="ui">
          <file name="common/AuthForm/index.tsx" role="component" />
        </segment>
        <segment name="model">
          <file name="store/index.ts" role="function" purpose="Состояние" />
          <file name="types/index.ts" role="types" />
          <file name="selectors/index.ts" role="function" />
        </segment>
        <segment name="service">
          <file name="auth-flow/index.ts" role="workflow" purpose="Бизнес-процесс" />
        </segment>
        <segment name="lib">
          <file name="helpers/index.ts" role="function" />
        </segment>
      </module>
    </layer>
    <layer name="entities" purpose="Сущности">
      <module name="user">
        <facade name="index.ts" role="slice_facade" exports="UserType, userStore" />
        <segment name="model">
          <file name="types/index.ts" role="types" />
          <file name="store/index.ts" role="function" />
          <file name="selectors/index.ts" role="function" />
        </segment>
        <segment name="lib">
          <file name="helpers/index.ts" role="function" />
        </segment>
      </module>
    </layer>
    <layer name="shared" purpose="Разделяемый код">
      <directory name="ui">
        <directory name="base">
          <module name="button">
            <facade name="index.tsx" role="unit_facade" exports="Button" />
            <file name="Button.tsx" role="component" />
            <directory name="__tests__">
              <test name="button.test.tsx" role="unit_test" />
            </directory>
          </module>
        </directory>
      </directory>
      <directory name="lib">
        <directory name="hooks">
          <module name="use-safe-back">
            <facade name="index.ts" role="unit_facade" exports="useSafeBack" />
            <file name="use-safe-back.ts" role="function" />
            <directory name="__tests__">
              <test name="use-safe-back.test.ts" role="unit_test" />
            </directory>
          </module>
        </directory>
      </directory>
      <directory name="api">
        <directory name="base">
          <file name="index.ts" role="function" purpose="Базовый API" />
        </directory>
      </directory>
    </layer>
    <layer name="core" purpose="Базовые модули">
      <directory name="router">
        <file name="index.ts" role="function" purpose="Роутер" />
      </directory>
    </layer>
  </source_directory>
</package_root>
```

<structure_completion_criteria>
Структура четко определена с XML-схемой, ролями элементов и их назначением для FSD Standard.
</structure_completion_criteria>

### Иерархия слоёв

app → pages → widgets → features → entities → shared → core

Слои могут зависеть только от нижележащих.

### Описание слоёв

| **Слой**   | **Назначение**                                    | **Может зависеть от**                            | **Кросс-импорт** |
| ---------- | ------------------------------------------------- | ------------------------------------------------ | ---------------- |
| `app`      | Точка входа, инициализация, глобальные провайдеры | pages, widgets, features, entities, shared, core | ✅               |
| `pages`    | Конкретные страницы приложения                    | widgets, features, entities, shared, core        | ❌               |
| `widgets`  | Композиции фич, самостоятельные блоки             | features, entities, shared, core                 | ❌               |
| `features` | Отдельные части функциональности                  | entities, shared, core                           | ❌               |
| `entities` | Модели предметной области                         | shared, core                                     | ❌               |
| `shared`   | Код не связанный с бизнес-логикой                 | core                                             | ✅               |
| `core`     | Базовые библиотеки и модули                       | -                                                | ✅               |

### Сегменты слайсов

#### ui/ — Пользовательский интерфейс

```text
ui/
├── common/          # Общие компоненты (без префикса)
├── desktop/         # Префикс Desktop (DesktopAuthForm)
└── mobile/          # Префикс Mobile (MobileAuthForm)
```

**Правила:**

- По умолчанию компоненты в `common`
- Максимум один дополнительный уровень вложенности
- Вложенные элементы получают префикс родителя

#### model/ — Управление состоянием

```text
model/
├── store/           # Redux store/reducer
├── types/           # TypeScript типы
├── constants/       # Константы
├── schemas/         # Zod схемы валидации
├── selectors/       # Селекторы состояния
└── actions/         # Actions/thunks
```

#### service/ — Сайд-эффекты и бизнес-процессы

**Базовая структура:**

```text
service/
└── auth-flow/       # Основной процесс (saga/thunk)
    └── index.ts
```

**Расширенная структура:**

```text
service/
├── adapters/        # Адаптеры внешних систем
├── gateways/        # Доступ к инфраструктуре
└── workflows/       # Бизнес-процессы
```

#### route/ — Подключение к роутеру (только для pages)

```text
route/
├── index.ts         # Регистрация/соединение с роутером
├── loader.ts        # Загрузка данных
├── action.ts        # Обработка действий
└── fetcher.ts       # Фетчеры данных
```

#### lib/ — Утилиты и хуки

```text
lib/
├── helpers/         # Хелперы
└── hooks/           # Хуки
```

#### assets/ — Статические ресурсы

Статические файлы: изображения, видео, шрифты, JSON, локализация.

## TIER 4: Правила и ограничения

### ✅ Требования

- [ ] **Иерархия слоёв:** Соответствует FSD с зависимостями только вниз по иерархии
- [ ] **Фасады слайсов:** У всех слайсов есть `index.ts` как Public API
- [ ] **Запрет кросс-импортов:** Нет импортов между слайсами одного слоя
- [ ] **Сегментная организация:** Сложные слайсы разделены на сегменты
- [ ] **Именованные экспорты:** Только именованные экспорты
- [ ] **Тесты на уровне слайсов:** Тесты в `__tests__/` рядом со слайсами

### ❌ Запрещено

- Нарушение иерархии слоёв (импорт из вышестоящих слоёв)
- Кросс-импорты между слайсами на одном слое
- Доменные группировки (для этого используй `fsd_domain`)
- Прямой импорт из внутренних частей слайсов (только через фасады)
- `Default` экспорты

### Risk Assessment

<cognitive_triggers>
Давайте проанализируем потенциальные риски при использовании FSD Standard архитектуры и способы их смягчения.
</cognitive_triggers>

**Потенциальные проблемы и решения:**

| **Риск**                   | **Симптомы**                           | **Смягчение**                                                   |
| -------------------------- | -------------------------------------- | --------------------------------------------------------------- |
| Нарушение иерархии         | Импорты из вышестоящих слоёв           | ESLint: правила импортов по слоям + автоматизированная проверка |
| Кросс-импорты в слое       | Зависимости между слайсами одного слоя | Рефакторинг: перемещение общего кода в shared                   |
| Отсутствие фасадов         | Прямые импорты из сегментов            | Обязательные index.ts для каждого слайса                        |
| Рост сложности без доменов | >50 слайсов в features/entities        | Миграция на fsd_domain для доменного разделения                 |

<risk_completion_criteria>
Risk Assessment содержит конкретные риски, их симптомы и способы смягчения для FSD Standard.
</risk_completion_criteria>

## TIER 5: Примеры использования

### Пример структуры приложения

**Описание:** Полное приложение с страницами, виджетами, фичами и shared

```xml
<package_root>
  <source_directory name="src">
    <layer name="app" purpose="Инициализация">
      <entrypoint name="index.ts" purpose="Точка входа" />
      <directory name="providers">
        <file name="AppProviders.tsx" role="component" />
      </directory>
    </layer>
    <layer name="pages" purpose="Страницы">
      <module name="home">
        <facade name="index.ts" role="slice_facade" exports="HomePage" />
        <segment name="ui">
          <file name="HomePage.tsx" role="component" />
        </segment>
        <segment name="route">
          <file name="route.ts" role="config" />
        </segment>
        <directory name="__tests__">
          <test name="home.test.ts" role="unit_test" />
        </directory>
      </module>
    </layer>
    <layer name="widgets" purpose="Виджеты">
      <module name="header">
        <facade name="index.ts" role="slice_facade" exports="HeaderWidget" />
        <segment name="ui">
          <file name="Header.tsx" role="component" />
        </segment>
        <directory name="__tests__">
          <test name="header.test.ts" role="unit_test" />
        </directory>
      </module>
    </layer>
    <layer name="features" purpose="Фичи">
      <module name="auth">
        <facade name="index.ts" role="slice_facade" exports="AuthFeature" />
        <segment name="ui">
          <file name="AuthForm.tsx" role="component" />
        </segment>
        <segment name="model">
          <file name="authStore.ts" role="function" />
          <file name="authTypes.ts" role="types" />
        </segment>
        <segment name="service">
          <file name="authService.ts" role="workflow" />
        </segment>
      </module>
    </layer>
    <layer name="entities" purpose="Сущности">
      <module name="user">
        <facade name="index.ts" role="slice_facade" exports="UserEntity" />
        <segment name="model">
          <file name="userModel.ts" role="function" />
          <file name="userTypes.ts" role="types" />
        </segment>
      </module>
    </layer>
    <layer name="shared" purpose="Shared">
      <directory name="ui">
        <module name="button">
          <facade name="index.tsx" role="unit_facade" exports="Button" />
          <file name="Button.tsx" role="component" />
        </module>
      </directory>
      <directory name="lib">
        <module name="useDebounce">
          <facade name="index.ts" role="unit_facade" exports="useDebounce" />
          <file name="useDebounce.ts" role="function" />
        </module>
      </directory>
    </layer>
    <layer name="core" purpose="Core">
      <directory name="ui-kit">
        <file name="index.ts" role="function" purpose="Базовый UI Kit" />
      </directory>
    </layer>
  </source_directory>
</package_root>
```

**Примечание:** Каждый слайс имеет фасад; сегменты используются для сложных слайсов; тесты рядом.

### Пример слайса features/auth

**Описание:** Полный слайс авторизации

```xml
<module name="auth">
  <facade name="index.ts" role="slice_facade" exports="AuthForm, useAuth, authStore" />
  <segment name="ui" purpose="UI">
    <directory name="common">
      <file name="AuthForm/index.tsx" role="component" />
    </directory>
    <directory name="desktop">
      <file name="DesktopAuthForm.tsx" role="component" />
    </directory>
  </segment>
  <segment name="model" purpose="Состояние">
    <directory name="store">
      <file name="authSlice.ts" role="function" />
    </directory>
    <directory name="types">
      <file name="authTypes.ts" role="types" />
    </directory>
    <directory name="selectors">
      <file name="authSelectors.ts" role="function" />
    </directory>
  </segment>
  <segment name="service" purpose="Бизнес-логика">
    <directory name="auth-flow">
      <file name="loginFlow.ts" role="workflow" />
    </directory>
  </segment>
  <segment name="lib" purpose="Утилиты">
    <directory name="hooks">
      <file name="useAuth.ts" role="function" />
    </directory>
  </segment>
  <directory name="__tests__">
    <test name="auth.test.ts" role="unit_test" />
  </directory>
</module>
```

## TIER 6: XML-схема для валидатора

```xml
<package_root>
  <source_directory name="src">
    <layer name="app" purpose="инициализация приложения">
      <entrypoint name="index.ts" />
      <directory name="providers">
        <file name="providers.tsx" role="component" />
      </directory>
    </layer>
    <layer name="pages" purpose="страницы приложения">
      <module name="home">
        <facade name="index.ts" role="slice_facade" />
        <segment name="ui" purpose="UI компоненты">
          <file name="HomePage.tsx" role="component" />
        </segment>
        <segment name="route" purpose="роутинг">
          <file name="index.ts" role="config" />
          <file name="loader.ts" role="function" />
        </segment>
        <test name="__tests__/home.test.ts" role="unit_test" />
      </module>
    </layer>
    <layer name="features" purpose="фичи">
      <module name="auth">
        <facade name="index.ts" role="slice_facade" />
        <segment name="ui" purpose="UI компоненты">
          <file name="common/AuthForm/index.tsx" role="component" />
        </segment>
        <segment name="model" purpose="состояние">
          <file name="store/index.ts" role="function" />
          <file name="types/index.ts" role="types" />
        </segment>
        <segment name="service" purpose="бизнес-логика">
          <file name="auth-flow/index.ts" role="workflow" />
        </segment>
      </module>
    </layer>
    <layer name="shared" purpose="разделяемый код">
      <directory name="ui">
        <directory name="base">
          <module name="button">
            <facade name="index.tsx" role="unit_facade" />
            <file name="Button.tsx" role="component" />
            <test name="__tests__/button.test.tsx" role="unit_test" />
          </module>
        </directory>
      </directory>
    </layer>
  </source_directory>
</package_root>
```

## TIER 7: Метаданные для валидатора

### Полная валидация

```xml
<architecture_metadata version="1" language="ts">
  <architecture_type>fsd_standard</architecture_type>
  <scope>full</scope>
  <module_units>
    <unit path="src/pages/home" layer="pages" />
    <unit path="src/widgets/header" layer="widgets" />
    <unit path="src/features/auth" layer="features" />
    <unit path="src/entities/user" layer="entities" />
    <unit path="src/shared/ui/base/button" layer="shared" />
  </module_units>
  <entrypoints>
    <entrypoint path="src/app/index.ts" />
  </entrypoints>
  <ruleset>morj-2025-09</ruleset>
</architecture_metadata>
```

### Частичная валидация (отдельный слайс)

```xml
<architecture_metadata version="1" language="ts">
  <architecture_type>fsd_standard</architecture_type>
  <scope>partial</scope>
  <partial_root>src/features/auth</partial_root>
  <module_units>
    <unit path="src/features/auth" layer="features" />
  </module_units>
  <entrypoints>
    <entrypoint path="src/app/index.ts" />
  </entrypoints>
  <ruleset>morj-2025-09</ruleset>
</architecture_metadata>
```

## TIER 8: Применимость и валидация

### ✅ Подходит для

- Средних и сложных фронтенд приложений
- Проектов без явного доменного разделения
- Команд начинающих с FSD
- Приложений с чёткой функциональной структурой

### ❌ Не подходит для

- Простых приложений (используй `single_module` или `layered_library`)
- Проектов с явным доменным разделением (используй `fsd_domain`)
- Серверных приложений (используй `server_fsd`)
- Монорепозиториев с множественными приложениями (используй `multi_app_monolith`)

<completion_criteria>
Документ полностью готов к использованию: все правила FSD Standard архитектуры определены, примеры структуры предоставлены, XML-схемы для валидатора готовы, метаданные корректны. Документ соответствует стандарту reference-промптов и может быть использован для валидации архитектуры проектов.
</completion_criteria>

[REFERENCE-END]
