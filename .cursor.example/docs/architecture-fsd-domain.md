---
id: architecture-fsd-domain
type: reference
use_cases:
    [
        'fsd_domain_architecture',
        'feature_sliced_design_with_domains',
        'large_frontend_applications',
        'business_domains',
        'enterprise_projects',
    ]
prompt_language: ru
response_language: ru
alwaysApply: false
---

# FSD Domain — Feature-Sliced Design с доменами

[REFERENCE-BEGIN]

## TIER 1: Expert Role

<expert_role>
You are a FSD Domain Architecture Specialist for TypeScript/React projects.

Responsibilities:

- Enforce FSD Domain architecture rules with zero exceptions
- Ensure strict layer hierarchy: app → pages → widgets → features → entities → shared → core with domain grouping in widgets, features, entities
- Validate domain separation and weak coupling between domains via public APIs
- Guide proper domain application (user, payments, betting) and slice organization within domains
- Prioritize no cross-imports within domains on the same layer and downward dependencies only

**ВАЖНО: Все ответы должны быть на русском языке.**
</expert_role>

<expert_completion_criteria>
Expert role clearly defines responsibilities specific to FSD Domain architecture and includes Russian language requirement for responses.
</expert_completion_criteria>

## TIER 2: Назначение и применение

<exception_handling>
При работе с FSD Domain архитектурой возможны следующие исключительные ситуации:

- Проект без доменного разделения → миграция на fsd_standard
- Нарушение доменной связанности → немедленное рефакторинг импортов между доменами
- Кросс-импорты внутри домена → строгая проверка и перемещение в shared
- Неопределенность в домене → приоритет по бизнес-сущностям (user для авторизации, payments для платежей)

Приоритеты исправления:

1. **Критичные:** Немедленно исправить (нарушение иерархии или доменной связанности)
2. **Средние:** Планировать рефакторинг доменов
3. **Низкие:** Добавить фасады для междоменных взаимодействий
   </exception_handling>

<algorithm_motivation>
FSD Domain архитектура обеспечивает доменное разделение для крупных приложений, минимизируя связанность через публичные API и строгую иерархию, упрощая поддержку enterprise-уровня.
</algorithm_motivation>

<cognitive_triggers>
Давайте пошагово определим, подходит ли проект для FSD Domain архитектуры, проанализировав наличие бизнес-доменов, сложность и необходимость разделения.
</cognitive_triggers>

<architecture_scope>
FSD Domain — архитектурный тип для фронтенд-приложений с Feature-Sliced Design и доменным разделением, где слайсы группируются по бизнес-сущностям (user, payments) в слоях widgets, features, entities.
**Назначение:** Большие фронтенд-приложения с явными бизнес-доменами.
**Ключевой принцип:** Строгая иерархия слоёв, доменная группировка, слабая связанность доменов через фасады, запрет кросс-импортов внутри домена.
</architecture_scope>

<scope_completion_criteria>
Architecture scope clearly defines purpose, key principle, and decision criteria for FSD Domain usage.
</scope_completion_criteria>

### Алгоритм определения архитектуры

<algorithm_steps>

1. **Анализ доменов:** Определи наличие бизнес-доменов (user, payments, betting)
2. **Проверка сложности:** Убедись в высокой сложности с множественными областями
3. **Оценка связанности:** Проверь необходимость разделения по доменам для слабой связанности
4. **Принятие решения:** Применяй правила выбора архитектуры

</algorithm_steps>

Если проект содержит:

- ✓ Явные бизнес-домены (user, payments, betting)
- ✓ Высокую сложность (>50 слайсов)
- ✓ Необходимость слабой связанности доменов
- ✓ Фронтенд-приложение enterprise-уровня

### → FSD Domain

Иначе → fsd_standard (без доменов) или multi_app_monolith (множественные приложения)

<step_completion_criteria>
Алгоритм четко структурирован с пошаговыми инструкциями и критериями принятия решений для FSD Domain.
</step_completion_criteria>

<exception_handling>

Если проект в пограничной зоне (несколько доменов, но малая сложность), проведи дополнительный анализ:

- Если домены не критичны → fsd_standard
- Если требуется полное разделение → FSD Domain
- При сомнениях → выбери FSD Domain для масштабируемости

Если проект серверный → используй server_fsd.

</exception_handling>

### Быстрая проверка пригодности

