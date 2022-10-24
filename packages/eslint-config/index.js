module.exports = {
  extends: 'eslint-config-universe',
  // do some additional things with it
  rules: {
    'prettier/prettier': ['warn', { endOfLine: 'auto' }],
  },
};
