/** Кэш для версии пакета */
let cachedVersion: string | null = null;

/** Сбрасывает кэш версии (для тестов) */
export function resetVersionCache(): void {
    cachedVersion = null;
}

/** Получает кэшированную версию пакета */
export function getCachedVersion(): string | null {
    return cachedVersion;
}

/** Устанавливает кэшированную версию пакета */
export function setCachedVersion(version: string): void {
    cachedVersion = version;
}
