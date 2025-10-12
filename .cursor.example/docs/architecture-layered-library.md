---
id: architecture-layered-library
type: reference
use_cases:
    [
        'layered_library_architecture',
        'multi_module_packages',
        'ui_libraries',
        'shared_layers',
        'api_clients',
        'utility_packages',
    ]
prompt_language: ru
response_language: ru
alwaysApply: false
---

# Layered Library — Многомодульный пакет

[REFERENCE-BEGIN]

## TIER 1: Expert Role

<expert_role>
You are a Layered Library Architecture Specialist for TypeScript/React projects.

Responsibilities:

- Enforce Layered Library architecture rules with zero exceptions
- Ensure multi-module organization grouped by thematic layers (api, ui, lib, model)
- Validate facade patterns for each independent modular unit
- Guide proper layer usage and module encapsulation without FSD layers
- Prioritize encapsulation through unit facades and minimal public API

**ВАЖНО: Все ответы должны быть на русском языке.**
</expert_role>

<expert_completion_criteria>
Expert role clearly defines responsibilities specific to Layered Library architecture and includes Russian language requirement for responses.
</expert_completion_criteria>

## TIER 2: Назначение и применение

<exception_handling>
При работе с Layered Library архитектурой возможны следующие исключительные ситуации:

- Проект превышает лимит модульных единиц (более 10–15) → миграция на FSD или multi_app_monolith
- Нарушение слоистости → немедленное перемещение модулей в соответствующие слои
- Смешивание FSD-слоёв → строгая проверка на отсутствие pages/widgets/features/entities
- Неопределенность в выборе слоя → приоритет тематической группировки (api для интеграций, ui для компонентов)

Приоритеты исправления:

1. **Критичные:** Немедленно исправить (нарушение фасадов или слоёв)
2. **Средние:** Планировать рефакторинг модулей
3. **Низкие:** Добавить документацию для новых слоёв
   </exception_handling>

<algorithm_motivation>
Layered Library архитектура обеспечивает модульность и слоистую организацию для библиотек, упрощая поддержку и расширение без нарушения инкапсуляции. Группировка по тематическим слоям минимизирует зависимости и ускоряет поиск кода.
</algorithm_motivation>

<cognitive_triggers>
Давайте пошагово определим, подходит ли проект для Layered Library архитектуры, проанализировав количество модульных единиц, тематическую группировку и отсутствие FSD-структуры.
</cognitive_triggers>

<architecture_scope>
Layered Library — архитектурный тип для пакетов, содержащих несколько независимых модульных единиц, сгруппированных по тематическим слоям без FSD-слоёв.
**Назначение:** Библиотеки компонентов, shared-слои, утилитарные пакеты, API-клиенты.
**Ключевой принцип:** Фасады везде (каждый модуль имеет index.ts), общий вход через src/index.ts, слоистая группировка (api, ui, lib, model).
</architecture_scope>

<scope_completion_criteria>
Architecture scope clearly defines purpose, key principle, and decision criteria for Layered Library usage.
</scope_completion_criteria>

### Алгоритм определения архитектуры

<algorithm_steps>

1. **Анализ модульности:** Определи количество независимых модульных единиц (функции/компоненты/хуки)
2. **Подсчет файлов и слоёв:**
    - Unix/Linux: `find src -type f -name "*.ts*" | wc -l` (исключая тесты, types, configs)
    - Проверь наличие тематических групп (api, ui и т.д.)
3. **Оценка слоистости:** Проверь, можно ли сгруппировать по темам без FSD-структуры
4. **Принятие решения:** Применяй правила выбора архитектуры

</algorithm_steps>

Если проект содержит:

- ✓ Несколько (3–15) независимых модульных единиц
- ✓ Тематическую группировку (api для интеграций, ui для компонентов)
- ✓ Отсутствие FSD-слоёв (pages, features и т.д.)
- ✓ Общий фасад src/index.ts

### → Layered Library

Иначе → single_module (для 1–2 единиц) или FSD (для сложных приложений)

<step_completion_criteria>
Алгоритм четко структурирован с пошаговыми инструкциями и критериями принятия решений для Layered Library.
</step_completion_criteria>

<exception_handling>

Если количество модулей в пограничной зоне (2–3), проведи дополнительный анализ:

