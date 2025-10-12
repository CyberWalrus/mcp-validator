import type { InputSource, ValidationResult, ValidationType } from '../../../model/types/main';

/** Параметры для валидации кода */
export type ValidationParams = {
    /** Источник входных данных */
    input: InputSource;
    /** Тип валидации */
    validationType: ValidationType;
    /** Дополнительные файлы для контекста */
    additionalFiles?: string[];
    /** Дополнительный контекст */
    context?: string;
    /** Кастомный промпт (только для custom типа) */
    customPrompt?: string;
    /** Язык программирования */
    language?: string;
};

/** Результат валидации с дополнительными данными */
export type ValidationResponse = ValidationResult & {
    /** Время выполнения валидации в миллисекундах */
    duration: number;
    /** Использованный промпт */
    promptUsed: string;
    /** Токены использованные в запросе */
    tokensUsed?: number;
};

/** Контекст валидации для промпта */
export type ValidationContext = {
    /** Код для валидации */
    code: string;
    /** Язык программирования */
    language: string;
    /** Дополнительные файлы */
    additionalFiles?: string[];
    /** Дополнительный контекст */
    context?: string;
};

/** Конфигурация промпта для валидации */
export type ValidationPromptConfig = {
    /** Обязательные параметры */
    requiredParams: string[];
    /** Тип валидации */
    type: ValidationType;
};