| **Условие** | **✅ Подходит**                | **❌ Не подходит**      |
| ----------- | ------------------------------ | ----------------------- |
| Домены      | Явные бизнес-домены            | Отсутствуют             |
| Сложность   | Высокая/enterprise             | Средняя или простая     |
| Структура   | Группировка по доменам в слоях | Без доменов или плоская |
| Тип проекта | Крупное фронтенд-приложение    | Библиотека или сервер   |

### Основные характеристики

- **Слоистая архитектура:** Строгая иерархия app → pages → widgets → features → entities → shared → core
- **Доменное разделение:** Слайсы группируются по бизнес-сущностям
- **Фасады слайсов:** Каждый слайс имеет index.ts
- **Запрет кросс-импортов:** Слайсы одного слоя не импортируют друг друга
- **Слабая связанность доменов:** Домены взаимодействуют только через публичные API

## TIER 3: Структура проекта

<output_format>

При описании структуры проекта используй XML-схему с четкими ролями файлов и их назначением. Для каждого элемента указывай:

- `name` — имя файла/директории
- `role` — роль (layer, domain, module, facade, segment, component, function, types, unit_test)
- `purpose` — назначение
- `exports` — что экспортирует (для фасадов)

</output_format>

<cognitive_triggers>
Давайте пошагово разберем структуру FSD Domain, начиная с иерархии слоёв, доменов и слайсов.
</cognitive_triggers>

### Базовая схема

```xml
<package_root>
  <source_directory name="src">
    <layer name="app" purpose="Глобальная инициализация">
      <entrypoint name="index.ts" purpose="Точка входа" />
      <directory name="providers">
        <file name="global-providers.tsx" role="component" purpose="Глобальные провайдеры" />
      </directory>
    </layer>
    <layer name="pages" purpose="Страницы (без доменов)">
      <module name="home">
        <facade name="index.ts" role="slice_facade" exports="HomePage" />
        <segment name="ui">
          <file name="HomePage.tsx" role="component" />
        </segment>
        <segment name="route">
          <file name="index.ts" role="config" />
        </segment>
      </module>
      <module name="profile">
        <facade name="index.ts" role="slice_facade" exports="ProfilePage" />
        <segment name="ui">
          <file name="ProfilePage.tsx" role="component" />
        </segment>
      </module>
    </layer>
    <layer name="widgets" purpose="Виджеты с доменами">
      <directory name="user" purpose="Домен user">
        <module name="user-header">
          <facade name="index.ts" role="slice_facade" exports="UserHeader" />
          <segment name="ui">
            <file name="UserHeader.tsx" role="component" />
          </segment>
        </module>
      </directory>
      <directory name="payments" purpose="Домен payments">
        <module name="payment-widget">
          <facade name="index.ts" role="slice_facade" exports="PaymentWidget" />
          <segment name="ui">
            <file name="PaymentWidget.tsx" role="component" />
          </segment>
        </module>
      </directory>
    </layer>
    <layer name="features" purpose="Фичи с доменами">
      <directory name="user" purpose="Домен user">
        <module name="auth">
          <facade name="index.ts" role="slice_facade" exports="AuthForm" />
          <segment name="ui">
            <file name="AuthForm.tsx" role="component" />
          </segment>
          <segment name="model">
            <file name="authStore.ts" role="function" />
          </segment>
        </module>
        <module name="profile">
          <facade name="index.ts" role="slice_facade" exports="ProfileFeature" />
          <segment name="ui">
            <file name="ProfileForm.tsx" role="component" />
          </segment>
        </module>
      </directory>
      <directory name="payments" purpose="Домен payments">
        <module name="payment-form">
          <facade name="index.ts" role="slice_facade" exports="PaymentForm" />
          <segment name="ui">
            <file name="PaymentForm.tsx" role="component" />
          </segment>
          <segment name="service">
            <file name="paymentService.ts" role="workflow" />
          </segment>
        </module>
      </directory>
    </layer>
    <layer name="entities" purpose="Сущности с доменами">
      <directory name="user" purpose="Домен user">
        <module name="user">
          <facade name="index.ts" role="slice_facade" exports="UserEntity" />
          <segment name="model">
            <file name="userModel.ts" role="function" />
            <file name="userTypes.ts" role="types" />
          </segment>
        </module>
      </directory>
      <directory name="payments" purpose="Домен payments">
        <module name="payment">
          <facade name="index.ts" role="slice_facade" exports="PaymentEntity" />
          <segment name="model">
            <file name="paymentModel.ts" role="function" />
          </segment>
        </module>
      </directory>
    </layer>
    <layer name="shared" purpose="Shared (без доменов)">
      <directory name="ui">
        <module name="button">
          <facade name="index.tsx" role="unit_facade" exports="Button" />
          <file name="Button.tsx" role="component" />
        </module>
      </directory>
    </layer>
    <layer name="core" purpose="Core (без доменов)">
      <directory name="router">
        <file name="index.ts" role="function" purpose="Роутер" />
      </directory>
    </layer>
  </source_directory>
</package_root>
```

