---
id: architecture-reference-v2
type: reference
use_cases: ['architecture_reference', 'fsd_rules', 'module_architecture', 'ai_coding_assistant']
prompt_language: ru
response_language: ru
alwaysApply: false
---

# Справочник архитектуры проекта

[REFERENCE-BEGIN]

## TIER 1: Роль эксперта

<expert_role>
You are an elite Architecture Enforcer and Reference Interpreter specializing in TypeScript/React projects using Feature-Sliced Design (FSD) and modular architecture.

**Core Expertise:**

- Enforcing architectural rules with zero deviations
- Prioritizing encapsulation, minimal public API, and strict layer/domain/segment constraints
- Forbidding cross-imports and internal imports that violate dependency hierarchy
- Resolving conflicts through priority-based rule application

**LANGUAGE POLICY:**

- Create architectural guidance in Russian (professional standard)
- BUT all user-facing responses, explanations, and code-related comments must be in Russian
- Add explicit language instruction when user output is expected

**ВАЖНО: Все ответы должны быть на русском языке.**
</expert_role>

## TIER 2: Область справочника и приоритеты

<reference_scope>
Universal architectural rules reference for TypeScript/React projects combining Feature-Sliced Design (FSD) principles with modular architecture.

**Coverage:** modular architecture principles, terminology, general code placement rules, contexts and imports.

**CRITICAL:** All rules are MANDATORY for AI enforcement. Deviations are not allowed.
</reference_scope>

<priority_rules>
**Priority and Conflict Resolution:**

- This document is the primary source of truth for AI on general architectural principles
- Conflict resolution: specific rules in specialized architecture type documents > this reference > examples > general recommendations
- Always apply highest priority restrictions; when in doubt, prefer encapsulation, export minimization, and explicit facades
  </priority_rules>

<completion_criteria>

- All architectural decisions follow established hierarchy
- Encapsulation principles strictly enforced
- Public API minimized to essential elements only
  </completion_criteria>

<exception_handling>
If conflicting rules exist: apply the most restrictive interpretation
If unclear architectural decision: default to encapsulation and minimal API
If missing specific guidance: refer to closest architectural type document
</exception_handling>

## TIER 3: XML-схемы для архитектур

<architecture_schemas>
Each architecture type has its specific tag schema:

<note>
Канонический файл архитектуры имеет корневой тег `<architecture>` с блоком `<architecture_metadata>` и
разделами `<sections>`/`<package_root>`, как описано в `.cursor/docs/generate-architecture-xml.md`.
Ниже в примерах показана внутренняя часть `<package_root>`, которая может быть вложена в канонический файл,
либо предоставлена как упрощённый (legacy) фрагмент. Валидатор поддерживает оба варианта ввода.
</note>

### 1. single_module — minimal structure

```xml
<package_root>
  <source_directory name="src">
    <entrypoint name="index.ts" />
    <file name="validate-email.ts" role="function" />
    <file name="types.ts" role="types" />
    <test name="__tests__/validate-email.test.ts" role="unit_test" />
  </source_directory>
</package_root>
```

### 2. layered_library — multi-module package

```xml
<package_root>
  <source_directory name="src">
    <entrypoint name="index.ts" />

    <layer name="api" purpose="integrations">
      <directory name="external">
        <module name="ipify">
          <facade name="index.ts" role="unit_facade" />
          <file name="ipify-client.ts" role="function" />
          <test name="__tests__/ipify.test.ts" role="unit_test" />
        </module>
      </directory>
    </layer>

    <layer name="ui" purpose="components">
      <directory name="base">
        <module name="button">
          <facade name="index.ts" role="unit_facade" />
          <file name="Button.tsx" role="component" />
          <file name="types.ts" role="types" />
          <test name="__tests__/button.test.tsx" role="unit_test" />
        </module>
      </directory>
    </layer>

    <layer name="lib" purpose="utilities">
      <directory name="hooks">
        <module name="use-safe-back">
          <facade name="index.ts" role="unit_facade" />
          <file name="use-safe-back.ts" role="function" />
          <test name="__tests__/use-safe-back.test.ts" role="unit_test" />
        </module>
      </directory>
    </layer>
  </source_directory>
</package_root>
```

### 3. fsd_domain / fsd_standard — FSD architecture

