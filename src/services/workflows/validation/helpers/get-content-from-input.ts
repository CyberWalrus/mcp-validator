import { readFileContent } from '../../../adapters/file-reader';
import type { ValidationParams } from '../types';

/** Получает содержимое из различных источников */
export async function getContentFromInput(params: ValidationParams): Promise<{
    main: string;
    additional?: string[];
}> {
    let mainContent: string;

    switch (params.input.type) {
        case 'content':
            mainContent = params.input.data;
            break;

        case 'file': {
            const fileResult = await readFileContent({
                encoding: params.input.encoding ?? 'utf8',
                path: params.input.data,
            });
            if (!fileResult.success || !fileResult.content) {
                throw new Error(fileResult.error || 'Ошибка чтения файла');
            }
            mainContent = fileResult.content;
            break;
        }

        case 'url':
            throw new Error('URL источники пока не поддерживаются');

        default:
            throw new Error(`Неизвестный тип источника: ${params.input.type as string}`);
    }

    let additionalContent: string[] | undefined;
    if (params.additionalFiles && params.additionalFiles.length > 0) {
        const additionalResults = await Promise.all(
            params.additionalFiles.map(async (filePath) => {
                const fileResult = await readFileContent({ path: filePath });
                if (!fileResult.success || !fileResult.content) {
                    throw new Error(`Ошибка чтения дополнительного файла ${filePath}: ${fileResult.error}`);
                }

                return `// ${filePath}\n${fileResult.content}`;
            }),
        );
        additionalContent = additionalResults;
    }

    if (additionalContent) {
        return {
            additional: additionalContent,
            main: mainContent,
        };
    }

    return {
        main: mainContent,
    };
}
