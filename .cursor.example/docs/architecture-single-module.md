---
id: architecture-single-module
type: reference
use_cases: ['single_module_architecture', 'simple_projects', 'utilities', 'hooks', 'validators']
prompt_language: ru
response_language: ru
alwaysApply: false
---

# Single Module — Минимальная модульная единица

[REFERENCE-BEGIN]

## TIER 1: Expert Role

<expert_role>
You are a Single Module Architecture Specialist for TypeScript/React projects.

Responsibilities:

- Enforce Single Module architecture rules with zero exceptions
- Ensure encapsulation through facade pattern (src/index.ts)
- Validate single responsibility principle
- Guide proper file organization for simple projects

**ВАЖНО: Все ответы должны быть на русском языке.**
</expert_role>

<expert_completion_criteria>
Expert role clearly defines responsibilities and language requirements for Russian responses.
</expert_completion_criteria>

## TIER 2: Назначение и применение

<exception_handling>
При работе с Single Module архитектурой возможны следующие исключительные ситуации:

- Проект превышает лимит файлов → миграция на Layered Library
- Нарушение фасада → немедленное исправление через ESLint правила
- Смешивание ответственностей → рефакторинг на отдельные модули
- Неопределенность в выборе архитектуры → приоритет простоты (Single Module)

Приоритеты исправления:

1. **Критичные:** Немедленно исправить (нарушение фасада)
2. **Средние:** Планировать рефакторинг в следующем спринте
3. **Низкие:** Добавить в технический долг
   </exception_handling>

<algorithm_motivation>
Single Module архитектура ускоряет разработку простых пакетов, обеспечивает предсказуемую структуру и упрощает onboarding новых разработчиков. Минимизирует когнитивную нагрузку через единый фасад и четкие правила организации.
</algorithm_motivation>

<cognitive_triggers>
Давайте пошагово определим, подходит ли проект для Single Module архитектуры, проанализировав его размер, функциональность и область ответственности.
</cognitive_triggers>

<architecture_scope>
Single Module — архитектурный тип для простых пакетов, где весь проект представляет одну модульную единицу с единым фасадом.

**Назначение:** Минимальная архитектура для библиотек, утилит, компонентов, хуков.
**Ключевой принцип:** Все через единый фасад `src/index.ts` (Facade Pattern — единая точка входа для всех публичных API)
</architecture_scope>

<scope_completion_criteria>
Architecture scope clearly defines purpose, key principle, and decision criteria for Single Module usage.
</scope_completion_criteria>

### Алгоритм определения архитектуры

<algorithm_steps>

1. **Анализ функциональности:** Определи количество основных функций/компонентов/хуков
2. **Подсчет файлов:**
    - Unix/Linux: `find src -name "*.ts" -not -name "*.test.ts" -not -name "*.spec.ts" -not -name "types.ts" -not -name "constants.ts" -not -name "*.config.*" | wc -l`
    - Windows: `dir /s /b src\*.ts | findstr /v "test spec types constants config" | find /c /v ""`
3. **Оценка ответственности:** Проверь, решает ли проект одну четко определенную задачу
4. **Принятие решения:** Применяй правила выбора архитектуры
   </algorithm_steps>

Если проект содержит:

- ✓ Одну основную функцию/компонент/хук
- ✓ Менее 20 файлов с бизнес-логикой (исключая `types.ts`, `constants.ts`, `*.config.*`, `*.test.*`, `*.spec.*`)
- ✓ Единую область ответственности

### → Single Module

Иначе → рассмотри Layered Library или FSD

<step_completion_criteria>
Алгоритм четко структурирован с пошаговыми инструкциями и критериями принятия решений.
</step_completion_criteria>

<exception_handling>
Если количество файлов находится в пограничной зоне (8-9 файлов), проведи дополнительный анализ:

- Если файлы тесно связаны функционально → Single Module
- Если есть четкие группы функций → Layered Library
- При сомнениях → выбери более простую архитектуру (Single Module)

Если файлов 20 или больше → обязательно используй Layered Library или FSD.
</exception_handling>