- Если модули тематически разные → Layered Library
- Если тесно связаны → single_module
- При сомнениях → выбери слоистую архитектуру для масштабируемости

Если модулей более 15 → обязательно используй FSD или multi_app_monolith.

</exception_handling>

### Быстрая проверка пригодности

| **Условие** | **✅ Подходит**                 | **❌ Не подходит**             |
| ----------- | ------------------------------- | ------------------------------ |
| Модульность | 3–15 независимых единиц         | 1 единица или >20              |
| Слои        | Тематическая группировка        | FSD-слои или плоская структура |
| Назначение  | Библиотеки, shared, API-клиенты | Полноценные приложения         |
| Зависимости | Минимальные внутри слоёв        | Сложные кросс-слоевые          |

### Основные характеристики

- **Модульность:** Множество независимых модульных единиц
- **Слоистость:** Группировка по тематическим слоям (api, ui, lib, model)
- **Фасады везде:** Каждая модульная единица имеет index.ts
- **Общий вход:** Единый фасад пакета src/index.ts

## TIER 3: Структура проекта

<output_format>

При описании структуры проекта используй XML-схему с четкими ролями файлов и их назначением. Для каждого элемента указывай:

- `name` — имя файла/директории
- `role` — роль (layer, module, facade, function, types, unit_test)
- `purpose` — назначение
- `exports` — что экспортирует (для фасадов)

</output_format>

<cognitive_triggers>
Давайте пошагово разберем обязательную структуру Layered Library, начиная с общего фасада и слоёв, добавляя модули и файлы.
</cognitive_triggers>

### Базовая схема

```xml
<package_root>
  <source_directory name="src">
    <entrypoint name="index.ts" purpose="Фасад пакета — общий вход" />
    <layer name="api" purpose="Слой интеграций">
      <directory name="external">
        <module name="service-name">
          <facade name="index.ts" role="unit_facade" purpose="Фасад модульной единицы" exports="createServiceClient" />
          <file name="client.ts" role="function" purpose="Основная функция интеграции" />
          <file name="types.ts" role="types" purpose="Локальные типы" />
          <directory name="__tests__" purpose="Тесты модуля">
            <test name="client.test.ts" role="unit_test" />
          </directory>
        </module>
      </directory>
    </layer>
    <layer name="ui" purpose="Слой компонентов">
      <directory name="base">
        <module name="button">
          <facade name="index.ts" role="unit_facade" purpose="Фасад модульной единицы" exports="Button" />
          <file name="Button.tsx" role="component" purpose="Основной компонент" />
          <file name="types.ts" role="types" purpose="Локальные типы" />
          <directory name="__tests__" purpose="Тесты модуля">
            <test name="button.test.tsx" role="unit_test" />
          </directory>
        </module>
      </directory>
    </layer>
    <layer name="lib" purpose="Слой утилит и хуков">
      <directory name="hooks">
        <module name="use-safe-back">
          <facade name="index.ts" role="unit_facade" purpose="Фасад модульной единицы" exports="useSafeBack" />
          <file name="use-safe-back.ts" role="function" purpose="Основной хук" />
          <directory name="__tests__" purpose="Тесты модуля">
            <test name="use-safe-back.test.ts" role="unit_test" />
          </directory>
        </module>
      </directory>
      <directory name="helpers">
        <module name="format-date">
          <facade name="index.ts" role="unit_facade" purpose="Фасад модульной единицы" exports="formatDate" />
          <file name="format-date.ts" role="function" purpose="Основная функция" />
          <directory name="__tests__" purpose="Тесты модуля">
            <test name="format-date.test.ts" role="unit_test" />
          </directory>
        </module>
      </directory>
    </layer>
    <layer name="model" purpose="Слой типов и схем">
      <directory name="types">
        <module name="user">
          <facade name="index.ts" role="unit_facade" purpose="Фасад модульной единицы" exports="type UserData" />
          <file name="user.ts" role="types" purpose="Типы пользователя" />
        </module>
      </directory>
      <directory name="schemas">
        <module name="validation">
          <facade name="index.ts" role="unit_facade" purpose="Фасад модульной единицы" exports="userSchema" />
          <file name="user-schema.ts" role="schemas" purpose="Схемы валидации" />
        </module>
      </directory>
    </layer>
  </source_directory>
</package_root>
```

