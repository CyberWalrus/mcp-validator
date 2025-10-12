import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { APP_CONFIG, getAppConfigError } from '../../model/config';
import { error as logError } from '../helpers/logger';
import { PROMPT_CACHE } from './prompt-cache-constants';
import type { CacheInitResult, PromptPaths } from './types';

/** Инициализация кэша промптов */
export function initializePromptCache(): CacheInitResult {
    const config = APP_CONFIG;
    const configError = getAppConfigError();

    if (!config || configError) {
        throw new Error(configError?.message ?? 'Конфигурация приложения недоступна');
    }

    const paths: PromptPaths = {
        errors: join(config.paths.prompts, 'errors'),
        testing: join(config.paths.prompts, 'testing'),
        tools: join(config.paths.prompts, 'tools'),
        validation: join(config.paths.prompts, 'validation'),
    };

    const errors: string[] = [];
    let loaded = 0;

    PROMPT_CACHE.clear();

    const loadPrompts = (dirPath: string): Map<string, string> => {
        const prompts = new Map<string, string>();
        if (!existsSync(dirPath)) {
            return prompts;
        }

        readdirSync(dirPath)
            .filter((file) => file.endsWith('.md'))
            .forEach((file) => {
                try {
                    const content = readFileSync(join(dirPath, file), 'utf-8');
                    prompts.set(file, content);
                } catch (error) {
                    logError(`Ошибка загрузки промпта ${file}:`, { error });
                }
            });

        return prompts;
    };

    [paths.validation, paths.testing, paths.tools, paths.errors].forEach((dirPath) => {
        const prompts = loadPrompts(dirPath);
        prompts.forEach((content, id) => {
            PROMPT_CACHE.set(id, content);
            loaded++;
        });
    });

    return { errors, loaded };
}
