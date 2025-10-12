import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { APP_CONFIG, getAppConfigError } from '../../model/config';
import type { AppConfig } from '../../model/types/main';
import { error as logError } from '../helpers/logger';
import type { CacheInitResult, PromptCache, PromptPaths } from './types';

/** Глобальный кэш промптов */
const promptCache: PromptCache = new Map();

function getConfigOrThrow(): AppConfig {
    const config = APP_CONFIG;

    const configError = getAppConfigError();

    if (!config || configError) {
        const message = configError?.message ?? 'Конфигурация приложения недоступна';

        throw new Error(message);
    }

    return config;
}

/** Получение путей к директориям с промптами */
function getPromptPaths(): PromptPaths {
    const config = getConfigOrThrow();
    const {
        paths: { prompts: promptsDir },
    } = config;

    return {
        errors: join(promptsDir, 'errors'),
        testing: join(promptsDir, 'testing'),
        tools: join(promptsDir, 'tools'),
        validation: join(promptsDir, 'validation'),
    };
}

/** Загрузка всех MD файлов из указанной директории */
function loadPromptsFromDirectory(dirPath: string): Map<string, string> {
    const prompts = new Map<string, string>();

    if (!existsSync(dirPath)) {
        return prompts;
    }

    const files = readdirSync(dirPath).filter((file) => file.endsWith('.md'));

    files.forEach((file) => {
        try {
            const filePath = join(dirPath, file);
            const content = readFileSync(filePath, 'utf-8');
            prompts.set(file, content);
        } catch (error) {
            logError(`Ошибка загрузки промпта ${file}:`, { error });
        }
    });

    return prompts;
}

/** Инициализация кэша промптов */
export function initializePromptCache(): CacheInitResult {
    const paths = getPromptPaths();
    const errors: string[] = [];
    let loaded = 0;

    promptCache.clear();

    const validationPrompts = loadPromptsFromDirectory(paths.validation);
    const testingPrompts = loadPromptsFromDirectory(paths.testing);
    const toolsPrompts = loadPromptsFromDirectory(paths.tools);
    const errorPrompts = loadPromptsFromDirectory(paths.errors);

    [validationPrompts, testingPrompts, toolsPrompts, errorPrompts].forEach((prompts) => {
        prompts.forEach((content, id) => {
            promptCache.set(id, content);
            loaded++;
        });
    });

    return { errors, loaded };
}

/** Получение промпта из кэша */
export function getPrompt(id: string): string {
    const content = promptCache.get(id);

    if (content === undefined) {
        throw new Error(`Промпт "${id}" не найден в кэше`);
    }

    return content;
}

export type InitializePromptCacheFn = typeof initializePromptCache;
export type GetPromptFn = typeof getPrompt;
