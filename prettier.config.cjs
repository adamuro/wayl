/** @type {import("prettier").Config} */
const config = {
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
  trailingComma: 'all',
  singleQuote: true,
  printWidth: 100,
};

module.exports = config;
