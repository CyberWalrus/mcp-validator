/** Типы для MCP ресурсов валидатора */

/** Параметры динамического ресурса промптов */
export type PromptResourceParams = {
    /** Тип валидации для получения промпта */
    type: string;
};

/** Контент ресурса */
export type ResourceContent = {
    /** MIME-тип контента */
    mimeType: string;
    /** Текстовое содержимое ресурса */
    text: string;
    /** URI ресурса */
    uri: string;
};

/** Результат чтения ресурса */
export type ResourceReadResult = {
    /** Массив контента ресурса */
    contents: ResourceContent[];
};
