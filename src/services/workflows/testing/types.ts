/** Типы для модуля параллельного тестирования промптов - импортируются из model/config */

export type {
    ConsistencyAnalysis,
    ParallelTestParams,
    ParallelTestResult,
    TestIterationResult,
} from '../../../model/config';

/** Метаданные тестирования */
export type TestMetadata = {
    duration: number;
    endTime: string;
    originalPrompt: string;
    startTime: string;
    validatorVersion: string;
    context?: string;
};
