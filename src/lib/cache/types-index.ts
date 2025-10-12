import type { CacheInitResult } from './types';

export type { CacheInitResult, PromptCache, PromptPaths } from './types';

/** Типы функций для совместимости */
export type InitializePromptCacheFn = () => CacheInitResult;
export type GetPromptFn = (id: string) => string;
