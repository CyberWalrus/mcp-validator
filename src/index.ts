#!/usr/bin/env tsx

/**
 * MCP Validator 2.0 - Entry Point
 *
 * ИСКЛЮЧЕНИЕ: Entry point файл не следует правилу "один файл - одна функция"
 *
 * Миграция на официальные SDK:
 * - @modelcontextprotocol/sdk для MCP протокола
 * - OpenAI SDK для агентной архитектуры
 *
 * СОХРАНЕНЫ все функции:
 * - Чтение файлов через readFileContent()
 * - Markdown вывод ошибок через renderErrorResponse()
 * - Промпты из .md файлов
 * - 9 типов валидации и параллельное тестирование промптов
 */

import { main } from './lib/cli/main';
import { error } from './lib/helpers/logger/index';

main().catch((err: unknown) => {
    error('💥 Необработанная ошибка:', { error: err });
    process.exit(1);
});
