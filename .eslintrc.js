module.exports = {
  root: true,
  extends: [
    'airbnb',
    'plugin:flowtype/recommended',
    'prettier',
    'prettier/flowtype',
    'prettier/react',
  ],
  parser: 'babel-eslint',
  plugins: ['flowtype'],
  env: {
    jest: true,
  },
  rules: {
    'flowtype/define-flow-type': 1,
    'flowtype/no-mixed': 2,
    'flowtype/no-primitive-constructor-types': 2,
    'flowtype/no-types-missing-file-annotation': 2,
    'flowtype/no-weak-types': 2,
    'flowtype/require-parameter-type': 2,
    'flowtype/require-readonly-react-props': 0,
    'flowtype/require-return-type': [
      2,
      'always',
      {
        annotateUndefined: 'never',
      },
    ],
    'flowtype/require-valid-file-annotation': 2,
    'flowtype/type-id-match': [2, '^([A-Z][a-z0-9]+)+Type$'],
    'flowtype/use-flow-type': 1,
    'flowtype/valid-syntax': 1,
  },
  settings: {
    flowtype: {
      onlyFilesWithFlowAnnotation: false,
    },
  },
};
