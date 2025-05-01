//ИМПОРТ НЕОБХОДИМЫХ ФАЙЛОВ
const path = require("path"); //встроенный Node.js модуль для работы с путями файловой системы
const HtmlWebpackPlugin = require("html-webpack-plugin"); //генерирует HTML-файл и автоматически добавляет в него скрипты
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); //очищает папку dist перед каждой сборкой
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //извлекает CSS в отдельные файлы

//ОСНОВНАЯ КОНФИГУРАЦИЯ Webpack
module.exports = {
  //точка входа (главный JS-файл)
  entry: {
    main: "./src/components/index.js",
  },

  //настройки выходных файлов НАСТРОЙКА ВХОДНЫХ ФАЙЛОВ:
  output: {
    path: path.resolve(__dirname, "dist"), //папка для собранных файлов (dist)
    filename: "main.js", //имя основного JS-файла
    publicPath: "", //базовый путь для ресурсов (пустой для корня)
  },

  mode: "development", //режим сборки (development для разработки)
  //Настройки dev-сервера
  devServer: {
    static: path.resolve(__dirname, "./dist"), //папка с собранными файлами
    open: true, //автоматически открывать браузер
    compress: true, //сжатие gzip для ускорения загрузки
    port: 8080, //порт для локального сервера (8080)
  },

  //Модули и правила обработки файлов
  module: {
    rules: [
      {
        //JS-файлы
        test: /\.js$/,
        use: "babel-loader", //Обрабатываются babel-loader
        exclude: "/node_modules/", //Исключается папка node_modules
      },
      {
        //Ресурсы (изображения, шрифты)
        test: /\.(png|svg|jpg|gif|woff(2)?|eot|ttf|otf)$/,
        type: "asset/resource", //Обрабатываются как ресурсы (копируются в dist)
      },
      {
        //CSS-файлы
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            //Извлекаются в отдельные файлы (MiniCssExtractPlugin)
            loader: "css-loader", //Обрабатываются css-loader (с поддержкой @import)
            options: {
              importLoaders: 1,
            },
          },
          "postcss-loader", //Добавляются PostCSS-преобразования (postcss-loader)
        ],
      },
    ],
  },

  //Плагины
  plugins: [
    new HtmlWebpackPlugin({
      // создает index.html на основе шаблона
      template: "./src/index.html",
    }),
    new CleanWebpackPlugin(), // очищает dist перед сборкой
    new MiniCssExtractPlugin(), //извлекает CSS в отдельные файлы
  ],
};
