import globals from 'globals';
import js from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin-js';


/** @type {import('eslint').Linter.Config[]} */
export default [{languageOptions: { globals: globals.node }},
  js.configs.recommended,
  {
    rules: {
      'no-undef': 'error',
      'no-debugger': 'error',
      'no-unused-vars': 'error',
    },
  },
  {
    plugins: {
      '@stylistic/js': stylisticJs,
    },
    rules: {
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/semi': 'error',
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/array-bracket-newline': ['error', {minItems: 10}],
      '@stylistic/js/comma-dangle': ['error', 'always-multiline'],
    },
  }];