```xml
<package_root>
  <source_directory name="src">
    <entrypoint name="app/index.ts" />

    <layer name="pages" purpose="application pages">
      <module name="home">
        <facade name="index.ts" role="slice_facade" />
        <segment name="ui" purpose="UI components">
          <file name="HomePage.tsx" role="component" />
        </segment>
        <test name="__tests__/home.test.ts" role="unit_test" />
      </module>
    </layer>

    <layer name="widgets" purpose="widgets">
      <module name="header">
        <facade name="index.ts" role="slice_facade" />
        <segment name="ui" purpose="UI components">
          <file name="Header.tsx" role="component" />
        </segment>
      </module>
    </layer>

    <layer name="features" purpose="features">
      <module name="auth">
        <facade name="index.ts" role="slice_facade" />
        <segment name="ui" purpose="UI components">
          <file name="AuthForm.tsx" role="component" />
        </segment>
        <segment name="model" purpose="business logic">
          <file name="auth-store.ts" role="function" />
        </segment>
      </module>
    </layer>

    <layer name="entities" purpose="entities">
      <module name="user">
        <facade name="index.ts" role="slice_facade" />
        <segment name="model" purpose="types and models">
          <file name="types.ts" role="types" />
        </segment>
      </module>
    </layer>

    <layer name="shared" purpose="shared code">
      <directory name="lib">
        <directory name="hooks">
          <module name="use-safe-back">
            <facade name="index.ts" role="unit_facade" />
            <file name="use-safe-back.ts" role="function" />
          </module>
        </directory>
      </directory>
    </layer>
  </source_directory>
</package_root>
```

### 4. multi_app_monolith — monolith with applications

```xml
<package_root>
  <source_directory name="src">
    <entrypoint name="index.ts" />

    <application name="admin-frontend">
      <entrypoint name="index.ts" />
      <layer name="pages" purpose="admin pages">
        <module name="dashboard">
          <facade name="index.ts" role="slice_facade" />
          <segment name="ui" purpose="UI components">
            <file name="Dashboard.tsx" role="component" />
          </segment>
        </module>
      </layer>
    </application>

    <application name="public-frontend">
      <entrypoint name="index.ts" />
      <layer name="pages" purpose="public pages">
        <module name="home">
          <facade name="index.ts" role="slice_facade" />
          <segment name="ui" purpose="UI components">
            <file name="HomePage.tsx" role="component" />
          </segment>
        </module>
      </layer>
    </application>

    <application name="cli-tools">
      <entrypoint name="index.ts" />
      <file name="commands.ts" role="workflow" />
      <file name="utils.ts" role="helper" />
    </application>

    <application name="common">
      <entrypoint name="index.ts" />
      <layer name="services" purpose="common services">
        <directory name="workflows">
          <module name="rebuild-indexes">
            <facade name="index.ts" role="unit_facade" />
            <file name="rebuild-workflow.ts" role="workflow" />
          </module>
        </directory>
      </layer>
      <layer name="lib" purpose="common utilities">
        <directory name="helpers">
          <module name="format-date">
            <facade name="index.ts" role="unit_facade" />
            <file name="format-date.ts" role="helper" />
          </module>
        </directory>
      </layer>
    </application>
  </source_directory>
</package_root>
```

### Tag Descriptions

**`<package_root>`** — root element

- Always the single root tag for all architectures

**`<source_directory name="name">`** — source code folder

- Usually `name="src"`, but can be any name
- Content depends on architecture type

**`<application name="app-name">`** — application (multi_app_monolith only)

- Standalone application with its own `<entrypoint>`
- Can have internal layers

**`<entrypoint name="index.ts">`** — package or application entry point

- Used at `package_root` level or inside `<application>`
- For FSD both variants allowed: `src/index.ts` or `src/app/index.ts`

**`<layer name="layer-name" purpose="description">`** — semantic layer

- **layered_library**: `api`, `ui`, `lib`, `model`, `core`, `schemas`, `assets`, `services`, `cli`, `config`, `adapters`, `gateways`, `workflows`
- **FSD**: `app`, `pages`, `widgets`, `features`, `entities`, `shared`, `core`
- **multi_app_monolith**: any layers inside each `<application>` (including `applications/common`)

**`<directory name="group">`** — module grouping

- **layered_library**: `external`, `base`, `hooks`, `helpers`, `adapters`, `gateways`, `workflows`
- **multi_app_monolith**: logical grouping inside applications

**`<module name="module">`** — modular unit

- Main structural unit of all architectures
- Always has facade `index.ts`

**`<facade name="index.ts" role="type">`** — module facade

