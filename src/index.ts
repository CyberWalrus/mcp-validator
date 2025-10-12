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

import { showHelp, showVersion, startMcpServer } from './lib/cli';
import { error } from './lib/helpers/logger/index';
import { APP_CONFIG, getAppConfigError, reloadAppConfig } from './model/config';
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
    error('🚀 MCP Validator 2.0 запускается...');
    error('🔧 Официальный MCP SDK + упрощенная архитектура');
    error('📝 Все функции v1.x сохранены');
    error('');

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
