/** Параметры для чтения файла */
export type FileInput = {
    path: string;
    encoding?: 'ascii' | 'utf8' | 'utf16le';
};

/** Результат чтения файла */
export type FileResult = {
    content: string;
    encoding: string;
    size?: number;
};

/** Результат асинхронного чтения файла */
export type ReadFileContentResult = {
    encoding: string;
    path: string;
    success: boolean;
    content?: string;
    error?: string;
    size?: number;
};

/** Параметры асинхронного чтения файла */
export type ReadFileContentParams = {
    path: string;
    encoding?: 'ascii' | 'utf8' | 'utf16le';
};
