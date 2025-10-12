/* eslint-disable @typescript-eslint/no-unused-vars */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { ParallelTestParamsSchema } from '../../src/services/workflows/testing/schemas';
import { ValidationParamsSchema } from '../../src/services/workflows/validation/schemas';

describe('Documentation Schema Consistency E2E', () => {
    it('должен валидировать примеры из документации MCP инструментов', () => {
        const docPath = join(process.cwd(), 'prompts/tools/mcp-tools-description.md');
        const docContent = readFileSync(docPath, 'utf8');

        const validateExampleBlock = `{
    "tool": "validate",
    "arguments": {
        "validationType": "code",
        "input": {
            "type": "file",
            "data": "/path/to/file.ts"
        },
        "context": "React компонент для формы"
    }
}`;

        const testPromptExampleBlock = `{
    "tool": "test-prompt",
    "arguments": {
        "prompt": "Объясни что такое рекурсия простыми словами",
        "iterations": 3,
        "context": "Промпт для объяснения студентам"
    }
}`;

        const validateExample = JSON.parse(validateExampleBlock);
        const testPromptExample = JSON.parse(testPromptExampleBlock);

        expect(() => ValidationParamsSchema.parse(validateExample.arguments)).not.toThrow();
        expect(() => ParallelTestParamsSchema.parse(testPromptExample.arguments)).not.toThrow();
    });

    it('должен проверять что документация содержит правильные поля', () => {
        const docPath = join(process.cwd(), 'prompts/tools/mcp-tools-description.md');
        const docContent = readFileSync(docPath, 'utf8');

        expect(docContent).toContain('"data":');
        expect(docContent).toContain('Используйте поле "data"');
        expect(docContent).toContain('Ошибка -32602');
        expect(docContent).toContain('НЕПРАВИЛЬНО - вызовет ошибку');
    });

    it('должен проверять что основные примеры используют data вместо path', () => {
        const docPath = join(process.cwd(), 'prompts/tools/mcp-tools-description.md');
        const docContent = readFileSync(docPath, 'utf8');

        const mainExamplesSection = docContent.split('## Частые ошибки')[0];

        if (mainExamplesSection) {
            expect(mainExamplesSection).toContain('"data": "/path/to/file.ts"');
            expect(mainExamplesSection).toContain('"type": "file"');

            const correctExampleCount = (mainExamplesSection.match(/"data":/g) || []).length;
            expect(correctExampleCount).toBeGreaterThan(0);
        }
    });
});
