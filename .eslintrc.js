module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    es6: true,
    node: true
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    sourceType: 'module'
  },
  rules: {},
  overrides: [
    {
      files: ['*.js'],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
      }
    }
  ]
}
