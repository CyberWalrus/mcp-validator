import type { ValidationParams } from '../../types';
import { validateParams } from '../validate-params';

describe('validateParams', () => {
    it('должен успешно валидировать корректные параметры', () => {
        const params: ValidationParams = {
            input: {
                data: 'console.log("test");',
                type: 'content',
            },
            validationType: 'code',
        };

        expect(() => validateParams(params)).not.toThrow();
    });

    it('должен выбрасывать ошибку если нет input', () => {
        const params = {
            validationType: 'code',
        } as ValidationParams;

        expect(() => validateParams(params)).toThrow('Входные данные обязательны');
    });

    it('должен выбрасывать ошибку если нет input.type', () => {
        const params = {
            input: {
                data: 'test',
            },
            validationType: 'code',
        } as ValidationParams;

        expect(() => validateParams(params)).toThrow('Тип входных данных обязателен');
    });

    it('должен выбрасывать ошибку для пустых данных', () => {
        const params: ValidationParams = {
            input: {
                data: '',
                type: 'content',
            },
            validationType: 'code',
        };

        expect(() => validateParams(params)).toThrow('Данные для валидации не могут быть пустыми');
    });

    it('должен выбрасывать ошибку для данных только с пробелами', () => {
        const params: ValidationParams = {
            input: {
                data: '   ',
                type: 'content',
            },
            validationType: 'code',
        };

        expect(() => validateParams(params)).toThrow('Данные для валидации не могут быть пустыми');
    });

    it('должен выбрасывать ошибку если нет validationType', () => {
        const params = {
            input: {
                data: 'test',
                type: 'content',
            },
        } as ValidationParams;

        expect(() => validateParams(params)).toThrow('Тип валидации обязателен');
    });

    it('должен выбрасывать ошибку для неизвестного типа валидации', () => {
        const params = {
            input: {
                data: 'test',
                type: 'content' as unknown as 'content',
            },
            validationType: 'unknown' as unknown as 'code',
        } as ValidationParams;

        expect(() => validateParams(params)).toThrow('Неизвестный тип валидации: unknown');
    });

    it('должен требовать customPrompt для custom валидации', () => {
        const params: ValidationParams = {
            input: {
                data: 'test',
                type: 'content',
            },
            validationType: 'custom',
        };

        expect(() => validateParams(params)).toThrow('Для кастомной валидации требуется указать customPrompt');
    });

    it('должен выбрасывать ошибку для неизвестного типа источника', () => {
        const params = {
            input: {
                data: 'test',
                type: 'unknown' as unknown as 'content',
            },
            validationType: 'code',
        } as ValidationParams;

        expect(() => validateParams(params)).toThrow('Неизвестный тип источника: unknown');
    });

    it('должен выбрасывать ошибку для неизвестной кодировки', () => {
        const params = {
            input: {
                data: 'test.txt',
                encoding: 'unknown' as unknown as 'utf8',
                type: 'file',
            },
            validationType: 'code',
        } as ValidationParams;

        expect(() => validateParams(params)).toThrow('Неизвестная кодировка: unknown');
    });

    it('должен валидировать additionalFiles', () => {
        const params: ValidationParams = {
            additionalFiles: 'not-an-array' as any,
            input: {
                data: 'test',
                type: 'content',
            },
            validationType: 'code',
        };

        expect(() => validateParams(params)).toThrow('additionalFiles должен быть массивом строк');
    });

    it('должен ограничивать количество дополнительных файлов', () => {
        const params: ValidationParams = {
            additionalFiles: new Array(15).fill('file.js'),
            input: {
                data: 'test',
                type: 'content',
            },
            validationType: 'code',
        };

        expect(() => validateParams(params)).toThrow('Максимальное количество дополнительных файлов: 10');
    });

    it('должен проверять что дополнительные файлы не пустые', () => {
        const params: ValidationParams = {
            additionalFiles: ['file1.js', ''],
            input: {
                data: 'test',
                type: 'content',
            },
            validationType: 'code',
        };

        expect(() => validateParams(params)).toThrow('Все пути к дополнительным файлам должны быть непустыми строками');
    });

    it('должен ограничивать длину контекста', () => {
        const params: ValidationParams = {
            context: 'a'.repeat(15000),
            input: {
                data: 'test',
                type: 'content',
            },
            validationType: 'code',
        };

        expect(() => validateParams(params)).toThrow('Максимальная длина контекста: 10000 символов');
    });

    it('должен ограничивать длину кастомного промпта', () => {
        const params: ValidationParams = {
            customPrompt: 'a'.repeat(25000),
            input: {
                data: 'test',
                type: 'content',
            },
            validationType: 'code',
        };

        expect(() => validateParams(params)).toThrow('Максимальная длина кастомного промпта: 20000 символов');
    });

    it('должен принимать все валидные типы валидации', () => {
        const validTypes = [
            'code',
            'tests',
            'architecture',
            'security',
            'performance',
            'documentation',
            'prompts',
            'tasks',
            'custom',
        ];

        validTypes.forEach((type) => {
            const params: ValidationParams = {
                input: {
                    data: 'test',
                    type: 'content',
                },
                validationType: type as any,
                ...(type === 'custom' && { customPrompt: 'Custom prompt' }),
            };

            expect(() => validateParams(params)).not.toThrow();
        });
    });

    it('должен принимать все валидные типы источников', () => {
        const validTypes = ['content', 'file', 'url'];

        validTypes.forEach((type) => {
            const params: ValidationParams = {
                input: {
                    data: 'test',
                    type: type as any,
                },
                validationType: 'code',
            };

            expect(() => validateParams(params)).not.toThrow();
        });
    });

    it('должен принимать все валидные кодировки', () => {
        const validEncodings = ['utf8', 'utf16le', 'ascii'];

        validEncodings.forEach((encoding) => {
            const params: ValidationParams = {
                input: {
                    data: 'test.txt',
                    encoding: encoding as any,
                    type: 'file',
                },
                validationType: 'code',
            };

            expect(() => validateParams(params)).not.toThrow();
        });
    });
});
