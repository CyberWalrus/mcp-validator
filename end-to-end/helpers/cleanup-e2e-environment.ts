import type { E2ETestContext } from '../types';

/** Очищает ресурсы после E2E тестирования */
export async function cleanupE2EEnvironment(context: E2ETestContext): Promise<void> {
    if (context.cleanup) {
        await context.cleanup();
    }
}