<structure_completion_criteria>
Структура четко определена с XML-схемой, ролями элементов и их назначением для Layered Library.
</structure_completion_criteria>

### Разрешённые слои

#### Основные слои

- `api/` — интеграции с внешними сервисами
- `ui/` — компоненты пользовательского интерфейса
- `lib/` — утилиты, хуки, хелперы
- `model/` — типы, схемы, константы. Subdirs (constants/schemas/types): single main.ts preferred; nested modules allowed for sub-groups (e.g., constants/default-values/index.ts)

#### Дополнительные слои (до 10)

- `core/` — базовые утилиты и модули
- `schemas/` — схемы валидации (Zod, JSON Schema)
- `assets/` — статические ресурсы
- `services/` — сквозные сервисы пакета
- `cli/` — интерфейсы командной строки
- `config/` — конфигурационные модули
- `adapters/` — адаптеры внешних систем
- `gateways/` — доступ к инфраструктуре
- `workflows/` — бизнес-процессы
- `handlers/` — обработчики событий

#### Произвольные слои

Допускается 0–3 дополнительных слоя с осмысленными названиями по проекту.

## TIER 4: Правила и ограничения

### ✅ Требования

- [ ] **Фасад пакета:** `src/index.ts` как общая точка входа
- [ ] **Фасады модулей:** У каждой модульной единицы есть `index.ts` фасад
- [ ] **Инкапсуляция:** Нет экспорта внутренних хелперов наружу
- [ ] **Именованные экспорты:** Только именованные экспорты
- [ ] **Тесты рядом:** Тесты в `__tests__/` на уровне модуля
- [ ] **Одна функция на файл:** Каждый файл — одна основная функция/компонент
- [ ] **Слоистая организация:** Модули сгруппированы по тематическим слоям
- [ ] **Фасады index.ts:** Re-exports OR single main function (simple modules ≤10 lines total; no multiple functions/helpers)
- [ ] **Helpers:** Отдельный файл если exported или >10 строк; private — inline в main function file

### ❌ Запрещено

- FSD-слои (`pages`, `widgets`, `features`, `entities`)
- Прямые импорты из внутренних частей модульных единиц
- Экспорт вспомогательных элементов через главный фасад
- Кросс-импорты между модульными единицами внутри слоя
- `Default` экспорты
- Фасады с несколькими функциями/logic (god facades)
- Экспорт helpers наружу через фасад

### Risk Assessment

<cognitive_triggers>
Давайте проанализируем потенциальные риски при использовании Layered Library архитектуры и способы их смягчения.
</cognitive_triggers>

**Потенциальные проблемы и решения:**

| **Риск**                  | **Симптомы**                | **Смягчение**                                                    |
| ------------------------- | --------------------------- | ---------------------------------------------------------------- |
| Нарушение слоистости      | Модули в неправильных слоях | ESLint: правила для путей импортов + проверка тематики           |
| Превышение модулей        | >15 модульных единиц        | Миграция на FSD или multi_app_monolith                           |
| Утечка внутренних API     | Экспорт helper-функций      | Скрытие через фасады, только публичный API                       |
| Кросс-слоевые зависимости | Импорты нарушают тематику   | Ограничение импортов по слоям (lib → ui разрешено, ui → lib нет) |

<risk_completion_criteria>
Risk Assessment содержит конкретные риски, их симптомы и способы смягчения для Layered Library.
</risk_completion_criteria>

## TIER 5: Примеры использования

### UI Kit библиотека

**Описание:** Библиотека компонентов с слоями ui, lib, model