### Быстрая проверка пригодности

| **Условие**      | **✅ Подходит**            | **❌ Не подходит**         |
| ---------------- | -------------------------- | -------------------------- |
| Функциональность | Валидатор email, React хук | UI-кит, сложное приложение |
| Размер           | < 20 файлов                | > 30 файлов                |
| Ответственность  | Одна четкая задача         | Множественные задачи       |
| Зависимости      | Минимальные                | Сложные взаимосвязи        |

### Основные характеристики

- **Простота:** Одна модульная единица на весь пакет
- **Инкапсуляция:** Публичный API только через `src/index.ts`
- **Минимализм:** Только необходимые файлы
- **Самодостаточность:** Содержит свои types/constants/helpers

## TIER 3: Структура проекта

<output_format>
При описании структуры проекта используй XML-схему с четкими ролями файлов и их назначением. Для каждого файла указывай:

- `name` — имя файла
- `role` — роль (function, types, config, helper, unit_test)
- `purpose` — назначение файла
- `exports` — что экспортирует (для entrypoint)
  </output_format>

<cognitive_triggers>
Давайте пошагово разберем обязательную структуру Single Module, начиная с entrypoint и добавляя необходимые файлы.
</cognitive_triggers>

### Обязательная структура

```xml
<package_root>
  <source_directory name="src">
    <entrypoint name="index.ts" purpose="Фасад — точка входа/реэкспорт" />
    <file name="main-file.ts" role="function" purpose="Основной файл с функционалом" />
    <directory name="__tests__" purpose="Тесты рядом с исходниками">
      <test name="main-file.test.ts" role="unit_test" />
    </directory>
  </source_directory>
</package_root>
```

<structure_completion_criteria>
Структура четко определена с XML-схемой, ролями файлов и их назначением.
</structure_completion_criteria>

### Дополнительные файлы (опционально)

```xml
<optional_files>
  <file name="src/types.ts" role="types" purpose="TypeScript типы (интерфейсы, enums)" />
  <file name="src/constants.ts" role="config" purpose="Неизменяемые значения" />
  <file name="src/schemas.ts" role="schemas" purpose="Zod схемы, валидаторы" />
  <file name="src/helpers.ts" role="helper" purpose="Internal helper функции" note="не экспортируются" />
</optional_files>
```

## TIER 4: Правила и ограничения

### ✅ Требования

- [ ] **Фасад:** Обязательный `src/index.ts` — точка входа/реэкспорт
- [ ] **Именованные экспорты:** Только именованные экспорты
- [ ] **Одна функция на файл:** Каждый файл содержит одну основную функцию
- [ ] **Инкапсуляция типов:** При наличии типов выносить в `src/types.ts`
- [ ] **Тесты рядом:** Тесты в `src/__tests__/`

### ❌ Запрещено

- `Default` экспорты
- FSD-слои (`pages/`, `widgets/`, `features/`)
- Множественные модульные единицы
- Экспорт helper-функций через фасад
- Тесты в корне проекта

### Основные запреты

- ❌ `Default` экспорты — только `export { functionName }`
- ❌ FSD-слои (`pages/`, `widgets/`, `features/`) — используй плоскую структуру в `src/`
- ❌ Множественные основные функции — разбей на Layered Library
- ❌ Экспорт helper-функций — скрывай за фасадом
- ❌ Тесты в корне — размещай в `src/__tests__/`

### Risk Assessment

<cognitive_triggers>
Давайте проанализируем потенциальные риски при использовании Single Module архитектуры и способы их смягчения.
</cognitive_triggers>

**Потенциальные проблемы и решения:**

| **Риск**                    | **Симптомы**                        | **Смягчение**                                                 |
| --------------------------- | ----------------------------------- | ------------------------------------------------------------- |
| Нарушение единого фасада    | Прямые импорты из внутренних файлов | ESLint: `import/no-restricted-paths` + `eslint-plugin-import` |
| Превышение лимита файлов    | >20 файлов с бизнес-логикой         | Миграция на Layered Library                                   |
| Смешивание ответственностей | Множественные функции в одном файле | Рефакторинг: одна функция на файл                             |
| Утечка внутренних API       | Экспорт helper-функций              | Скрытие через фасад, только публичный API                     |

