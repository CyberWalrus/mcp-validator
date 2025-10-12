import { info } from '../helpers/logger';
import { getPackageVersion } from '../helpers/version';

/** Показывает версию из package.json */
export function showVersion(): void {
    const version = getPackageVersion();
    info(`mcp-validator v${version}`);
}
