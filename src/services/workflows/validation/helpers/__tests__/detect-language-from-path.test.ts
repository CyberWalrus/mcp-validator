import { detectLanguageFromPath } from '../detect-language-from-path';

describe('detectLanguageFromPath', () => {
    it('должен определять JavaScript файлы', () => {
        expect(detectLanguageFromPath('script.js')).toBe('javascript');
        expect(detectLanguageFromPath('component.jsx')).toBe('javascript');
        expect(detectLanguageFromPath('module.mjs')).toBe('javascript');
        expect(detectLanguageFromPath('config.cjs')).toBe('javascript');
    });

    it('должен определять TypeScript файлы', () => {
        expect(detectLanguageFromPath('component.ts')).toBe('typescript');
        expect(detectLanguageFromPath('component.tsx')).toBe('typescript');
    });

    it('должен определять Python файлы', () => {
        expect(detectLanguageFromPath('script.py')).toBe('python');
        expect(detectLanguageFromPath('gui.pyw')).toBe('python');
    });

    it('должен определять C/C++ файлы', () => {
        expect(detectLanguageFromPath('main.c')).toBe('c');
        expect(detectLanguageFromPath('class.cpp')).toBe('cpp');
        expect(detectLanguageFromPath('header.h')).toBe('c');
        expect(detectLanguageFromPath('header.hpp')).toBe('cpp');
    });

    it('должен определять другие популярные языки', () => {
        expect(detectLanguageFromPath('Main.java')).toBe('java');
        expect(detectLanguageFromPath('program.go')).toBe('go');
        expect(detectLanguageFromPath('lib.rs')).toBe('rust');
        expect(detectLanguageFromPath('script.php')).toBe('php');
        expect(detectLanguageFromPath('app.rb')).toBe('ruby');
    });

    it('должен определять shell скрипты', () => {
        expect(detectLanguageFromPath('script.sh')).toBe('shell');
        expect(detectLanguageFromPath('setup.bash')).toBe('shell');
        expect(detectLanguageFromPath('config.zsh')).toBe('shell');
    });

    it('должен определять Markdown файлы', () => {
        expect(detectLanguageFromPath('readme.md')).toBe('markdown');
        expect(detectLanguageFromPath('CHANGELOG.markdown')).toBe('markdown');
        expect(detectLanguageFromPath('docs/api.md')).toBe('markdown');
    });

    it('должен возвращать text для неизвестных расширений', () => {
        expect(detectLanguageFromPath('document.txt')).toBe('text');
        expect(detectLanguageFromPath('config.unknown')).toBe('text');
    });

    it('должен работать с файлами без расширения', () => {
        expect(detectLanguageFromPath('Dockerfile')).toBe('text');
        expect(detectLanguageFromPath('Makefile')).toBe('text');
    });

    it('должен быть нечувствительным к регистру', () => {
        expect(detectLanguageFromPath('Script.JS')).toBe('javascript');
        expect(detectLanguageFromPath('Component.TS')).toBe('typescript');
        expect(detectLanguageFromPath('Program.PY')).toBe('python');
    });

    it('должен работать с полными путями', () => {
        expect(detectLanguageFromPath('/path/to/file.js')).toBe('javascript');
        expect(detectLanguageFromPath('C:\\Users\\file.ts')).toBe('typescript');
        expect(detectLanguageFromPath('./src/components/Button.jsx')).toBe('javascript');
    });
});