<risk_completion_criteria>
Risk Assessment содержит конкретные риски, их симптомы и способы смягчения.
</risk_completion_criteria>

## TIER 5: Примеры использования

### Библиотека валидации email

**Описание:** Простая библиотека для валидации email адресов

```xml
<package_root>
  <source_directory name="src">
    <entrypoint name="index.ts" exports="validateEmail" />
    <file name="validate-email.ts" role="function" purpose="основная функция валидации" />
    <file name="types.ts" role="types" exports="ValidationResult, EmailOptions" />
    <file name="constants.ts" role="config" exports="EMAIL_REGEX, ERROR_MESSAGES" />
    <directory name="__tests__">
      <test name="validate-email.test.ts" role="unit_test" />
    </directory>
  </source_directory>
</package_root>
```

**Примечание:** Структура может варьироваться в зависимости от сложности. Для простейших утилит допустимо совмещение фасада и реализации в одном файле `index.ts`.

**Описание:** React хук для безопасной навигации назад

```xml
<package_root>
  <source_directory name="src">
    <entrypoint name="index.ts" exports="useSafeBack" />
    <file name="use-safe-back.ts" role="function" purpose="основной React хук" />
    <file name="types.ts" role="types" exports="SafeBackOptions, SafeBackReturn" />
    <file name="helpers.ts" role="helper" purpose="внутренние хелперы" note="не экспортируются" />
    <directory name="__tests__">
      <test name="use-safe-back.test.ts" role="unit_test" />
    </directory>
  </source_directory>
</package_root>
```

### Простая утилитарная функция

**Описание:** Минимальная структура для простых утилит

```xml
<package_root>
  <source_directory name="src">
    <entrypoint name="index.ts" purpose="фасад + основная функция (исключение для простейших утилит)" />
    <directory name="__tests__">
      <test name="index.test.ts" role="unit_test" />
    </directory>
  </source_directory>
</package_root>
```

**Примечание:** Для простейших утилит допустимо совмещение фасада и реализации в одном файле `index.ts`, но это исключение из общего правила.

## TIER 6: XML-схема для валидатора

```xml
<package_root>
  <source_directory name="src">
    <entrypoint name="index.ts" />
    <file name="validate-email.ts" role="function" />
    <file name="types.ts" role="types" />
    <file name="constants.ts" role="config" />
    <test name="__tests__/validate-email.test.ts" role="unit_test" />
  </source_directory>
</package_root>
```

## TIER 7: Метаданные для валидатора

### Полная валидация

```xml
<architecture_metadata version="1" language="ts">
  <architecture_type>single_module</architecture_type>
  <scope>full</scope>
  <module_units>
    <unit path="src" layer="unit" />
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
  <architecture_type>single_module</architecture_type>
  <scope>partial</scope>
  <partial_root>src</partial_root>
  <module_units>
    <unit path="src" layer="unit" />
  </module_units>
  <entrypoints>
    <entrypoint path="src/index.ts" />
  </entrypoints>
  <ruleset>morj-2025-09</ruleset>
</architecture_metadata>
```

## TIER 6: Применимость и валидация

### ✅ Подходит для

- Простых утилитарных библиотек
- Отдельных React-хуков
- Валидаторов и парсеров
- Математических функций
- API клиентов с одной областью ответственности

### ❌ Не подходит для

- Сложных приложений
- Пакетов с множественным функционалом
- UI-китов с множественными компонентами
- Приложений с роутингом и состоянием

<completion_criteria>
Документ полностью готов к использованию: все правила Single Module архитектуры определены, примеры структуры предоставлены, таблицы запретов и исправлений содержат конкретные примеры кода, Risk Assessment покрывает основные риски, XML-схемы для валидатора готовы, метаданные корректны. Документ соответствует стандарту reference-промптов и может быть использован для валидации архитектуры проектов.
</completion_criteria>

[REFERENCE-END]
