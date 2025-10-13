import { getPrompt } from '../../../lib/cache';
import { ERROR_TYPE_TO_TEMPLATE } from './constants';

/** Загружает markdown шаблон ошибки по типу из кэша */
export function loadErrorTemplate(errorType: 'file' | 'system' | 'validation'): string {
    const templateFileName = ERROR_TYPE_TO_TEMPLATE[errorType];

    if (templateFileName === null || templateFileName === undefined) {
        throw new Error(`Шаблон для типа ошибки "${errorType}" не найден`);
    }

    return getPrompt(templateFileName);
}
