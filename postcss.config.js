// подключение плагинов в файл
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");

module.exports = {
  // подключение плагинов к PostCSS
  plugins: [autoprefixer, cssnano({ preset: "default" })],
};