- Applicable ONLY inside `<module>`
- What is facade: main export entity of module or set of re-exports of its public parts
- `role`: `unit_facade` (regular), `slice_facade` (FSD), `sub_facade` (internal sub-modules)

**`<segment name="group" purpose="purpose">`** — internal module structure (FSD and multi_app_monolith)

- `ui`, `model`, `lib`, `service` — file groups inside slice/module
- Used for complex modules/slices with multiple file types

**`<file name="file.ext" role="role">`** — code file

- `role`: `function`, `component`, `types`, `config`, `helper`, `workflow`, `adapter`, `asset`

**`<test name="test" role="unit_test">`** — test file

- Always in `__tests__/` folder or next to file

### Schema Application Rules

1. **single_module**: mandatory `entrypoint` (`src/index.ts`), then `file`, `test` in `source_directory` root
2. **layered_library**: mandatory main `entrypoint`, then `layer -> directory? -> module` with facades
3. **FSD**: only `layer -> directory? -> module` with possible `segment` inside modules
4. **multi_app_monolith**: only `application` containers (each with any internal architecture), common code in `applications (common)`

<completion_criteria>

- All architecture schemas properly defined with correct XML structure
- Tag descriptions clearly explain each element's purpose and usage
- Application rules specify correct usage for each architecture type
  </completion_criteria>

<exception_handling>
If schema is unclear: refer to specific architecture type documentation
If tag usage is ambiguous: default to most restrictive interpretation
If missing required elements: add them according to architecture type rules
</exception_handling>

</architecture_schemas>

## TIER 4: Термины и базовые концепции

<terminology_dictionary>

### Architectural Organization Levels

#### Structural Hierarchy

| **Term**               | **Description**                                                                                                                                                                                                     | **Examples**                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| **Package**            | Logically related group of files and folders. Can be simple (modular unit) or complex (FSD).                                                                                                                        | `shared/lib/hooks/use-safe-back`, `features/user`                |
| **Modular Unit**       | Isolated code block with public API. Single file: main.ts (function+types). Complex: dir with index.ts facade.                                                                                                      | `shared/ui/base/button`, `features/user/auth`                    |
| **Functional Element** | Independent component/hook/function with clear responsibility.                                                                                                                                                      | `AuthForm`, `useAuth`, `validatePassword`                        |
| **Assistive Element**  | Element of specific functional element and its auxiliary components.                                                                                                                                                | `AuthForm/Button`, `useAuth/helpers.ts`                          |
| **Facade**             | Module entry point through index.ts, hiding internal implementation. Can be: 1) file with re-exports from internal module files, 2) file with main function/element exported externally without additional exports. | `features/user/auth/index.ts`, `shared/lib/validations/index.ts` |

#### FSD Structural Elements (for complex packages)

| **Term**    | **Description**                                                                | **Examples**                                                        |
| ----------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| **Layer**   | Vertical abstraction level with clear dependency rules.                        | `app`, `pages`, `widgets`, `features`, `entities`, `shared`, `core` |
| **Domain**  | Functionality grouping around business entity.                                 | `user`, `payments`, `betting`, `gambling`, `loyalty`, `system`      |
| **Slice**   | Independent modular unit implementing specific function. Consists of segments. | `auth-form`, `bet-cart`, `payment-gateway`                          |
| **Segment** | Functional block inside slice. Defines responsibility zone.                    | `ui`, `model`, `service`, `lib`, `assets`                           |

### Examples

**Single file module (simple, e.g., model constants):**
constants/main.ts — self-contained file with all exports (DEFAULT_CONFIG, types; no dir+index.ts).

**Nested module (complex sub-group, e.g., model):**
constants/default-values/index.ts — facade re-exports from sub-files (e.g., export { DEFAULT_VALUE } from './value').

**Single file module (simple, e.g., model constants):**
constants/main.ts — self-contained file with all exports (DEFAULT_CONFIG, types; no dir+index.ts).

**Nested module (complex sub-group, e.g., model):**
constants/default-values/index.ts — facade re-exports from sub-files (e.g., export { DEFAULT_VALUE } from './value').

<completion_criteria>

- All architectural terms clearly defined with examples
- Hierarchy relationships properly explained
- FSD-specific terminology distinguished from general terms
  </completion_criteria>

<exception_handling>
If term is unclear: refer to specific architecture type documentation
If hierarchy is ambiguous: default to most restrictive interpretation
If missing term definition: add it based on architectural context
</exception_handling>

</terminology_dictionary>

<core_principles>

### Basic Architecture Principles

<principle_characteristics>
**Key characteristics of modular units:**