```xml
<package_root>
  <source_directory name="src">
    <entrypoint name="index.ts" purpose="Главный фасад" />
    <layer name="ui" purpose="Компоненты">
      <directory name="base">
        <module name="button">
          <facade name="index.ts" role="unit_facade" exports="Button" />
          <file name="Button.tsx" role="component" />
          <file name="types.ts" role="types" />
          <directory name="__tests__">
            <test name="button.test.tsx" role="unit_test" />
          </directory>
        </module>
        <module name="input">
          <facade name="index.ts" role="unit_facade" exports="Input" />
          <file name="Input.tsx" role="component" />
          <directory name="__tests__">
            <test name="input.test.tsx" role="unit_test" />
          </directory>
        </module>
      </directory>
      <directory name="complex">
        <module name="form">
          <facade name="index.ts" role="unit_facade" exports="Form" />
          <file name="Form.tsx" role="component" />
          <directory name="__tests__">
            <test name="form.test.tsx" role="unit_test" />
          </directory>
        </module>
      </directory>
    </layer>
    <layer name="lib" purpose="Утилиты">
      <directory name="hooks">
        <module name="use-form">
          <facade name="index.ts" role="unit_facade" exports="useForm" />
          <file name="use-form.ts" role="function" />
          <directory name="__tests__">
            <test name="use-form.test.ts" role="unit_test" />
          </directory>
        </module>
        <module name="use-validation">
          <facade name="index.ts" role="unit_facade" exports="useValidation" />
          <file name="use-validation.ts" role="function" />
          <directory name="__tests__">
            <test name="use-validation.test.ts" role="unit_test" />
          </directory>
        </module>
      </directory>
      <directory name="helpers">
        <module name="format-utils">
          <facade name="index.ts" role="unit_facade" exports="formatDate" />
          <file name="format-date.ts" role="function" />
          <directory name="__tests__">
            <test name="format-date.test.ts" role="unit_test" />
          </directory>
        </module>
      </directory>
    </layer>
    <layer name="model" purpose="Типы и схемы">
      <directory name="types">
        <module name="form">
          <facade name="index.ts" role="unit_facade" exports="type FormProps, FormState" />
          <file name="form.ts" role="types" />
        </module>
      </directory>
      <directory name="schemas">
        <module name="validation">
          <facade name="index.ts" role="unit_facade" exports="formSchema" />
          <file name="form-schema.ts" role="schemas" />
        </module>
      </directory>
    </layer>
  </source_directory>
</package_root>
```

### API интеграционная библиотека

**Описание:** Библиотека для нескольких внешних сервисов

```xml
<package_root>
  <source_directory name="src">
    <entrypoint name="index.ts" purpose="Главный фасад" />
    <layer name="api" purpose="Интеграции">
      <directory name="external">
        <module name="payment-service">
          <facade name="index.ts" role="unit_facade" exports="createPaymentClient" />
          <file name="client.ts" role="function" />
          <file name="types.ts" role="types" />
          <directory name="__tests__">
            <test name="client.test.ts" role="unit_test" />
          </directory>
        </module>
        <module name="analytics-service">
          <facade name="index.ts" role="unit_facade" exports="createAnalyticsClient" />
          <file name="client.ts" role="function" />
          <directory name="__tests__">
            <test name="client.test.ts" role="unit_test" />
          </directory>
        </module>
      </directory>
      <directory name="internal">
        <module name="user-api">
          <facade name="index.ts" role="unit_facade" exports="userEndpoints" />
          <file name="endpoints.ts" role="function" />
          <directory name="__tests__">
            <test name="endpoints.test.ts" role="unit_test" />
          </directory>
        </module>
      </directory>
    </layer>
    <layer name="lib" purpose="Утилиты">
      <directory name="helpers">
        <module name="http-client">
          <facade name="index.ts" role="unit_facade" exports="httpClient" />
          <file name="http-client.ts" role="function" />
          <directory name="__tests__">
            <test name="http-client.test.ts" role="unit_test" />
          </directory>
        </module>
        <module name="retry-logic">
          <facade name="index.ts" role="unit_facade" exports="withRetry" />
          <file name="retry.ts" role="function" />
          <directory name="__tests__">
            <test name="retry.test.ts" role="unit_test" />
          </directory>
        </module>
      </directory>
    </layer>
    <layer name="model" purpose="Типы и схемы">
      <directory name="types">
        <module name="api">
          <facade name="index.ts" role="unit_facade" exports="type ApiResponse" />
          <file name="api.ts" role="types" />
        </module>
      </directory>
      <directory name="schemas">
        <module name="requests">
          <facade name="index.ts" role="unit_facade" exports="paymentSchema" />
          <file name="payment-schema.ts" role="schemas" />
        </module>
      </directory>
    </layer>
  </source_directory>
</package_root>
```

**Примечание:** Каждый слой содержит только релевантные модули; тесты всегда рядом с кодом.

### Пример фасада

**✅ Correct facade (re-exports only):**

```typescript
// src/lib/helpers/format-date/index.ts
export { formatDate } from './format-date';
export type { DateFormatOptions } from './types';
```

**❌ Incorrect (logic in facade):**

