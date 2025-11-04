/** Кэш для имени пакета */
let cachedName: string | null = null;

/** Получает кэшированное имя пакета */
export function getCachedName(): string | null {
    return cachedName;
}

/** Устанавливает кэшированное имя пакета */
export function setCachedName(name: string): void {
    cachedName = name;
}
