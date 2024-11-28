import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import webpack from "webpack";

dotenv.config();

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
    // eslint-disable-next-line no-undef
    mode: process.env?.NODE_ENV ?? "development",
    devtool: "inline-source-map",
    entry: "./src/index.ts",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
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
      // eslint-disable-next-line no-undef
      port: process.env.DEV_PORT,
      historyApiFallback: true,
    },
    plugins: [
      new webpack.DefinePlugin({
        WEBPACK_CONFIG: JSON.stringify({
          // eslint-disable-next-line no-undef
          NODE_ENV: process.env?.NODE_ENV,
          // eslint-disable-next-line no-undef
          REFRESH_MS: process.env?.REFRESH_MS,
          // eslint-disable-next-line no-undef
          CHECK_AUTH_INTERVAL_MS: process.env?.CHECK_AUTH_INTERVAL_MS,
          // eslint-disable-next-line no-undef
          SERVER_URL: process.env?.SERVER_URL,
          // eslint-disable-next-line no-undef
          GOOGLE_API_KEY: process.env?.GOOGLE_API_KEY,
        }),
      }),
      new webpack.SourceMapDevToolPlugin({}),
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