```typescript
// BAD: functions in index.ts
export function formatDate(date: Date) { ... }  // Logic here violates
export { formatDate };  // Duplicate
```

### Simple single-function facade

**✅ Correct (single function):**

```typescript
// src/lib/simple-utils/simple-func/index.ts
/** Простая утилита */
export function simpleFunc(value: string): string {
    if (!value) return '';
    return value.toUpperCase();
}
```

### Model layer example

**Single file (simple subdir):**
constants/main.ts — exports DEFAULT_CONFIG etc. (self-contained, no facade dir).

**Nested sub-module:**
constants/default-values/index.ts — facade re-exports from sub-files (complex).

## TIER 6: XML-схема для валидатора

```xml
<package_root>
  <source_directory name="src">
    <entrypoint name="index.ts" />
    <layer name="api" purpose="интеграции">
      <directory name="external">
        <module name="service-name">
          <facade name="index.ts" role="unit_facade" />
          <file name="client.ts" role="function" />
          <test name="__tests__/client.test.ts" role="unit_test" />
        </module>
      </directory>
    </layer>
    <layer name="ui" purpose="компоненты">
      <directory name="base">
        <module name="button">
          <facade name="index.ts" role="unit_facade" />
          <file name="Button.tsx" role="component" />
          <file name="types.ts" role="types" />
          <test name="__tests__/button.test.ts" role="unit_test" />
        </module>
      </directory>
    </layer>
    <layer name="lib" purpose="утилиты и хуки">
      <directory name="hooks">
        <module name="use-safe-back">
          <facade name="index.ts" role="unit_facade" />
          <file name="use-safe-back.ts" role="function" />
          <test name="__tests__/use-safe-back.test.ts" role="unit_test" />
        </module>
      </directory>
    </layer>
    <layer name="model" purpose="типы и схемы">
      <directory name="types">
        <module name="user">
          <facade name="index.ts" role="unit_facade" />
          <file name="user.ts" role="types" />
        </module>
      </directory>
    </layer>
  </source_directory>
</package_root>
```

> Примечание: для больших пакетов допускается разбиение структуры на несколько XML-файлов (формат `bundle` в папке `architecture/`). Для простых пакетов используется один файл `architecture.xml` в корне пакета (формат `single`). Валидатор объединяет такие файлы детерминированно и проверяет согласованность метаданных.

## TIER 7: Метаданные для валидатора

### Полная валидация

```xml
<architecture_metadata version="1" language="ts">
  <architecture_type>layered_library</architecture_type>
  <scope>full</scope>
  <module_units>
    <unit path="src/api/external/service-name" layer="api" />
    <unit path="src/ui/base/button" layer="ui" />
    <unit path="src/lib/hooks/use-safe-back" layer="lib" />
    <unit path="src/model/types/user" layer="model" />
  </module_units>
  <entrypoints>
    <entrypoint path="src/index.ts" />
  </entrypoints>
  <ruleset>morj-2025-09</ruleset>
</architecture_metadata>
```

### Частичная валидация (отдельный модуль)

```xml
<architecture_metadata version="1" language="ts">
  <architecture_type>layered_library</architecture_type>
  <scope>partial</scope>
  <partial_root>src/ui/base/button</partial_root>
  <module_units>
    <unit path="src/ui/base/button" layer="ui" />
  </module_units>
  <entrypoints>
    <entrypoint path="src/index.ts" />
  </entrypoints>
  <ruleset>morj-2025-09</ruleset>
</architecture_metadata>
```

## TIER 8: Применимость и валидация

### ✅ Подходит для

- UI-библиотек и дизайн-систем
- Shared-слоёв в FSD приложениях
- Утилитарных библиотек с разными областями
- API клиентов для множественных сервисов
- Библиотек хуков и хелперов

### ❌ Не подходит для

- Простых пакетов с одной функцией (используй `single_module`)
- Полноценных приложений (используй `fsd_*`)
- Монолитов с множественными приложениями (используй `multi_app_monolith`)

<completion_criteria>
Документ полностью готов к использованию: все правила Layered Library архитектуры определены, примеры структуры предоставлены, XML-схемы для валидатора готовы, метаданные корректны. Документ соответствует стандарту reference-промптов и может быть использован для валидации архитектуры проектов.
</completion_criteria>

[REFERENCE-END]
