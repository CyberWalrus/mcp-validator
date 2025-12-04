import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { elicitValidationType } from '../../../server/elicitation';
import { handleValidateTool } from '../../validate-tool';
import { createValidateInteractiveHandler, handleValidateInteractiveTool } from '../handle-validate-interactive-tool';

vi.mock('../../validate-tool', () => ({
    handleValidateTool: vi.fn(),
}));

vi.mock('../../../server/elicitation', () => ({
    elicitValidationType: vi.fn(),
}));

/** Создает мок McpServer */
function createMockMcpServer(): McpServer {
    return {
        server: {
            elicitInput: vi.fn(),
        },
    } as unknown as McpServer;
}

describe('handleValidateInteractiveTool', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('должен вернуть ошибку если filePath пустой', async () => {
        const mockServer = createMockMcpServer();

        const result = await handleValidateInteractiveTool(mockServer, {
            filePath: '',
        });

        expect(result.isError).toBe(true);
        expect(result.content).toContain('filePath');
    });

    it('должен вернуть ошибку если filePath undefined', async () => {
        const mockServer = createMockMcpServer();

        const result = await handleValidateInteractiveTool(mockServer, {
            filePath: undefined as unknown as string,
        });

        expect(result.isError).toBe(true);
        expect(result.content).toContain('filePath');
    });

    it('должен вызвать elicitValidationType если validationType не указан', async () => {
        const mockServer = createMockMcpServer();
        vi.mocked(elicitValidationType).mockResolvedValue('code');
        vi.mocked(handleValidateTool).mockResolvedValue({
            content: 'validation result',
            isError: false,
        });

        await handleValidateInteractiveTool(mockServer, {
            filePath: '/test/file.ts',
        });

        expect(elicitValidationType).toHaveBeenCalledWith(mockServer, '/test/file.ts');
    });

    it('должен не вызывать elicitValidationType если validationType указан', async () => {
        const mockServer = createMockMcpServer();
        vi.mocked(handleValidateTool).mockResolvedValue({
            content: 'validation result',
            isError: false,
        });

        await handleValidateInteractiveTool(mockServer, {
            filePath: '/test/file.ts',
            validationType: 'code',
        });

        expect(elicitValidationType).not.toHaveBeenCalled();
    });

    it('должен вернуть сообщение об отмене если elicitValidationType вернул null', async () => {
        const mockServer = createMockMcpServer();
        vi.mocked(elicitValidationType).mockResolvedValue(null);

        const result = await handleValidateInteractiveTool(mockServer, {
            filePath: '/test/file.ts',
        });

        expect(result.content).toContain('Валидация отменена');
        expect(result.isError).toBe(false);
    });

    it('должен вызвать handleValidateTool с корректными параметрами при указанном validationType', async () => {
        const mockServer = createMockMcpServer();
        vi.mocked(handleValidateTool).mockResolvedValue({
            content: 'validation result',
            isError: false,
        });

        await handleValidateInteractiveTool(mockServer, {
            context: 'test context',
            filePath: '/test/file.ts',
            language: 'javascript',
            validationType: 'tests',
        });

        expect(handleValidateTool).toHaveBeenCalledWith({
            context: 'test context',
            input: {
                data: '/test/file.ts',
                type: 'file',
            },
            language: 'javascript',
            validationType: 'tests',
        });
    });

    it('должен использовать typescript как язык по умолчанию', async () => {
        const mockServer = createMockMcpServer();
        vi.mocked(handleValidateTool).mockResolvedValue({
            content: 'validation result',
            isError: false,
        });

        await handleValidateInteractiveTool(mockServer, {
            filePath: '/test/file.ts',
            validationType: 'code',
        });

        expect(handleValidateTool).toHaveBeenCalledWith(
            expect.objectContaining({
                language: 'typescript',
            }),
        );
    });

    it('должен вызвать handleValidateTool с типом из elicitation', async () => {
        const mockServer = createMockMcpServer();
        vi.mocked(elicitValidationType).mockResolvedValue('architecture');
        vi.mocked(handleValidateTool).mockResolvedValue({
            content: 'validation result',
            isError: false,
        });

        await handleValidateInteractiveTool(mockServer, {
            filePath: '/test/file.ts',
        });

        expect(handleValidateTool).toHaveBeenCalledWith(
            expect.objectContaining({
                validationType: 'architecture',
            }),
        );
    });

    it('должен вернуть результат от handleValidateTool', async () => {
        const mockServer = createMockMcpServer();
        const expectedResult = {
            content: 'Validation passed with score 95',
            isError: false,
        };
        vi.mocked(handleValidateTool).mockResolvedValue(expectedResult);

        const result = await handleValidateInteractiveTool(mockServer, {
            filePath: '/test/file.ts',
            validationType: 'code',
        });

        expect(result).toEqual(expectedResult);
    });

    it('должен обработать ошибку и вернуть isError: true', async () => {
        const mockServer = createMockMcpServer();
        vi.mocked(handleValidateTool).mockRejectedValue(new Error('Test error'));

        const result = await handleValidateInteractiveTool(mockServer, {
            filePath: '/test/file.ts',
            validationType: 'code',
        });

        expect(result.isError).toBe(true);
        expect(result.content).toContain('Test error');
    });
});

describe('createValidateInteractiveHandler', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('должен создать функцию-обработчик', () => {
        const mockServer = createMockMcpServer();

        const handler = createValidateInteractiveHandler(mockServer);

        expect(typeof handler).toBe('function');
    });

    it('должен возвращать обработчик который вызывает handleValidateInteractiveTool', async () => {
        const mockServer = createMockMcpServer();
        vi.mocked(handleValidateTool).mockResolvedValue({
            content: 'result',
            isError: false,
        });

        const handler = createValidateInteractiveHandler(mockServer);
        await handler({
            filePath: '/test/file.ts',
            validationType: 'code',
        });

        expect(handleValidateTool).toHaveBeenCalled();
    });
});
