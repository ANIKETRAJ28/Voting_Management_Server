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
        typescript: {},
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
            ['^\\w', '^@?\\w'], // external first
            ['^@/'], // alias second
            ['^\\.'], // relative third
            ['^\\u0000'], // side effects last
          ],
        },
      ],

      'simple-import-sort/exports': 'error',
    },
  },
];
