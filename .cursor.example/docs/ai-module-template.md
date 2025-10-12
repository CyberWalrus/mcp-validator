---
id: ai-documentation-module-reference
type: reference
use_cases: ['ai_module_documentation', 'module_templates', 'api_documentation']
prompt_language: mixed
response_language: ru
alwaysApply: false
---

# 🧩 AI Module Unit Documentation Reference (Справочник документации модульных единиц)

[REFERENCE-BEGIN]

## 🎯 TIER 1: Expert Role

<expert_role>
You are an elite AI Documentation Engineer specializing in creating production-ready documentation for module units (модульные единицы) in TypeScript projects.
Your expertise includes modular architecture patterns, API documentation standards, and cross-model compatibility for documentation generation.
Target models: Claude, GPT, Gemini, Qwen with universal documentation patterns.

**ВАЖНО: Все ответы должны быть на русском языке.**
</expert_role>

<terminology_note>
В этом справочнике термин "module unit" = "модульная единица" (папка с фасадом index.ts/index.tsx, где на уровень выше нет другого фасадного файла). Не путать с "функциональным элементом" из архитектуры.
</terminology_note>

## 🧩 TIER 2: Documentation Process

<algorithm_motivation>
We will proceed in a structured manner to create comprehensive, accurate, and standardized AI documentation for module units. Each step ensures complete coverage while maintaining consistency across the project architecture.
</algorithm_motivation>

<algorithm_steps>

### Step 1: Analysis and Context Gathering

<cognitive_triggers>
Let's think step by step about the module unit we need to document.
</cognitive_triggers>

- Analyze the module unit's purpose, scope, and integration points
- Identify public API surface (functions, types, constants)
- Map internal structure and dependencies
- Determine usage patterns and integration scenarios

<completion_criteria>
Completion: Full understanding of the module unit's architecture, API, and integration patterns established
</completion_criteria>

<exception_handling>
If module unit structure is unclear: request clarification on key functions and their purposes
If dependencies are complex: focus on main integration points rather than exhaustive mapping
If examples are insufficient: request additional usage scenarios
</exception_handling>

### Step 2: YAML Metadata Creation

- Create standardized YAML frontmatter with id, documentation_type, module_context
- Ensure module_context includes name, path, parent_package, and purpose
- Set size_limits to enforce content constraints (max 120 lines)

<completion_criteria>
Completion: YAML metadata properly structured with all required fields and accurate module context
</completion_criteria>

<exception_handling>
If module path is unclear: use relative path from project root
If parent package is unknown: infer from project structure or request clarification
</exception_handling>

### Step 3: Core Documentation Sections

- **Purpose Section:** Write 2-3 sentence description of unit's responsibility
- **Public API:** Document all exported functions, types, and constants
- **Usage Examples:** Provide basic usage and integration examples
- **Structure:** Create XML representation of file organization

<completion_criteria>
Completion: All core sections completed with accurate technical details and practical examples
</completion_criteria>

<exception_handling>
If API surface is extensive: focus on primary functions and note additional exports
If examples require complex setup: provide simplified integration patterns
</exception_handling>

### Step 4: Dependencies and Notes

- **Dependencies:** Categorize as Node.js built-ins, external packages, internal imports
- **Notes:** Document key features, limitations, and implementation details
- Ensure technical accuracy and relevance

<completion_criteria>
Completion: Dependencies properly categorized and key technical notes documented
</completion_criteria>

<exception_handling>
If dependency relationships are complex: focus on direct dependencies and main integration points
If technical limitations are numerous: prioritize critical ones for immediate awareness
</exception_handling>

### Step 5: Quality Validation

- Verify all sections are present and properly formatted
- Ensure XML structure is valid and comprehensive
- Check examples are realistic and functional
- Confirm documentation follows established patterns

<completion_criteria>
Completion: Documentation passes quality checks and follows established standards
</completion_criteria>

<exception_handling>
If quality issues found: revise sections for clarity and completeness
If examples don't work: fix implementation details or provide alternative approaches
</exception_handling>

</algorithm_steps>

<completion_criteria>
Completion: All 5 steps executed successfully, comprehensive AI documentation created, quality validation passed, production-ready module documentation generated
</completion_criteria>

<exception_handling>
If module unit analysis incomplete: focus on core functions and request clarification on complex parts
If documentation generation fails: provide partial documentation with clear notes on missing sections
If quality validation identifies issues: revise specific sections rather than complete rewrite
If size limits exceeded: prioritize essential information and move detailed examples to separate documentation
</exception_handling>

## 🔧 TIER 3: Template System

<output_format>
**Формат выходной документации:**

- **Основной формат:** Markdown с YAML frontmatter
- **XML секции:** Каждая основная секция обернута в соответствующие XML теги
- **Структура:** Линейная последовательность секций без вложенных блоков
- **Кодировка:** UTF-8 с поддержкой русского языка
- **Ограничения:** Максимум 120 строк контента, включая YAML

**Правила форматирования:**

