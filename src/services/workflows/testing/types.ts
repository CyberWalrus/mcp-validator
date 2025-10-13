/** Типы для модуля параллельного тестирования промптов */
export type ParallelTestParams = {
    prompt: string;
    context?: string;
    iterations?: number;
    timeout?: number;
};

export type TestIterationResult = {
    iteration: number | string;
    responseTime: number;
    startTime: string;
    success: boolean;
    endTime?: string;
    error?: string;
    model?: string;
    response?: string;
};

export type ParallelTestResult = {
    averageResponseTime: number;
    consistency: ConsistencyAnalysis;
    failedTests: number;
    metadata: TestMetadata;
    results: TestIterationResult[];
    success: boolean;
    successfulTests: number;
    totalTests: number;
};

export type ConsistencyAnalysis = {
    analysis: string;
    anomalies: string[];
    patterns: string[];
    recommendations: string[];
    score: number;
    aiAnalysis?: string;
    hasAiAnalysis?: boolean;
};

export type TestMetadata = {
    duration: number;
    endTime: string;
    originalPrompt: string;
    startTime: string;
    validatorVersion: string;
    context?: string;
};
