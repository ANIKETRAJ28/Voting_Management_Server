import tseslint from 'typescript-eslint';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import importPlugin from 'eslint-plugin-import';

export default [
  // Base recommended TS rules
  ...tseslint.configs.recommended,

  {
    files: ['**/*.{ts,js}'],

    plugins: {
      'simple-import-sort': simpleImportSort,
      import: importPlugin,
    },

    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },

    settings: {
      'import/resolver': {
        // REMOVED: typescript resolver is no longer needed without aliasing
        node: {
          extensions: ['.js', '.ts'],
        },
      },
    },

    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // 1. External packages (e.g., 'express', '@prisma/client')
            ['^\\w', '^@?\\w'],

            // 2. Own relative imports (e.g., './config', '../app')
            ['^\\.'],

            // 3. Side effects (e.g., global polyfills) and JSON/special imports
            ['^\\u0000', '\\.json$'],
          ],
        },
      ],

      'simple-import-sort/exports': 'error',
    },
  },
];