<structure_completion_criteria>
Структура четко определена с XML-схемой, ролями элементов и их назначением для FSD Domain.
</structure_completion_criteria>

### Иерархия слоёв

app → pages → widgets → features → entities → shared → core

Слои могут зависеть только от нижележащих.

### Доменная структура

#### Применение доменов

**Домены применяются только на слоях:**

- `widgets` — виджеты, связанные с доменом
- `features` — фичи конкретного домена
- `entities` — сущности домена

**Домены НЕ применяются на слоях:**

- `app` — глобальная инициализация
- `pages` — страницы могут использовать множественные домены
- `shared` — код, не связанный с бизнес-логикой
- `core` — базовые библиотеки

#### Примеры доменов

| **Домен**  | **Описание**              | **Примеры слайсов**                            |
| ---------- | ------------------------- | ---------------------------------------------- |
| `user`     | Управление пользователями | `auth`, `profile`, `registration`, `settings`  |
| `payments` | Платежная система         | `payment-form`, `billing`, `invoices`, `cards` |
| `betting`  | Ставки и прогнозы         | `bet-slip`, `odds`, `events`, `results`        |
| `gambling` | Азартные игры             | `casino`, `slots`, `poker`, `live-games`       |
| `loyalty`  | Программы лояльности      | `points`, `rewards`, `promotions`, `bonuses`   |
| `system`   | Системные функции         | `notifications`, `settings`, `monitoring`      |

## TIER 4: Правила и ограничения

### ✅ Требования

- [ ] **Иерархия слоёв:** Соответствует FSD с зависимостями только вниз по иерархии
- [ ] **Доменная организация:** Слои `widgets`, `features`, `entities` сгруппированы по доменам
- [ ] **Фасады слайсов:** У всех слайсов есть `index.ts` как Public API
- [ ] **Запрет кросс-импортов внутри домена:** Нет импортов между слайсами одного домена на одном слое
- [ ] **Междоменные импорты по иерархии:** Импорты между доменами соблюдают иерархию слоёв
- [ ] **Именованные экспорты:** Только именованные экспорты
- [ ] **Тесты на уровне слайсов:** Тесты в `__tests__/` рядом со слайсами

### ❌ Запрещено

- Нарушение иерархии слоёв (импорт из вышестоящих слоёв)
- Кросс-импорты между слайсами внутри одного домена на одном слое
- Прямой импорт из внутренних частей слайсов (только через фасады)
- Циклические зависимости между доменами
- `Default` экспорты

### Правила взаимодействия доменов

#### ✅ Правила взаимодействия доменов

- **Импорт из слайса одного домена в слайс другого домена ДОПУСКАЕТСЯ**, если соблюдена вертикальная иерархия слоёв
- **Запрещены прямые импорты между слайсами ВНУТРИ одного домена** на одном слое
- **Домены взаимодействуют через публичные API** слайсов (фасады)

#### Примеры допустимых импортов

```typescript
// ✅ МОЖНО: features/payments импортирует entities/user
// (нижележащий слой + другой домен)
import { User } from 'entities/user';

// ✅ МОЖНО: widgets/betting импортирует features/user
// (нижележащий слой + другой домен)
import { AuthForm } from 'features/user';

// ❌ НЕЛЬЗЯ: features/user/auth импортирует features/user/profile
// (тот же слой + тот же домен)
import { ProfileForm } from 'features/user/profile';

// ❌ НЕЛЬЗЯ: features/user импортирует widgets/payments
// (вышестоящий слой)
import { PaymentWidget } from 'widgets/payments';
```

### Risk Assessment

<cognitive_triggers>
Давайте проанализируем потенциальные риски при использовании FSD Domain архитектуры и способы их смягчения.
</cognitive_triggers>

**Потенциальные проблемы и решения:**

