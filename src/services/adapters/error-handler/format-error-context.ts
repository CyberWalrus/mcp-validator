import { collectSystemInfo } from './helpers/system-info-collector';
import { DEFAULT_FIELD_VALUES } from './constants';
import type { ErrorContext } from './types';

/** Форматирует контекст ошибки для рендеринга шаблона */
export function formatErrorContext(context: ErrorContext): Record<string, unknown> {
    // Собираем системную информацию если не передана
    const systemInfo = context.systemInfo ?? collectSystemInfo();

    return {
        causes: context.causes || [],

        context: context.context || '',

        error_code: context.errorCode.toString() || DEFAULT_FIELD_VALUES.error_code,

        // Валидация
        error_details: context.errorDetails || context.errorMessage || DEFAULT_FIELD_VALUES.error_details,

        error_message: context.errorMessage || DEFAULT_FIELD_VALUES.error_message,

        // Основная информация об ошибке
        error_type: context.errorType || DEFAULT_FIELD_VALUES.error_type,

        file_info: context.filePath
            ? {
                  file_path: context.filePath,
                  line_number: context.lineNumber?.toString() || '',
              }
            : undefined,

        file_path: context.filePath || DEFAULT_FIELD_VALUES.file_path,

        file_size_limit: context.fileSizeLimit || DEFAULT_FIELD_VALUES.file_size_limit,

        // Дополнительная информация
        line_number: context.lineNumber?.toString() || '',

        memory_usage: systemInfo.memoryUsage || DEFAULT_FIELD_VALUES.memory_usage,

        // Системная информация
        node_version: systemInfo.nodeVersion || DEFAULT_FIELD_VALUES.node_version,

        // Файловые операции
        operation: context.operation || DEFAULT_FIELD_VALUES.operation,

        platform: systemInfo.platform || DEFAULT_FIELD_VALUES.platform,

        solutions: context.solutions || [],

        // Стек вызова
        stack_trace: context.stackTrace || DEFAULT_FIELD_VALUES.stack_trace,

        uptime: systemInfo.uptime || DEFAULT_FIELD_VALUES.uptime,
    };
}
