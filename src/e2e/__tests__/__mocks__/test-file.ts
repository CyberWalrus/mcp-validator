/** Тестовый файл для проверки e2e чтения файлов */
export const testConstant = 'Hello from mock file!';

export function testFunction(): string {
    return 'Mock function executed successfully';
}

/** Тестовые данные для валидации */
export const testData = {
    config: {
        enabled: true,
        timeout: 5000,
    },
    description: 'E2E test data for file reading validation',
    features: ['file-reading', 'validation', 'e2e-testing'],
    version: '2.0.0',
} as const;
