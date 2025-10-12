/** MCP инструмент validate - инкапсуляция логики валидации */

import type { ValidationResult } from '../../model/types/main';
import { validateCode } from '../../services/workflows/validation';
import type { ValidationParams } from '../../services/workflows/validation/types';

/** Обрабатывает MCP запрос validate инструмента */
export async function handleValidateToolRequest(params: ValidationParams): Promise<ValidationResult> {
    return validateCode(params);
}
