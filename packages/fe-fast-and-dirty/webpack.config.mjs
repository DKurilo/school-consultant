import path from "node:path";
import { fileURLToPath } from "node:url";
import HtmlWebpackPlugin from "html-webpack-plugin";

// Gets absolute path of file within app directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const resolveAppPath = (relativePath) => path.resolve(__dirname, relativePath);

// Host
const host = "localhost";

const buildConfig = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return {
    mode: "development",
    entry: "./src/index.ts",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "..", "..", "dist", "fe-fast-and-dirty"),
    },
    devServer: {
      // Enable compression
      compress: true,
      // Enable hot reloading
      hot: true,
      host,
      port: 3000,
      historyApiFallback: true,
    },
    plugins: [
      // Re-generate index.html with injected script tag.
      // The injected script tag contains a src value of the
      // filename output defined above.
      new HtmlWebpackPlugin({
        inject: true,
        template: resolveAppPath("public/index.html"),
      }),
    ],
  };
};

export default buildConfig();
