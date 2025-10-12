---
id: module-testing
documentation_type: 'ai-module-documentation'
ai_documentation_version: '2.0.0'
module_context:
    name: 'testing'
    path: 'src/services/workflows/testing'
    parent_package: 'mcp-validator'
    purpose: 'параллельное тестирование промптов на консистентность AI ответов'
target_models: ['claude', 'gpt', 'gemini', 'qwen']
size_limits:
    content: { max: 120 }
---

# 🧩 testing

<module_purpose>
Самодостаточный модуль для параллельного тестирования промптов на консистентность. Выполняет промпт на множественных AI моделях параллельно и анализирует консистентность ответов для оценки надежности промпта.
</module_purpose>

<public_api>
**Функции:**

- `runParallelTests(params: TestParams): Promise<TestResult[]>` - параллельное тестирование
- `analyzeTestConsistency(results: TestResult[]): ConsistencyAnalysis` - анализ консистентности
- `generateTestReport(analysis: ConsistencyAnalysis): string` - генерация markdown отчета
- `loadTestPrompt(templateType: string): string` - загрузка шаблонов тестирования

**Типы:**

- `TestParams` - параметры тестирования (промпт, итерации, модели)
- `ConsistencyAnalysis` - результат анализа консистентности с оценкой
- `TestingConfig` - конфигурация параллельного тестирования

**Константы:**

- `DEFAULT_ITERATIONS` - количество итераций по умолчанию (5)
- `CONSISTENCY_THRESHOLDS` - пороги оценки консистентности
- `SUPPORTED_MODELS` - поддерживаемые AI модели
  </public_api>

<usage_examples>
**Основное использование:**

```typescript
import { runParallelTests, analyzeTestConsistency } from './testing';

const testResults = await runParallelTests({
    prompt: 'Write unit tests for this function',
    iterations: 5,
    models: ['claude-3-sonnet', 'gpt-4'],
    context: 'Тестирование промпта для генерации тестов',
});

const analysis = analyzeTestConsistency(testResults);
console.log(`Консистентность: ${analysis.score}/100`);
```

**Интеграция:**

```typescript
// Полный цикл тестирования промпта через MCP
const testReport = await handleTestPromptRequest(params)
    .then(runParallelTests)
    .then(analyzeTestConsistency)
    .then(generateTestReport);
```

</usage_examples>

<module_structure>

```xml
<module_root name="testing">
  <main_files>
    <file name="index.ts" role="публичный API модуля"/>
    <file name="run-parallel-tests.ts" role="параллельное тестирование"/>
    <file name="analyze-test-consistency.ts" role="анализ консистентности"/>
    <file name="generate-test-report.ts" role="генерация отчетов"/>
  </main_files>
  <internal_files>
    <file name="helpers/load-test-prompt.ts" role="загрузка шаблонов"/>
    <file name="helpers/format-test-prompt.ts" role="форматирование промптов"/>
    <file name="helpers/calculate-variance.ts" role="расчет дисперсии"/>
    <file name="types.ts" role="типы модуля"/>
  </internal_files>
  <tests>
    <directory name="__tests__">
      <file name="run-parallel-tests.test.ts" role="тесты параллельного тестирования"/>
      <file name="analyze-test-consistency.test.ts" role="тесты анализа"/>
      <file name="generate-test-report.test.ts" role="тесты генерации отчетов"/>
    </directory>
  </tests>
</module_root>
```

</module_structure>

<dependencies>
**Node.js:** нет
**Внешние:** нет
**Внутренние:** ../adapters/openrouter, ../../../model/types/main, ../../../lib/helpers/logger
</dependencies>

<notes>
**Особенности:** Параллельное выполнение до 10 итераций, статистический анализ консистентности, markdown отчеты
**Ограничения:** Ограничено доступными моделями в OpenRouter, timeout на каждый запрос
</notes>
