import type { ValidationResponse } from '../../../workflows/validation/types';

/** Форматирует ответ валидации с метаинформацией */
export function formatValidationResponse(result: ValidationResponse): string {
    // Используем полный ответ от AI из метаданных
    const aiResponse = (result.metadata?.['fullResponse'] as string) || 'Ответ не получен';

    // Добавляем метаинформацию в конец
    const metaInfo = `

---

🔧 **Анализ кода завершен**

**Метаинформация:**
- Время выполнения: ${result.duration}мс${
        result.tokensUsed
            ? `
- Использовано токенов: ${result.tokensUsed}`
            : ''
    }${
        result.metadata?.['model']
            ? `
- Модель: ${result.metadata['model'] as string}`
            : ''
    }${
        result.metadata?.['detectedLanguage']
            ? `
- Язык: ${result.metadata['detectedLanguage'] as string}`
            : ''
    }${
        result.metadata?.['additionalFilesCount'] !== undefined
            ? `
- Дополнительных файлов: ${result.metadata['additionalFilesCount'] as number}`
            : ''
    }
- Статус обработки: ${result.success ? '✅ Успешно' : '❌ С ошибками'}`;

    return aiResponse + metaInfo;
}
