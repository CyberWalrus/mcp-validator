import type { ValidationType } from '../../../lib/helpers/resource-resolver/types';
import type { ValidationPromptConfig } from './types';

/** Поддерживаемые типы валидации */
export const VALIDATION_TYPES: readonly ValidationType[] = [
    'code',
    'tests',
    'architecture',
    'documentation',
    'prompts',
] as const;

/** Конфигурация промптов для каждого типа валидации */
export const VALIDATION_PROMPTS: Record<ValidationType, ValidationPromptConfig> = {
    architecture: {
        requiredParams: ['code', 'language'],
        type: 'architecture',
    },
    code: {
        requiredParams: ['code', 'language'],
        type: 'code',
    },
    documentation: {
        requiredParams: ['code', 'language'],
        type: 'documentation',
    },
    prompts: {
        requiredParams: ['code', 'language'],
        type: 'prompts',
    },
    tests: {
        requiredParams: ['code', 'language'],
        type: 'tests',
    },
} as const;

/** Максимальный размер входного файла (1MB) */
export const MAX_FILE_SIZE = 1024 * 1024;

/** Поддерживаемые расширения файлов */
export const SUPPORTED_EXTENSIONS = [
    '.ts',
    '.tsx',
    '',
    '.jsx',
    '.py',
    '.go',
    '.rs',
    '.java',
    '.cpp',
    '.c',
    '.php',
    '.rb',
    '.swift',
    '.kt',
    '.cs',
    '.vue',
    '.svelte',
    '.md',
    '.json',
    '.yaml',
    '.yml',
    '.toml',
    '.sql',
] as const;

/** Timeout для валидации в миллисекундах */
export const VALIDATION_TIMEOUT = Number(process.env['VALIDATION_TIMEOUT']) || 30000;
