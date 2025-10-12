import { extname } from 'node:path';

/** Карта расширений файлов и соответствующих языков программирования */
const LANGUAGE_MAP: Record<string, string> = {
    '.asm': 'assembly',
    '.bash': 'shell',
    '.c': 'c',
    '.cc': 'cpp',
    '.cjs': 'javascript',
    '.clj': 'clojure',
    '.cljs': 'clojure',
    '.cpp': 'cpp',
    '.cs': 'csharp',
    '.cxx': 'cpp',
    '.dart': 'dart',
    '.elm': 'elm',
    '.ex': 'elixir',
    '.exs': 'elixir',
    '.f': 'fortran',
    '.f90': 'fortran',
    '.f95': 'fortran',
    '.fish': 'shell',
    '.go': 'go',
    '.gradle': 'groovy',
    '.groovy': 'groovy',
    '.h': 'c',
    '.hpp': 'cpp',
    '.hs': 'haskell',
    '.hxx': 'cpp',
    '.java': 'java',
    '.jl': 'julia',
    '.js': 'javascript',
    '.jsx': 'javascript',
    '.kt': 'kotlin',
    '.kts': 'kotlin',
    '.lua': 'lua',
    '.m': 'matlab',
    '.markdown': 'markdown',
    '.md': 'markdown',
    '.mdс': 'markdown',
    '.mjs': 'javascript',
    '.ml': 'ocaml',
    '.mli': 'ocaml',
    '.nim': 'nim',
    '.pas': 'pascal',
    '.php': 'php',
    '.pl': 'perl',
    '.pp': 'pascal',
    '.ps1': 'powershell',
    '.py': 'python',
    '.pyw': 'python',
    '.r': 'r',
    '.rb': 'ruby',
    '.rs': 'rust',
    '.s': 'assembly',
    '.scala': 'scala',
    '.sh': 'shell',
    '.sql': 'sql',
    '.swift': 'swift',
    '.ts': 'typescript',
    '.tsx': 'typescript',
    '.vb': 'vbnet',
    '.vbs': 'vbscript',
    '.zsh': 'shell',
};

/** Определяет язык программирования по пути к файлу */
export function detectLanguageFromPath(filePath: string): string {
    if (!filePath) {
        return 'text';
    }

    const ext = extname(filePath).toLowerCase();

    return LANGUAGE_MAP[ext] || 'text';
}
