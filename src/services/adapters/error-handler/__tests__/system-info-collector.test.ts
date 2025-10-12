import { collectSystemInfo } from '../helpers/system-info-collector';

describe('collectSystemInfo', () => {
    it('должен возвращать системную информацию', () => {
        const result = collectSystemInfo();

        expect(result).toHaveProperty('nodeVersion');
        expect(result).toHaveProperty('platform');
        expect(result).toHaveProperty('memoryUsage');
        expect(result).toHaveProperty('uptime');

        expect(result.nodeVersion).toBe(process.version);
        expect(result.platform).toBe(process.platform);
        expect(result.memoryUsage).toMatch(/^\d+MB$/);
        expect(result.uptime).toMatch(/^\d+[чм]/);
    });

    it('должен форматировать время работы в читаемом виде', () => {
        const result = collectSystemInfo();

        // Проверяем что время работы в правильном формате
        expect(result.uptime).toMatch(/^(\d+ч\s)?\d+м$/);
    });

    it('должен возвращать использование памяти в мегабайтах', () => {
        const result = collectSystemInfo();

        expect(result.memoryUsage).toMatch(/^\d+MB$/);
        expect(parseInt(result.memoryUsage, 10)).toBeGreaterThan(0);
    });
});
