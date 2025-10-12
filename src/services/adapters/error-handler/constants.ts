import { getPackageResourceResolver } from '../../../lib/helpers/resource-resolver';

/** Resolver для ресурсов пакета */
const resourceResolver = getPackageResourceResolver();

/** Путь к директории с шаблонами ошибок */
export const ERROR_TEMPLATES_PATH = resourceResolver.resolveErrorTemplatesDir();

/** Маппинг кодов JSON-RPC ошибок к типам шаблонов */
export const ERROR_CODE_TO_TYPE = {
    [-32700]: 'system', // Parse error
    [-32600]: 'system', // Invalid Request
    [-32601]: 'system', // Method not found
    [-32602]: 'validation', // Invalid params
    [-32603]: 'system', // Internal error
    [-32000]: 'file', // Server error (часто файловые операции)
    [-32001]: 'validation', // Application error (валидация)
    [-32002]: 'system', // System error
} as const;

/** Маппинг типов ошибок к файлам шаблонов */
export const ERROR_TYPE_TO_TEMPLATE = {
    file: 'file-error.md',
    system: 'system-error.md',
    validation: 'validation-error.md',
} as const;

/** Обязательные поля для каждого типа шаблона */
export const TEMPLATE_REQUIRED_FIELDS = {
    file: ['operation', 'file_path', 'error_message', 'file_size_limit'],
    system: [
        'error_type',
        'error_message',
        'error_code',
        'node_version',
        'platform',
        'memory_usage',
        'uptime',
        'stack_trace',
    ],
    validation: ['error_type', 'error_message', 'error_details'],
} as const;

/** Значения по умолчанию для обязательных полей */
export const DEFAULT_FIELD_VALUES = {
    error_code: '-32603',
    error_details: 'Подробности ошибки недоступны',
    error_message: 'Детали ошибки недоступны',
    error_type: 'Неизвестная ошибка',
    file_path: 'путь к файлу недоступен',
    file_size_limit: '10MB',
    memory_usage: 'Недоступно',
    node_version: process.version,
    operation: 'выполнить операцию',
    platform: process.platform,
    stack_trace: 'Стек вызова недоступен',
    uptime: 'Недоступно',
} as const;