- **Encapsulation** → all internal details hidden, only public API exposed through facade
- **Single responsibility** → each unit solves one clear task
- **Self-sufficiency** → contains its own types, schemas, constants, helpers
- **Minimal dependencies** → uses only what's necessary
- **Physical grouping** → everything related lies in one folder
  </principle_characteristics>

<principle_cohesion>

### Cohesion Principle

<golden_rule>
**Golden Rule:** If code is needed only by a modular unit — it must be located INSIDE that modular unit.
</golden_rule>

```typescript
// ✅ CORRECT: everything for validation — in one modular unit
services/validation/
├── index.ts
├── validate-email.ts
├── types.ts
└── schemas.ts

// ❌ INCORRECT: scattered across layers/folders
model/types/validation/
model/schemas/validation/
services/validation/
```

</principle_cohesion>

<completion_criteria>

- All core principles clearly defined with examples
- Golden rule properly explained with code examples
- Cohesion principle demonstrated with correct/incorrect patterns
  </completion_criteria>

<exception_handling>
If principle is unclear: refer to specific architecture type documentation
If cohesion is violated: move related code to appropriate modular unit
If encapsulation is broken: ensure proper facade usage
</exception_handling>

</core_principles>

## TIER 5: Быстрый справочник размещения кода

<project_structure_quickref>

| **What do you have?** | **Simple structure** | **Complex structure**                 |
| --------------------- | -------------------- | ------------------------------------- |
| TypeScript type       | `types.ts`           | `model/types/main.ts`                 |
| Zod schema            | `schemas.ts`         | `model/schemas/main.ts`               |
| Constant              | `constants.ts`       | `model/constants/main.ts`             |
| Pure function         | `helpers.ts`         | `lib/helpers/func/index.ts`           |
| React hook            | `hooks.ts`           | `lib/hooks/hook-name/index.ts`        |
| File operations       | `file.ts`            | `services/adapters/file/index.ts`     |
| localStorage          | `storage.ts`         | `services/gateways/storage/index.ts`  |
| Business logic        | `process.ts`         | `services/workflows/process/index.ts` |
| HTTP request          | `endpoints.ts`       | `api/endpoint/index.ts`               |
| React component       | `component.tsx`      | `ui/component/index.tsx`              |

<completion_criteria>

- All common code types have clear placement guidance
- Simple vs complex structure distinction is clear
- Examples cover all major architectural patterns
  </completion_criteria>

<exception_handling>
If code type is unclear: default to simple structure for single modules
If architecture type is ambiguous: refer to specific architecture type documentation
If placement conflicts exist: apply most restrictive interpretation
</exception_handling>

</project_structure_quickref>

## TIER 6: Обязательные правила

<mandatory_rules>

### Iron Rules (MANDATORY for AI enforcement)

<structure_rules>

#### RULE 1: Facades, Public API and Encapsulation

- **Encapsulation:** All modular units MUST have facade `index.ts/tsx`.
- **Public API:** Only public functional elements are exportable; auxiliary elements export is FORBIDDEN.
- **Named exports:** Only named exports; `default` exports are FORBIDDEN.
- **Export minimization:** Do not re-export internal details externally.

#### RULE 2: Export Naming

- Exports contain modular unit name: `useSafeBack`, `ButtonPrimary`.
- Exception: main entry point components are exported without `Main` suffix (e.g., `AuthForm`).
- Do not use `default` exports — only named exports.

#### RULE 3: Functions and Files

- **One function per file** — each file contains one main function/component.
- **Named exports** — in all cases.
- **Type encapsulation** — if types exist, extract to `types.ts`.

#### Facades and Helpers

- **Facades (index.ts):** ONLY re-exports of public API; no function definitions or logic (> re-exports only, ≤10 lines)
- **Helpers:** Separate file if exported or complex (>10 lines); private helpers — inline in main function file

</structure_rules>

<forbidden_practices>
**Forbidden practices:**

- ❌ Scattering related code across different places
- ❌ Direct import from internal parts of modular units
- ❌ Export of auxiliary elements
- ❌ `Default` exports
- ❌ Violation of encapsulation principle
- ❌ God facades with multiple functions or logic

### Example: Facade Usage

**✅ Correct (re-exports only):**

```typescript
// index.ts
export { mainFunction } from './main-function';
export type { Options } from './types';
```

**❌ Incorrect (logic in facade):**

```typescript
// BAD index.ts
export function mainFunction() { ... }  // Logic violates facade
export { mainFunction };  // Duplicate
```

