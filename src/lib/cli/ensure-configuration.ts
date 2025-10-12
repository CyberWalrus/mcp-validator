import { APP_CONFIG, getAppConfigError, reloadAppConfig } from '../../model/config';
import { error } from '../helpers/logger/index';

/** Проверка конфигурации приложения */
export function ensureConfiguration(): void {
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