- Использовать XML теги для всех основных секций
- Кавычки в коде: одинарные для строковых литералов
- Отступы: 4 пробела для YAML, 2 для markdown кода
- Максимум 80 символов в строке (кроме кода)

</output_format>

<module_template>

**Унифицированный шаблон module-ai-docs.md:**

````markdown
---
id: module-${MODULE_NAME}
documentation_type: 'ai-module-documentation'
module_context:
    name: '${MODULE_NAME}'
    path: '${MODULE_PATH}'
    parent_package: '${PARENT_PACKAGE}'
    purpose: '${ONE_LINE_PURPOSE}'
---

# 🧩 ${MODULE_NAME}

<module_purpose>
${2_SENTENCES_PURPOSE_AND_SCOPE}
</module_purpose>

<public_api>
**Функции:**

- '${FUNCTION_NAME}(${PARAMS})' - ${PURPOSE}

**Типы:**

- '${TYPE_NAME}' - ${DESCRIPTION}

**Константы:**

- '${CONST_NAME}' - ${DESCRIPTION}
  </public_api>

<usage_examples>
**Основное использование:**

```typescript
import { ${MAIN_EXPORT} } from './${MODULE_NAME}';

const result = ${MAIN_EXPORT}(${PARAMS});
console.log(result);
```

**Интеграция:**

```typescript
// ${INTEGRATION_CONTEXT}
const pipeline = ${INTEGRATION_EXAMPLE};
```

</usage_examples>

<module_structure>

```xml
<module name="${MODULE_NAME}">
    <facade name="index.ts" role="unit_facade" exports="${MAIN_EXPORT}"/>
    <file name="${FILE_1}.ts" role="function" purpose="${ROLE_1}"/>
    <file name="${FILE_2}.ts" role="component" purpose="${ROLE_2}"/>
    <file name="types.ts" role="types" purpose="типы модульной единицы"/>
    <file name="constants.ts" role="config" purpose="константы"/>
    <test name="__tests__/index.test.ts" role="unit_test" purpose="unit тесты"/>
</module>
```

</module_structure>

<dependencies>
**Node.js:** ${NODE_MODULES_LIST}
**Внешние:** ${EXTERNAL_PACKAGES_LIST}
**Внутренние:** ${INTERNAL_IMPORTS_LIST}
</dependencies>

<notes>
**Особенности:** ${KEY_IMPLEMENTATION_NOTES}
**Ограничения:** ${KEY_LIMITATIONS}
</notes>
````

</module_template>

## 📚 TIER 4: Template Variables Reference

<template_variables>

**Template переменные для документации модульных единиц:**

- `${MODULE_NAME}` - имя модульной единицы (validation, mcp-server)
- `${MODULE_PATH}` - путь модульной единицы в проекте
- `${PARENT_PACKAGE}` - родительский пакет
- `${MODULE_PURPOSE}` - назначение модульной единицы
- `${EXPORT_FUNCTION_*}` - экспортируемые функции
- `${EXPORT_TYPE_*}` - экспортируемые типы
- `${EXPORT_CONST_*}` - экспортируемые константы
- `${USAGE_SCENARIO_*}` - сценарии использования модульной единицы
- `${USAGE_DESCRIPTION_*}` - описания примеров использования
- `${VARIABLE_NAME_*}` - имена переменных в примерах
- `${INTEGRATION_EXAMPLE_*}` - примеры интеграции с другими модульными единицами
- `${EXTERNAL_PACKAGE_*}` - внешние зависимости
- `${INTERNAL_IMPORT_*}` - внутренние импорты
- `${BUG_*}`, `${LIMITATION_*}`, `${TECH_DEBT_*}` - проблемы и ограничения

</template_variables>

## ⚠️ TIER 5: Examples and Best Practices

<module_examples>

<example type="validation_module">
**Пример AI-документации для модульной единицы валидации:**

````markdown
---
id: module-validation
documentation_type: 'ai-module-documentation'
module_context:
    name: 'validation'
    path: 'src/services/workflows/validation'
    parent_package: 'mcp-validator'
    purpose: 'валидация кода и промптов через AI модели'
---

# 🧩 validation

<module_purpose>
Основная модульная единица для валидации различных типов контента через AI модели. Обеспечивает проверку кода TypeScript/JavaScript/Go/Rust и тестирование промптов на консистентность. Изолированный блок с фасадом, доступный только через публичный API.
</module_purpose>

<public_api>
**Функции:**

- `validateCode(input: ValidationInput): ValidationResult` - валидация кода
- `testPrompt(prompt: string, options: TestOptions): TestResult` - тест промптов
- `getValidationTypes(): string[]` - доступные типы

**Типы:**

- `ValidationInput` - входные данные
- `ValidationResult` - результат валидации
- `TestOptions` - опции тестирования
  </public_api>

<usage_examples>
**Основное использование:**

```typescript
import { validateCode } from './validation';

const result = await validateCode({
    type: 'file',
    data: 'src/user-service.ts',
});
```

**Интеграция:**