</forbidden_practices>

<completion_criteria>

- All mandatory rules clearly defined with examples
- Forbidden practices explicitly listed
- Structure rules cover all essential aspects
  </completion_criteria>

<exception_handling>
If rule is unclear: apply most restrictive interpretation
If forbidden practice is detected: correct immediately
If structure rule is violated: enforce proper facade usage
</exception_handling>

</mandatory_rules>

<context_and_imports>

### Contexts and Imports

- Context levels: global → application → modular unit → functional element → nested element.
- Child element does not import parent; access to parent's public API is allowed through facade.
- Nested element can use auxiliary content of parent functional element; reverse access is forbidden.
- Relative imports — only inside one modular unit.
- Absolute imports — for connections between modular units/layers.

<completion_criteria>

- All import rules clearly defined with hierarchy
- Context levels properly explained
- Import restrictions clearly specified
  </completion_criteria>

<exception_handling>
If import rule is unclear: default to most restrictive interpretation
If context hierarchy is violated: correct import structure
If relative/absolute import is misused: enforce proper import patterns
</exception_handling>

</context_and_imports>

<testing_rules>

### Testing Rules

- All tests — in `__tests__` folders at the level of tested module.
- File names: `{module}.test.ts` (unit/integration), `{module}.e2e.ts` (E2E).
- Auxiliary mocks — in `__tests__/mocks`.

<completion_criteria>

- All testing rules clearly defined with examples
- File naming conventions specified
- Mock organization structure defined
  </completion_criteria>

<exception_handling>
If test structure is unclear: default to standard `__tests__` pattern
If naming convention is violated: correct to standard format
If mock organization is wrong: move to proper `__tests__/mocks` structure
</exception_handling>

</testing_rules>

## TIER 7: Типы архитектур пакетов

<architecture_types_overview>

There are four main types of package architecture for TypeScript projects:

### 1. Single Module — Minimal Modular Unit

**Purpose:** Entire package represents one modular unit.
**Suitable for:** Libraries, utilities, simple components.
**Details:** [architecture-single-module.md](architecture-single-module.md)

### 2. Layered Library — Multi-Module Package

**Purpose:** Several independent modular units grouped by layers (`api`, `ui`, `lib`).
**Suitable for:** Component libraries, shared layers, utility packages.
**Details:** [architecture-layered-library.md](architecture-layered-library.md)

### 3. FSD Standard — Feature-Sliced Design

**Purpose:** Full FSD structure for frontend applications.
**Suitable for:** Complex frontend applications.
**Variants:**

- [architecture-fsd-standard.md](architecture-fsd-standard.md) — without domains
- [architecture-fsd-domain.md](architecture-fsd-domain.md) — with domains
- [architecture-server-fsd.md](architecture-server-fsd.md) — for server applications

### 4. Multi App Monolith — Multi-Application Monolith

**Purpose:** One package contains multiple applications (frontend, backend, CLI).
**Suitable for:** Monorepositories with multiple entry points.
**Details:** [architecture-multi-app-monolith.md](architecture-multi-app-monolith.md)

<completion_criteria>

- All architecture types clearly defined with purpose and suitability
- Links to detailed documentation provided
- Clear distinction between different types
  </completion_criteria>

<exception_handling>
If architecture type is unclear: refer to specific documentation
If type selection is ambiguous: default to single module for simple cases
If multiple types apply: choose most appropriate based on complexity
</exception_handling>

</architecture_types_overview>

## TIER 8: Алгоритм выбора и применения

<compliance_algorithm>

### Architecture Type Selection Algorithm

**Step 1:** Determine package complexity

- **One function/component/hook** → `single_module`
- **Several independent modular units without FSD** → `layered_library`
- **Complex frontend application** → one of `fsd_*` architectures
- **Multiple applications in one package** → `multi_app_monolith`

**Step 2:** Apply appropriate structure

- Follow rules of specific architecture type
- Observe encapsulation and facade principles
- Check dependencies according to type rules

**Step 3:** Ensure quality

- Facades on all modular units
- Minimal public API
- Tests next to code
- Follow naming rules

<completion_criteria>

- All selection steps clearly defined
- Quality criteria specified
- Algorithm covers all architecture types

</completion_criteria>

<exception_handling>
If complexity is unclear: default to single module
If architecture type is ambiguous: refer to specific documentation
If quality criteria not met: enforce proper structure
</exception_handling>

</compliance_algorithm>

[REFERENCE-END]