| **Риск**                    | **Симптомы**                  | **Смягчение**                                          |
| --------------------------- | ----------------------------- | ------------------------------------------------------ |
| Сильная связанность доменов | Частые импорты между доменами | Ограничение до публичных API + рефакторинг в shared    |
| Нарушение иерархии          | Импорты нарушают слои/домены  | ESLint: правила импортов + автоматизированная проверка |
| Рост доменов без контроля   | >10 доменов без документации  | Документация доменов + миграция на multi_app_monolith  |
| Кросс-импорты внутри домена | Зависимости в одном домене    | Рефакторинг: выделение в отдельные слайсы или shared   |

<risk_completion_criteria>
Risk Assessment содержит конкретные риски, их симптомы и способы смягчения для FSD Domain.
</risk_completion_criteria>

## TIER 5: Примеры использования

### Пример структуры с доменами

**Описание:** Приложение с доменами user и payments

```xml
<package_root>
  <source_directory name="src">
    <layer name="app" purpose="Глобальная инициализация">
      <entrypoint name="index.ts" purpose="Точка входа" />
      <directory name="providers">
        <file name="global-providers.tsx" role="component" purpose="Глобальные провайдеры" />
      </directory>
    </layer>
    <layer name="pages" purpose="Страницы (без доменов)">
      <module name="home">
        <facade name="index.ts" role="slice_facade" exports="HomePage" />
        <segment name="ui">
          <file name="HomePage.tsx" role="component" />
        </segment>
        <segment name="route">
          <file name="index.ts" role="config" />
        </segment>
      </module>
      <module name="profile">
        <facade name="index.ts" role="slice_facade" exports="ProfilePage" />
        <segment name="ui">
          <file name="ProfilePage.tsx" role="component" />
        </segment>
      </module>
    </layer>
    <layer name="widgets" purpose="Виджеты с доменами">
      <directory name="user" purpose="Домен user">
        <module name="user-header">
          <facade name="index.ts" role="slice_facade" exports="UserHeader" />
          <segment name="ui">
            <file name="UserHeader.tsx" role="component" />
          </segment>
        </module>
      </directory>
      <directory name="payments" purpose="Домен payments">
        <module name="payment-widget">
          <facade name="index.ts" role="slice_facade" exports="PaymentWidget" />
          <segment name="ui">
            <file name="PaymentWidget.tsx" role="component" />
          </segment>
        </module>
      </directory>
    </layer>
    <layer name="features" purpose="Фичи с доменами">
      <directory name="user" purpose="Домен user">
        <module name="auth">
          <facade name="index.ts" role="slice_facade" exports="AuthForm" />
          <segment name="ui">
            <file name="AuthForm.tsx" role="component" />
          </segment>
          <segment name="model">
            <file name="authStore.ts" role="function" />
          </segment>
        </module>
        <module name="profile">
          <facade name="index.ts" role="slice_facade" exports="ProfileFeature" />
          <segment name="ui">
            <file name="ProfileForm.tsx" role="component" />
          </segment>
        </module>
      </directory>
      <directory name="payments" purpose="Домен payments">
        <module name="payment-form">
          <facade name="index.ts" role="slice_facade" exports="PaymentForm" />
          <segment name="ui">
            <file name="PaymentForm.tsx" role="component" />
          </segment>
          <segment name="service">
            <file name="paymentService.ts" role="workflow" />
          </segment>
        </module>
      </directory>
    </layer>
    <layer name="entities" purpose="Сущности с доменами">
      <directory name="user" purpose="Домен user">
        <module name="user">
          <facade name="index.ts" role="slice_facade" exports="UserEntity" />
          <segment name="model">
            <file name="userModel.ts" role="function" />
            <file name="userTypes.ts" role="types" />
          </segment>
        </module>
      </directory>
      <directory name="payments" purpose="Домен payments">
        <module name="payment">
          <facade name="index.ts" role="slice_facade" exports="PaymentEntity" />
          <segment name="model">
            <file name="paymentModel.ts" role="function" />
          </segment>
        </module>
      </directory>
    </layer>
    <layer name="shared" purpose="Shared (без доменов)">
      <directory name="ui">
        <module name="button">
          <facade name="index.tsx" role="unit_facade" exports="Button" />
          <file name="Button.tsx" role="component" />
        </module>
      </directory>
    </layer>
    <layer name="core" purpose="Core (без доменов)">
      <directory name="router">
        <file name="index.ts" role="function" purpose="Роутер" />
      </directory>
    </layer>
  </source_directory>
</package_root>
```

**Примечание:** Домены группируют слайсы в widgets, features, entities; pages и shared без доменов; взаимодействия через фасады.

### Пример домена user в features

**Описание:** Слайсы auth и profile в домене user

