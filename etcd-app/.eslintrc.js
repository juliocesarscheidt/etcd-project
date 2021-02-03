// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module',
  },
  extends: [
    'airbnb-base',
  ],
  rules: {
    "no-console": "off",
  },
  env: {
    "jest": true,
  },
  // ignorePatterns: ["node_modules/", "*.spec.js"],
};
