module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: ['plugin:prettier/recommended'],
  globals: {
    chrome: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    /**
     * @fixable 箭头函数只有一个参数的时候，必须加括号
     */
    'arrow-parens': ['error', 'always'],
  },
};
