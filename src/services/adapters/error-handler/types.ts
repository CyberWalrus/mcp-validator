/** Контекст данных для рендеринга ошибок */
export type ErrorContext = {
    errorCode: number;
    errorMessage: string;
    errorType: string;
    causes?: string[];
    context?: string;
    errorDetails?: string;
    filePath?: string;
    fileSizeLimit?: string;
    lineNumber?: number;
    operation?: string;
    solutions?: string[];
    stackTrace?: string;
    systemInfo?: {
        memoryUsage: string;
        nodeVersion: string;
        platform: string;
        uptime: string;
    };
};

/** Метаданные шаблона ошибки */
export type ErrorTemplate = {
    errorType: 'file' | 'system' | 'validation';
    requiredFields: string[];
    templatePath: string;
};

/** Результат рендеринга ошибки */
export type RenderErrorResult = {
    content: string;
    success: boolean;
    error?: string;
};
