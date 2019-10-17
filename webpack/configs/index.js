// UTILS
const path = require("path");
const merge = require("webpack-merge");

// BUNDLERS
var ScriptsBundler = require("../bundlers/scripts.bundler");
var ViewsBundler = require("../bundlers/views.bundler");
var StylesBundler = require("../bundlers/styles.bundler");
var ImagesBundler = require("../bundlers/images.bundler");
var FontsBundler = require("../bundlers/fonts.bundler");

// CONFIGS
const BaseConfig = require("./base/base.config");
const DevelopmentConfig = require("./environment/development.config");
const ProductionConfig = require("./environment/production.config");
const DevServerConfig = require("./target/devServer.config");

module.exports = function (env) {
    const isProd = env && env.prod === true;

    const srcPath = path.join(__dirname, "../../src");
    const distPath = path.join(__dirname, "../../dist");
    const cachePath = path.join(__dirname, "../../node_modules", ".cache");

    var baseConfig = merge(new BaseConfig(), {
        context: srcPath,
        output: {
            path: distPath,
            filename: "./content/[name].js",
            pathinfo: true
        }
    });

    baseConfig = new ScriptsBundler(isProd, cachePath, srcPath).extend(baseConfig);
    baseConfig = new ViewsBundler(isProd, srcPath).extend(baseConfig);
    baseConfig = new StylesBundler(isProd, cachePath).extend(baseConfig);
    baseConfig = new ImagesBundler(isProd, srcPath).extend(baseConfig);
    baseConfig = new FontsBundler(isProd, srcPath).extend(baseConfig);

    var config = !isProd
        ? new DevelopmentConfig().extend(baseConfig)
        : new ProductionConfig().extend(baseConfig);

    var configs = [config];

    if (!isProd) {
        configs.push(new DevServerConfig(srcPath).extend(new BaseConfig()));
    }

    return configs;
};
