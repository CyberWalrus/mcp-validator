import type { ValidationType } from '../../model/config';

/** Параметры интерактивного инструмента валидации */
export type ValidateInteractiveParams = {
    /** Путь к файлу для валидации */
    filePath: string;
    /** Дополнительный контекст для валидации */
    context?: string;
    /** Язык программирования */
    language?: string;
    /** Тип валидации (если не указан - будет запрошен через elicitation) */
    validationType?: ValidationType;
};

/** Результат обработки интерактивного инструмента */
export type ValidateInteractiveResult = {
    /** Содержимое результата */
    content: string;
    /** Флаг ошибки */
    isError?: boolean;
};
