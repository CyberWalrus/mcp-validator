---
id: module-file-reader
documentation_type: 'ai-module-documentation'
ai_documentation_version: '2.0.0'
module_context:
    name: 'file-reader'
    path: 'src/services/adapters/file-reader'
    parent_package: '@morj/tools.mcp-validator'
    purpose: 'чтение файлов различных форматов с поддержкой кодировок'
target_models: ['claude', 'gpt', 'gemini', 'qwen']
size_limits:
    content: { max: 120 }
---

# 🧩 file-reader

<module_purpose>
Самодостаточный модуль для чтения файлов различных форматов с поддержкой множественных кодировок. Предоставляет единый интерфейс для получения контента из файлов, URL и строк с обработкой ошибок и валидацией размера.
</module_purpose>

<public_api>
**Функции:**

- `readFileContent(input: FileInput): Promise<FileReadResult>` - основная функция чтения
- `readFileSync(filePath: string, encoding?: string): string` - синхронное чтение
- `readFileContentFallback(filePath: string): Promise<FileReadResult>` - чтение с fallback кодировками

**Helpers:**

- `validateFilePath(path: string): boolean` - валидация пути к файлу
- `detectEncoding(buffer: Buffer): string` - автоопределение кодировки
- `buildSuccessResult(content: string, metadata: FileMetadata): FileReadResult` - построение успешного результата

**Типы:**

- `FileInput` - входные параметры (путь, кодировка, лимиты)
- `FileReadResult` - результат чтения с метаданными
- `FileMetadata` - метаданные файла (размер, кодировка, mtime)
  </public_api>

<usage_examples>
**Основное использование:**

```typescript
import { readFileContent } from './file-reader';

// Чтение TypeScript файла
const result = await readFileContent({
    type: 'file',
    data: 'src/utils.ts',
    encoding: 'utf8',
});

if (result.success) {
    console.log(`Прочитано ${result.content.length} символов`);
}
```

**Интеграция:**

```typescript
// Использование в validation workflow
const fileContent = await readFileContent(input);
const validationResult = await validateCode({
    validationType: 'code',
    input: { type: 'content', data: fileContent.content },
});
```

</usage_examples>

<module_structure>

```xml
<module_root name="file-reader">
  <main_files>
    <file name="index.ts" role="публичный API модуля"/>
    <file name="read-file-content.ts" role="основная асинхронная функция"/>
    <file name="read-file-sync.ts" role="синхронная функция"/>
    <file name="read-file-content-fallback.ts" role="чтение с fallback"/>
  </main_files>
  <internal_files>
    <file name="helpers/file-operations.ts" role="файловые операции"/>
    <file name="helpers/path-utils.ts" role="работа с путями"/>
    <file name="helpers/error-handling.ts" role="обработка ошибок"/>
    <file name="helpers/result-builders.ts" role="построение результатов"/>
    <file name="types.ts" role="типы модуля"/>
  </internal_files>
  <tests>
    <directory name="__tests__">
      <file name="index.test.ts" role="интеграционные тесты"/>
      <file name="read-file-content.test.ts" role="тесты основной функции"/>
      <file name="helpers/__tests__/*.test.ts" role="тесты helpers"/>
    </directory>
  </tests>
</module_root>
```

</module_structure>

<dependencies>
**Node.js:** node:fs, node:path (для файловых операций)
**Внешние:** нет
**Внутренние:** ../../../lib/helpers/logger (для логирования ошибок)
</dependencies>

<notes>
**Особенности:** Поддержка UTF-8/UTF-16/ASCII кодировок, автоопределение кодировки, валидация размера файла, обработка несуществующих файлов
**Ограничения:** Максимум 100KB файл, только локальные файлы (не HTTP), синхронные и асинхронные варианты
</notes>