```xml
<directory name="user" purpose="Домен user">
  <module name="auth">
    <facade name="index.ts" role="slice_facade" exports="AuthForm" />
    <segment name="ui">
      <file name="AuthForm.tsx" role="component" />
    </segment>
    <segment name="model">
      <file name="authStore.ts" role="function" />
    </segment>
    <segment name="service">
      <file name="authService.ts" role="workflow" />
    </segment>
  </module>
  <module name="profile">
    <facade name="index.ts" role="slice_facade" exports="ProfileFeature" />
    <segment name="ui">
      <file name="ProfileForm.tsx" role="component" />
    </segment>
    <segment name="model">
      <file name="profileStore.ts" role="function" />
    </segment>
  </module>
</directory>
```

## TIER 6: XML-схема для валидатора

```xml
<package_root>
  <source_directory name="src">
    <layer name="app" purpose="инициализация приложения">
      <entrypoint name="index.ts" />
    </layer>
    <layer name="widgets" purpose="виджеты">
      <directory name="user">
        <module name="user-header">
          <facade name="index.ts" role="slice_facade" />
          <segment name="ui" purpose="UI компоненты">
            <file name="common/UserHeader.tsx" role="component" />
          </segment>
        </module>
      </directory>
      <directory name="betting">
        <module name="bet-slip">
          <facade name="index.ts" role="slice_facade" />
          <segment name="ui" purpose="UI компоненты">
            <file name="common/BetSlip.tsx" role="component" />
          </segment>
        </module>
      </directory>
    </layer>
    <layer name="features" purpose="фичи">
      <directory name="user">
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
      </directory>
      <directory name="payments">
        <module name="payment-form">
          <facade name="index.ts" role="slice_facade" />
          <segment name="ui" purpose="UI компоненты">
            <file name="common/PaymentForm.tsx" role="component" />
          </segment>
        </module>
      </directory>
    </layer>
    <layer name="entities" purpose="сущности">
      <directory name="user">
        <module name="user">
          <facade name="index.ts" role="slice_facade" />
          <segment name="model" purpose="модель пользователя">
            <file name="types/index.ts" role="types" />
            <file name="store/index.ts" role="function" />
          </segment>
        </module>
      </directory>
    </layer>
    <layer name="shared" purpose="разделяемый код">
      <directory name="ui">
        <directory name="base">
          <module name="button">
            <facade name="index.tsx" role="unit_facade" />
            <file name="Button.tsx" role="component" />
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
  <architecture_type>fsd_domain</architecture_type>
  <scope>full</scope>
  <module_units>
    <unit path="src/widgets/user/user-header" layer="widgets" />
    <unit path="src/features/user/auth" layer="features" />
    <unit path="src/features/payments/payment-form" layer="features" />
    <unit path="src/entities/user/user" layer="entities" />
    <unit path="src/shared/ui/base/button" layer="shared" />
  </module_units>
  <entrypoints>
    <entrypoint path="src/app/index.ts" />
  </entrypoints>
  <ruleset>morj-2025-09</ruleset>
</architecture_metadata>
```

### Частичная валидация (отдельный домен)

```xml
<architecture_metadata version="1" language="ts">
  <architecture_type>fsd_domain</architecture_type>
  <scope>partial</scope>
  <partial_root>src/features/user</partial_root>
  <module_units>
    <unit path="src/features/user/auth" layer="features" />
    <unit path="src/features/user/profile" layer="features" />
  </module_units>
  <entrypoints>
    <entrypoint path="src/app/index.ts" />
  </entrypoints>
  <ruleset>morj-2025-09</ruleset>
</architecture_metadata>
```

## TIER 8: Применимость и валидация

### ✅ Подходит для

- Больших фронтенд приложений с явным доменным разделением
- Проектов с несколькими бизнес-областями
- Команд с опытом FSD
- Enterprise приложений с множественными функциональностями

### ❌ Не подходит для

- Простых приложений (используй `single_module` или `layered_library`)
- Проектов без явного доменного разделения (используй `fsd_standard`)
- Серверных приложений (используй `server_fsd`)
- Монорепозиториев с множественными приложениями (используй `multi_app_monolith`)

<completion_criteria>
Документ полностью готов к использованию: все правила FSD Domain архитектуры определены, примеры структуры предоставлены, XML-схемы для валидатора готовы, метаданные корректны. Документ соответствует стандарту reference-промптов и может быть использован для валидации архитектуры проектов.
</completion_criteria>

[REFERENCE-END]
