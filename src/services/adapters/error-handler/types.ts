/** Контекст данных для рендеринга ошибок */
export type ErrorContext = {
    /** Код ошибки JSON-RPC */
    errorCode: number;
    /** Сообщение об ошибке */
    errorMessage: string;
    /** Тип ошибки для определения шаблона */
    errorType: string;
    /** Причины ошибки */
    causes?: string[];
    /** Дополнительный контекст */
    context?: string;
    /** Детали ошибки валидации */
    errorDetails?: string;
    /** Путь к файлу где произошла ошибка */
    filePath?: string;
    /** Лимит размера файла */
    fileSizeLimit?: string;
    /** Номер строки ошибки */
    lineNumber?: number;
    /** Дополнительная информация об операции */
    operation?: string;
    /** Варианты решения */
    solutions?: string[];
    /** Стек вызова ошибки */
    stackTrace?: string;
    /** Системная информация для диагностики */
    systemInfo?: {
        memoryUsage: string;
        nodeVersion: string;
        platform: string;
        uptime: string;
    };
};

/** Метаданные шаблона ошибки */
export type ErrorTemplate = {
    /** Категория ошибки */
    errorType: 'file' | 'system' | 'validation';
    /** Обязательные поля для рендеринга */
    requiredFields: string[];
    /** Путь к файлу шаблона */
    templatePath: string;
};

/** Результат рендеринга ошибки */
export type RenderErrorResult = {
    /** Отрендеренный markdown контент */
    content: string;
    /** Успешность операции */
    success: boolean;
    /** Ошибка рендеринга если есть */
    error?: string;
};
