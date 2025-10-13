import type { ParallelTestResult } from '../types';

/** Генерирует техническую информацию */
export function generateTechnicalDetails(result: ParallelTestResult): string {
    return `## 🔧 Техническая информация

**Время начала тестирования:** ${result.metadata.startTime}  
**Время окончания:** ${result.metadata.endTime}  
**Общая продолжительность:** ${result.metadata.duration}мс  

**Использованная модель:** ${result.results[0]?.model || 'Не указана'}  
**Версия валидатора:** ${result.metadata.validatorVersion}  

**Параметры тестирования:**
- Количество итераций: ${result.totalTests}
- Параллельное выполнение: Да
- Анализ консистентности: Включен`;
}
