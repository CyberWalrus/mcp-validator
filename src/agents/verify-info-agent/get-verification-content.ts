import type { VerifyInfoInput } from '../../model/config';
import { readFileContent } from '../../services/adapters/file-reader';
import type { VerificationContentResult } from './types';

/** Получает контент для проверки информации из входных данных */
export async function getVerificationContent(verifyInput: VerifyInfoInput): Promise<VerificationContentResult> {
    if (verifyInput.input.type === 'file') {
        const fileResult = await readFileContent({
            encoding: verifyInput.input.encoding || verifyInput.encoding || 'utf8',
            path: verifyInput.input.data,
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

    if (verifyInput.input.type === 'content') {
        return {
            content: verifyInput.input.data,
            success: true,
        };
    }

    return {
        error: 'Неподдерживаемый тип входных данных. Поддерживаются только content и file',
        success: false,
    };
}
