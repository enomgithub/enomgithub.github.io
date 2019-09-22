const path = require("path")

module.exports = {
  mode: "production",  // "production" | "development" | "none"
  entry: path.join(__dirname, "src", "weather.ts"),
  output: {
    path: path.join(__dirname, "dist"),
    filename: "weather.js"
  },
  module: {
    rules: [{
      test: /\.ts$/,
      use: "ts-loader"
    }]
  },
  resolve: {
    modules: [
      "node_modules"
    ],
    extensions: [
      ".ts",
      ".js"
    ]
  }
};