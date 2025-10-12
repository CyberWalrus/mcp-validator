import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { showVersion } from '../show-version';

// Мокируем зависимости
vi.mock('../../helpers/logger');
vi.mock('../../helpers/version');

const mockInfo = vi.fn();
const mockGetPackageVersion = vi.fn();

vi.mocked(await import('../../helpers/logger')).info = mockInfo;
vi.mocked(await import('../../helpers/version')).getPackageVersion = mockGetPackageVersion;

describe('showVersion', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('должен показывать номер версии', () => {
        const testVersion = '2.0.0';
        mockGetPackageVersion.mockReturnValue(testVersion);

        showVersion();

        expect(mockGetPackageVersion).toHaveBeenCalledTimes(1);
        expect(mockInfo).toHaveBeenCalledWith(`mcp-validator v${testVersion}`);
    });

    it('должен показывать версию из package.json', () => {
        const testVersion = '1.0.0';
        mockGetPackageVersion.mockReturnValue(testVersion);

        showVersion();

        expect(mockGetPackageVersion).toHaveBeenCalledTimes(1);
        expect(mockInfo).toHaveBeenCalledWith(`mcp-validator v${testVersion}`);
    });
});
