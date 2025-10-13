import type { AppConfig } from '../../types/main';

/** Присваивает значения конфигурации из источника в цель */
export function assignConfig(target: AppConfig, source: AppConfig): void {
    Object.assign(target.model, source.model);
    Object.assign(target.api, source.api);
    Object.assign(target.timeouts, source.timeouts);
    Object.assign(target.logging, source.logging);
    Object.assign(target.paths, source.paths);
    Object.assign(target.runtime, source.runtime);
}
