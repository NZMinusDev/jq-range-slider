/* eslint-disable @typescript-eslint/no-var-requires */
const { HashedModuleIdsPlugin, ProvidePlugin } = require("webpack");
const path = require("path");
const fs = require("fs");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const DartSASS = require("sass");
const fibers = require("fibers");
const DoIUse = require("doiuse");
const PostcssFlexbugsFixes = require("postcss-flexbugs-fixes");
const Autoprefixer = require("autoprefixer");
const PostCSSPresetEnv = require("postcss-preset-env");
const PostCSSNormalize = require("postcss-normalize");
const OptimizeCssAssetWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const { UnusedFilesWebpackPlugin } = require("unused-files-webpack-plugin");
const { DuplicatesPlugin } = require("inspectpack/plugin");
const CircularDependencyPlugin = require("circular-dependency-plugin");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

const PATHS = {
  src_absolute: path.resolve(__dirname, "../app/src/"),
  srcPages_absolute: path.resolve(__dirname, "../app/src/pages/"),
  dist_absolute: path.resolve(__dirname, "../app/dist/"),
};

const sharedAliases = {
  "@pug": path.resolve(PATHS.src_absolute, "./pug/"),
  "@layouts": path.resolve(PATHS.src_absolute, "./layouts/"),
  "@common.blocks": path.resolve(PATHS.src_absolute, "./components/common.blocks/"),
  "@utils": path.resolve(PATHS.src_absolute, "./utils/"),
};

/**
 * Useful tool for creating name of files with hash
 * @param { string } name - what should be before hash
 * @param { string } ext - extension of output bundle files such as js/webp/png
 * @returns { string } - hashed name in production mode and nohashed in another case
 */
const hashedFileName = (name, ext) => (isDev ? `${name}.${ext}` : `${name}.[hash].${ext}`);

/**
 * loop pages folder and create stuff depending on names of pages.
 */
class ResultOfTemplatesProcessing {
  constructor() {
    const foldersOfPages = fs.readdirSync(PATHS.srcPages_absolute);
    // get all pug templates from each page folder
    const namesOfTemplates = [].concat(
      ...foldersOfPages.map((folder) =>
        fs
          .readdirSync(`${PATHS.srcPages_absolute}\\${folder}\\`)
          .filter((filename) => filename.endsWith(`.pug`))
      )
    );

    this.entries = {};
    this.HTMLWebpackPlugins = [];
    namesOfTemplates.forEach((nameOfTemplate) => {
      const shortNameOfTemplate = nameOfTemplate.replace(/\.pug/, "");

      this.entries[shortNameOfTemplate] = [
        `./pages/${shortNameOfTemplate}/${shortNameOfTemplate}.ts`,
      ];

      this.HTMLWebpackPlugins.push(
        new HTMLWebpackPlugin({
          template: `!!pug-loader!app/src/pages/${shortNameOfTemplate}/${nameOfTemplate}`,
          filename: hashedFileName(`./${shortNameOfTemplate}`, "html"),
          favicon: "./assets/ico/favicon.ico",
          chunks: [shortNameOfTemplate],
        })
      );
    });
  }
}
const resultOfTemplatesProcessing = new ResultOfTemplatesProcessing();

/**
 * HTMLWebpackPlugin - create html of pages with plug in scripts.
 * MiniCssExtractPlugin - extract css into separate files.
 * CircularDependencyPlugin - scan bundles to alert about circular dependencies.
 * DuplicatesPlugin - scan bundles to alert about duplicate resources from node_modules.
 * UnusedFilesWebpackPlugin - scan bundles to alert about UnusedFiles.
 * HashedModuleIdsPlugin - replace webpack number links to character links.
 * CleanWebpackPlugin - clean dist folder before each use.
 */