```typescript
// Использование в MCP pipeline
const pipeline = await handleMCPRequest('validate').then(validateCode).then(formatResult);
```

</usage_examples>

<module_structure>

```xml
<module name="validation">
    <facade name="index.ts" role="unit_facade" exports="validateCode, testPrompt, getValidationTypes"/>
    <file name="validate-code.ts" role="function" purpose="валидация кода"/>
    <file name="test-prompt.ts" role="function" purpose="тест промптов"/>
    <file name="types.ts" role="types" purpose="типы модульной единицы"/>
    <file name="constants.ts" role="config" purpose="константы валидации"/>
    <test name="__tests__/index.test.ts" role="unit_test" purpose="unit тесты"/>
</module>
```

</module_structure>

<dependencies>
**Node.js:** node:fs
**Внешние:** openai, zod
**Внутренние:** ../adapters/openrouter-client, ../adapters/file-reader
</dependencies>

<notes>
**Особенности:** Синхронная обработка файлов, кеширование результатов
**Ограничения:** Максимум 100KB файл, timeout 30 секунд
</notes>
````

</example>

<example type="mcp_server_adapter">
**Пример AI-документации для MCP Server адаптера:**

````markdown
---
id: module-mcp-server
documentation_type: 'ai-module-documentation'
module_context:
    name: 'mcp-server'
    path: 'src/services/adapters/mcp-server'
    parent_package: 'mcp-validator'
    purpose: 'MCP протокол сервер для интеграции с Cursor'
---

# 🧩 mcp-server

<module_purpose>
Адаптер для работы с MCP (Model Context Protocol) клиентами. Реализует stdio интерфейс для взаимодействия с Cursor через стандартные потоки ввода-вывода.
</module_purpose>

<public_api>
**Функции:**

- `initializeMCPServer(): Promise<MCPServer>` - инициализация сервера
- `handleMCPRequest(request: MCPRequest): Promise<MCPResponse>` - обработка запроса
- `shutdownMCPServer(): Promise<void>` - корректное завершение

**Типы:**

- `MCPServer` - интерфейс сервера
- `MCPRequest` - структура входящего запроса
- `MCPResponse` - структура ответа
  </public_api>

<usage_examples>
**Основное использование:**

```typescript
import { initializeMCPServer, handleMCPRequest } from './mcp-server';

const server = await initializeMCPServer();
const response = await handleMCPRequest(request);
```

**Интеграция:**

```typescript
// CLI запуск через stdio
process.stdin.pipe(mcpServer).pipe(process.stdout);
```

</usage_examples>

<module_structure>

```xml
<module name="mcp-server">
    <facade name="index.ts" role="unit_facade" exports="initializeMCPServer, handleMCPRequest, shutdownMCPServer"/>
    <file name="initialize-mcp-server.ts" role="function" purpose="инициализация"/>
    <file name="handle-mcp-request.ts" role="function" purpose="обработка запросов"/>
    <file name="stdio-handler.ts" role="helper" purpose="работа с stdio"/>
    <file name="protocol-validator.ts" role="helper" purpose="валидация MCP протокола"/>
    <test name="__tests__/mcp-integration.test.ts" role="integration_test" purpose="интеграционные тесты"/>
</module>
```

</module_structure>

<dependencies>
**Node.js:** node:process, node:stream
**Внешние:** @modelcontextprotocol/sdk
**Внутренние:** ../validation, ../../lib/error-handler
</dependencies>

<notes>
**Особенности:** Работа через stdio потоки, JSON-RPC протокол
**Ограничения:** Только stdio транспорт, синхронная обработка
</notes>
````

</example>

</module_examples>

## 📋 TIER 6: Required Elements Checklist

<required_elements>

**Секции документации модульных единиц:**

- `<module_purpose>` - назначение и область ответственности модульной единицы (2-3 предложения)
- `<public_api>` - экспортируемые функции, типы, константы
- `<usage_examples>` - конкретные примеры использования модульной единицы в коде
- `<module_structure>` - полная XML структура включая тесты
- `<dependencies>` - внешние пакеты и внутренние импорты
- `<notes>` - ключевые особенности и ограничения

**YAML метаданные:**

- `documentation_type: 'ai-module-documentation'`
- `ai_documentation_version: '2.0.0'`
- `module_context` с полными метаданными модульной единицы
- `size_limits: content: { max: 120 }` - строгий лимит 120 строк

**Структура примеров кода:**

- **Основное использование:** базовый import + вызов главной функции
- **Интеграция:** пример использования в более крупном workflow

**Зависимости по категориям:**

- **Node.js:** встроенные модули (node:fs, node:path)
- **Внешние:** npm пакеты из package.json
- **Внутренние:** относительные импорты модульных единиц проекта

**XML структура файлов:**

- `<module>` - корневой тег модуля
- `<facade>` - публичный API модуля
- `<file>` - файлы с кодом, типами, конфигурацией
- `<test>` - тестовые файлы

</required_elements>

[REFERENCE-END]
