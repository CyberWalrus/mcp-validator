#!/usr/bin/env tsx

/**
 * MCP Validator 2.0 - Entry Point
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

// ИСПРАВЛЕНИЕ: Переменные окружения загружаются через встроенный --env-file флаг Node.js

import { error, info } from './lib/helpers/logger/index';
import { APP_CONFIG, getAppConfigError, reloadAppConfig } from './model/config';
import { startMcpServer } from './server/mcp-server';
import { setupGracefulShutdown } from './server/setup-graceful-shutdown';

reloadAppConfig();

function ensureConfiguration(): void {
    reloadAppConfig();
    const configError = getAppConfigError();
    if (!APP_CONFIG || configError) {
        const message = configError?.message ?? 'Unknown configuration error';

        error('❌ Ошибка конфигурации окружения:', { message });
        error('');
        error('Создайте файл .env с содержимым:');
        error('OPENROUTER_API_KEY=your_api_key_here');
        error('LOG_LEVEL=INFO');
        process.exit(1);
    }
}

/** Показать справку CLI */
function showHelp(): void {
    info(`
🔧 MCP Validator 2.0 - AI-powered Code Quality Tool

ИСПОЛЬЗОВАНИЕ:
  yarn start                    # Запуск MCP сервера (по умолчанию)
  yarn start --help             # Показать эту справку
  yarn start --version          # Показать версию

ВОЗМОЖНОСТИ:
  • 9 типов валидации (код, тесты, архитектура, безопасность, производительность, документация, промпты, задачи, кастом)
  • Параллельное тестирование промптов с анализом консистентности
  • Интеграция с Cursor IDE через MCP протокол
  • Поддержка множественных AI моделей через OpenRouter

ТРЕБОВАНИЯ:
  • Node.js 20+
  • Переменная OPENROUTER_API_KEY в .env файле

ОБНОВЛЕНИЯ В V2.0:
  ✅ Официальный MCP SDK (@modelcontextprotocol/sdk)
  ✅ Упрощенная агентная архитектура (OpenAI SDK)
  ✅ Постоянный серверный режим (await server.connect())
  ✅ Сохранены ВСЕ функции v1.x

ПРИМЕРЫ MCP ИСПОЛЬЗОВАНИЯ:
  validate инструмент:
    {
      "tool": "validate",
      "arguments": {
        "validationType": "code",
        "input": {"type": "file", "data": "path/to/file.ts"},
        "context": "Проверка качества TypeScript кода"
      }
    }

  test-prompt инструмент:
    {
      "tool": "test-prompt", 
      "arguments": {
        "prompt": "Напиши функцию для сортировки массива",
        "iterations": 5,
        "context": "Тестирование стабильности промпта"
      }
    }
`);
}

/** Показать версию */
function showVersion(): void {
    info('mcp-validator v2.0.0');
    info('SDK Migration: Official MCP SDK + OpenAI');
}

/** Основная функция приложения */
async function main(): Promise<void> {
    // Парсинг аргументов командной строки
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.includes('-h')) {
        showHelp();
        process.exit(0);
    }

    if (args.includes('--version') || args.includes('-v')) {
        showVersion();
        process.exit(0);
    }

    // Проверка обязательных переменных окружения
    ensureConfiguration();

    // Настройка graceful shutdown
    setupGracefulShutdown();

    // Логирование старта
    info('🚀 MCP Validator 2.0 запускается...');
    info('🔧 Официальный MCP SDK + упрощенная архитектура');
    info('📝 Все функции v1.x сохранены');
    info('');

    try {
        // КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: Запуск в постоянном серверном режиме
        // Эта функция НЕ завершится - сервер будет работать постоянно
        await startMcpServer();

        // Этот код никогда не должен выполниться
        error('❌ MCP сервер неожиданно завершился');
        process.exit(1);
    } catch (err) {
        error('💥 Критическая ошибка при запуске:', { error: err });
        process.exit(1);
    }
}

// Запуск приложения
main().catch((err: unknown) => {
    error('💥 Необработанная ошибка:', { error: err });
    process.exit(1);
});