const webpackPlugins = () => {
  const plugins = [];

  if (isDev) {
    plugins.push(
      ...resultOfTemplatesProcessing.HTMLWebpackPlugins,
      new ProvidePlugin({ $: "jquery", jQuery: "jquery" })
    );
  }

  plugins.push(
    new MiniCssExtractPlugin({
      filename: isDev ? hashedFileName("styles/[name]/style", "css") : "range-slider.css",
    })
  );

  if (isProd) {
    plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(
              PATHS.src_absolute,
              "./components/common.blocks/primitives/range-slider/jq-range-slider-plugin.js"
            ),
            to: path.resolve(PATHS.src_absolute, "./../dist"),
          },
          {
            from: path.resolve(
              PATHS.src_absolute,
              "./components/common.blocks/primitives/range-slider/jq-range-slider-plugin.d.ts"
            ),
            to: path.resolve(
              PATHS.src_absolute,
              "./../dist/types/components/common.blocks/primitives/range-slider"
            ),
          },
          {
            from: path.resolve(
              PATHS.src_absolute,
              "./components/common.blocks/primitives/range-slider/range-slider-plugin.d.ts"
            ),
            to: path.resolve(
              PATHS.src_absolute,
              "./../dist/types/components/common.blocks/primitives/range-slider"
            ),
          },
        ],
      })
    );
  }

  if (process.env.MEASURE === "true") {
    plugins.push(new DuplicatesPlugin()); // writes data in stats.json as plain text, shouldn't be in dev mod)
  }

  plugins.push(
    new CircularDependencyPlugin(),
    new UnusedFilesWebpackPlugin({ patterns: ["**/*.scss", "**/*.ts"] }),
    new HashedModuleIdsPlugin({
      hashFunction: "md4",
      hashDigest: "base64",
      hashDigestLength: 8,
    }),
    new CleanWebpackPlugin()
  );

  return plugins;
};

/**
 * Loaders contraction for templates.
 * @param { string[] } includedFilesExtensions - extensions for including into bundles from components' resources; example: ["scss", "ts"].
 */
const templatesLoaders = (includedFilesExtensions = ["css", "js", "scss", "ts"]) => {
  return [
    {
      // convert pug to template function
      loader: "pug-loader",
    },
  ];
};

/**
 * Loaders contraction that loads autoprefixed normalize css with converting modern CSS into something most browsers can understand.
 * DoIUse - alerts for unsupported css features, depending on browserslist.
 * PostcssFlexbugsFixes - fix some flex bugs in old browsers.
 * @param { object } extra_loader - loader with options for css preprocessor.
 * @returns { object[] }
 */
const cssLoaders = (extraLoader) => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev,
        // if hmr does not work, this is a forceful method.
        reloadAll: true,
      },
    },
    {
      loader: "css-loader",
    },
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [
            DoIUse({}),
            PostcssFlexbugsFixes(),
            Autoprefixer(),
            PostCSSPresetEnv(),
            PostCSSNormalize(),
          ],
        },
      },
    },
  ];

  if (extraLoader) {
    loaders.push(extraLoader);
  }

  return loaders;
};

/**
 * loads js using babel
 * @param { string } extraPreset - name of loader for js preprocessor
 * @returns { string[] }
 */
const jsLoaders = (extraPreset) => {
  const babelOptions = {
    presets: ["@babel/preset-env"],
    plugins: ["@babel/plugin-proposal-class-properties"],
    cacheDirectory: "./app/cache/webpack__babel",
  };

  if (extraPreset) {
    babelOptions.presets.push(extraPreset);
  }

  return [
    {
      loader: "babel-loader",
      options: babelOptions,
    },
  ];
};

/**
 * Some useful optimizations for bundles by webpack optimization property
 */
const optimization = () => {
  const config = {};

  if (isProd) {
    // minify css and js
    config.minimizer = [new OptimizeCssAssetWebpackPlugin(), new TerserWebpackPlugin()];
  }

  return config;
};

// measures speed of each plugin in bundling
// writes data in stats.json as plain text, shouldn't be in dev mod
const smp = new SpeedMeasurePlugin({ disable: process.env.MEASURE === "false" });
module.exports = smp.wrap({
  // The base directory, an absolute path, for resolving entry points and loaders
  context: PATHS.src_absolute,
  mode: "development",
  // Declarations of used files in bundles
  entry: isDev
    ? resultOfTemplatesProcessing.entries
    : {
        "range-slider-plugin": [
          `./components/common.blocks/primitives/range-slider/range-slider-plugin.ts`,
        ],
      },
  // Where to put bundles for every entry point
  output: {
    filename: isDev ? hashedFileName("bundles/[id]/[name]", "js") : "[name].js",
    path: PATHS.dist_absolute,
  },
  resolve: {
    // You can use it while using import in css and js
    alias: sharedAliases,
    extensions: [".js", ".json", ".ts"],
  },
  plugins: webpackPlugins(),
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: templatesLoaders(),
      },
      {
        test: /\.css$/,
        use: cssLoaders(),
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders({
          loader: "sass-loader",
          options: {
            // Prefer `dart-sass` instead `node-sass`
            implementation: DartSASS,
            /* compilation faster with fiber on */
            sassOptions: {
              fiber: fibers,
            },
          },
        }),
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: jsLoaders("@babel/preset-typescript"),
      },
    ],
  },
  devtool: isDev ? "source-map" : "", // show readable file names during development process
  optimization: optimization(),
  devServer: {
    port: 4200,
    hot: isDev,
    watchContentBase: true, // watch html
  },
});
