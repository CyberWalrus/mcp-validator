import type { ValidationType } from '../../model/config';

/** Результат elicitation запроса */
export type ElicitationResult<TContent = unknown> = {
    /** Действие пользователя: accept - принял, decline - отклонил, cancel - отменил */
    action: 'accept' | 'cancel' | 'decline';
    /** Содержимое ответа (если action === 'accept') */
    content?: TContent;
};

/** Содержимое ответа для выбора типа валидации */
export type ValidationTypeContent = {
    /** Выбранный тип валидации */
    validationType: ValidationType;
};

/** Содержимое ответа для подтверждения */
export type ConfirmationContent = {
    /** Подтверждение действия */
    confirm: boolean;
};

/** Схема JSON Schema для elicitation запроса */
export type ElicitationSchema = {
    /** Свойства объекта */
    properties: Record<
        string,
        {
            /** Тип свойства */
            type: 'boolean' | 'number' | 'string';
            /** Описание свойства */
            description?: string;
            /** Допустимые значения (для enum) */
            enum?: readonly string[];
            /** Человекочитаемые названия для enum */
            enumNames?: readonly string[];
            /** Заголовок свойства */
            title?: string;
        }
    >;
    /** Обязательные свойства */
    required: readonly string[];
    /** Тип схемы */
    type: 'object';
};

/** Параметры для elicitInput */
export type ElicitInputParams = {
    /** Сообщение для пользователя */
    message: string;
    /** Схема запрашиваемых данных */
    requestedSchema: ElicitationSchema;
};
