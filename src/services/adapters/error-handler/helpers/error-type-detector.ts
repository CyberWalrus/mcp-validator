import { ERROR_CODE_TO_TYPE } from '../constants';

/** Определяет тип ошибки по коду JSON-RPC */
export function detectErrorType(errorCode: number): 'file' | 'system' | 'validation' {
    const errorType = ERROR_CODE_TO_TYPE[errorCode as keyof typeof ERROR_CODE_TO_TYPE];

    if (!errorType) {
        // По умолчанию системная ошибка для неизвестных кодов
        return 'system';
    }

    return errorType;
}
