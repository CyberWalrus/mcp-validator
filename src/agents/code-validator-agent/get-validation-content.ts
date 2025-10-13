import type { ValidationInput } from '../../model/types/main';
import { readFileContent } from '../../services/adapters/file-reader';
import type { ValidationContentResult } from './types';

/** Получает контент для валидации из входных данных */
export async function getValidationContent(validationInput: ValidationInput): Promise<ValidationContentResult> {
    if (validationInput.input.type === 'file') {
        const fileResult = await readFileContent({
            encoding: validationInput.input.encoding || 'utf8',
            path: validationInput.input.data,
        });

        if (fileResult.success === false) {
            return {
                error: `Ошибка чтения файла: ${fileResult.error}`,
                success: false,
            };
        }

        return {
            content: fileResult.content!,
            success: true,
        };
    }

    if (validationInput.input.type === 'content') {
        return {
            content: validationInput.input.data,
            success: true,
        };
    }

    return {
        error: 'Неподдерживаемый тип входных данных',
        success: false,
    };
}
