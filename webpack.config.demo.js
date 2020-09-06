const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const config = require("./webpack.config.js");

module.exports = {
  ...config,
  plugins: [
    new HtmlWebpackPlugin({
      template: __dirname + "/public/index.html",
      filename: "index.html",
      inject: false,
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, "docs"),
    compress: true,
    port: 9000,
    open: true,
  },
};
