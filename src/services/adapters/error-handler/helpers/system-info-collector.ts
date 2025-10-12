/** Форматирует время работы в читаемом виде */
function formatUptime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
        return `${hours}ч ${minutes}м`;
    }

    return `${minutes}м`;
}

/** Собирает системную информацию для диагностики ошибок */
export function collectSystemInfo() {
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();

    return {
        memoryUsage: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        nodeVersion: process.version,
        platform: process.platform,
        uptime: formatUptime(uptime),
    };
}
