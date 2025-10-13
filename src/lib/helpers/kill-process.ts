import { spawn } from 'node:child_process';

import type { KillableProcess } from './types';

/** Кросс-платформенное завершение процесса */
export function killProcess(process: KillableProcess): void {
    if (process.pid === undefined || process.pid === null || process.killed) {
        return;
    }

    if (process.platform === 'win32') {
        try {
            spawn('taskkill', ['/pid', process.pid.toString(), '/f', '/t'], {
                detached: true,
                stdio: 'ignore',
            });
        } catch {
            try {
                process.kill('SIGKILL');
            } catch {
                // Игнорируем ошибки, если процесс уже завершен
            }
        }
    } else {
        try {
            process.kill('SIGTERM');
        } catch {
            // Игнорируем ошибки, если процесс уже завершен
        }
    }
}
