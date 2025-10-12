/** Типы валидации для разрешения путей к промптам */
export type ValidationType = 'architecture' | 'code' | 'custom' | 'documentation' | 'prompts' | 'tests';

/** Интерфейс для разрешения ресурсов пакета */
export type ResourceResolver = {
    /** Разрешает путь к промпту анализа тестов */
    resolveAnalyzeTestPromptPath: () => string;
    /** Разрешает путь к шаблону ошибки по типу */
    resolveErrorTemplatePath: (errorType: string) => string;
    /** Разрешает путь к директории с шаблонами ошибок */
    resolveErrorTemplatesDir: () => string;
    /** Разрешает путь к промпту выполнения тестов */
    resolveExecuteTestPromptPath: () => string;
    /** Разрешает путь к package.json пакета */
    resolvePackageJsonPath: () => string;
    /** Разрешает путь к промпту валидации по типу */
    resolvePromptPath: (type: ValidationType) => string;
};
