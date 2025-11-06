import type { E2ETestContext } from '../types';

/** Очищает ресурсы после E2E тестирования */
export async function cleanupE2EEnvironment(context: E2ETestContext | undefined | null): Promise<void> {
    if (context === null || context === undefined) {
        return;
    }

    if (context.cleanup) {
        await context.cleanup();
    }
}

