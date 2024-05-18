const fs = require('fs');
const path = require('path');

const prettierOptions = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '.prettierrc'), 'utf8'),
);

module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'airbnb',
    'airbnb-typescript',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'],
  },
  ignorePatterns: ['.eslintrc.js'],
  plugins: [
    '@typescript-eslint',
    'react',
    'prettier',
    'react-hooks',
    'jsx-a11y',
  ],
  rules: {
    // javascript eslint rules
    'no-console': 'off',
    'spaced-comment': 'off',
    'import/no-cycle': 'off',
    'prefer-template': 'off',
    'no-lonely-if': 'off',
    'no-param-reassign': 'off',
    'no-nested-ternary': 'off',
    'no-unneeded-ternary': 'off',
    'import/no-extraneous-dependencies': ['off'],
    'import/no-anonymous-default-export': 'off',
    'import/prefer-default-export': 'off',
    'no-bitwise': 'off',
    'no-plusplus': 'off',
    'prefer-destructuring': 'off',
    'object-shorthand': 'off',
    'consistent-return': 'off',
    'no-unsafe-optional-chaining': 'off',
    'no-else-return': 'off',
    'no-promise-executor-return': 'off',
    'no-restricted-syntax': 'off',
    'no-underscore-dangle': 'off',
    'no-await-in-loop': 'off',

    // react eslint
    'react/react-in-jsx-scope': 'off',
    'react/function-component-definition': 'off',
    'react/jsx-curly-brace-presence': 'off',
    'react/destructuring-assignment': 'off',
    'react/no-unescaped-entities': 'off',
    'react/jsx-boolean-value': 'off',
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
    // 'react/no-unknown-property': 'off',

    // 'react/prop-types': 'off',
    // 'react/jsx-filename-extension':'off',
    'react/jsx-props-no-spreading': 'off',
    'react/no-unstable-nested-components': ['off'],
    'react/jsx-no-constructed-context-values': 'off',
    'react/require-default-props': 'off',
    'react/no-unknown-property': 'off',
    // 'testing-library/no-node-access':'off',

    // typescript rules
    '@typescript-eslint/dot-notation': 'off',
    // '@typescript-eslint/no-use-before-define': ['error'],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-shadow': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/naming-convention': ['off'],

    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/anchor-has-content': 'off',
    'jsx-a11y/label-has-associated-control': 'off',

    // react-hooks rules
    'react-hooks/rules-of-hooks': 'off',
    'react-hooks/exhaustive-deps': 'off',

    // enable rules

    '@typescript-eslint/no-unused-vars': 'warn',
    'prettier/prettier': ['warn', prettierOptions],
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
        ],
      },
    ],
    'react/jsx-handler-names': 2,
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      typescript: {},
    },
  },
};
