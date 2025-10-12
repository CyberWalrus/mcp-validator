/** Карта кэшированных промптов и шаблонов */
export type PromptCache = Map<string, string>;

/** Конфигурация путей к промптам */
export type PromptPaths = {
    /** Путь к директории с шаблонами ошибок */
    errors: string;
    /** Путь к директории с промптами тестирования */
    testing: string;
    /** Путь к директории с промптами инструментов */
    tools: string;
    /** Путь к директории с промптами валидации */
    validation: string;
};

/** Результат инициализации кэша */
export type CacheInitResult = {
    /** Список ошибок при загрузке */
    errors: string[];
    /** Количество загруженных промптов */
    loaded: number;
};
