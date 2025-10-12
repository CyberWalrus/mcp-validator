import { detectErrorType } from './helpers/error-type-detector';
import { renderTemplate } from './helpers/template-renderer';
import { formatErrorContext } from './format-error-context';
import { loadErrorTemplate } from './load-error-template';
import type { ErrorContext, RenderErrorResult } from './types';

/** Основная функция для рендеринга markdown ошибок */
export function renderErrorResponse(context: ErrorContext): RenderErrorResult {
    try {
        const errorType = context.errorType || detectErrorType(context.errorCode);

        if (!['system', 'validation', 'file'].includes(errorType)) {
            return {
                content: '',
                error: `Неподдерживаемый тип ошибки: ${errorType}, шаблон не найден`,
                success: false,
            };
        }

        const template = loadErrorTemplate(errorType as 'file' | 'system' | 'validation');
        const templateVariables = formatErrorContext(context);
        const renderedContent = renderTemplate(template, templateVariables);

        return {
            content: renderedContent,
            success: true,
        };
    } catch (error) {
        return {
            content: '',
            error: error instanceof Error ? error.message : String(error),
            success: false,
        };
    }
}
