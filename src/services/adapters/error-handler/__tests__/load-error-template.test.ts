import { loadErrorTemplate } from '../load-error-template';

describe('loadErrorTemplate', () => {
    it('должен загружать шаблон системной ошибки', () => {
        const template = loadErrorTemplate('system');

        expect(template).toContain('# ⚠️ Системная ошибка');
        expect(template).toContain('{{error_message}}');
        expect(template).toContain('{{node_version}}');
    });

    it('должен загружать шаблон ошибки валидации', () => {
        const template = loadErrorTemplate('validation');

        expect(template).toContain('# ❌ Ошибка валидации');
        expect(template).toContain('{{error_message}}');
        expect(template).toContain('{{error_details}}');
    });

    it('должен загружать шаблон файловой ошибки', () => {
        const template = loadErrorTemplate('file');

        expect(template).toContain('# 📁 Ошибка файловой операции');
        expect(template).toContain('{{operation}}');
        expect(template).toContain('{{file_path}}');
    });

    it('должен выбрасывать ошибку для несуществующего типа', () => {
        expect(() => {
            // @ts-expect-error: Тестируем неправильный тип
            loadErrorTemplate('nonexistent');
        }).toThrow('Шаблон для типа ошибки "nonexistent" не найден');
    });
});
