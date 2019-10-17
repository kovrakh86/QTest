const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");

var ScriptsBundler = function (isProd, cachePath, srcPath) {
    this.extend = (webpackConfig) => {
        var entry = {
            "js/app": path.join(srcPath, "index")
        };

        return merge(webpackConfig, {
            entry: entry,
            resolve: {
                alias: {
                    "./jquery.validation": require.resolve("jquery-validation"),
                    "jquery.validation": require.resolve("jquery-validation")
                }
            },
            module: {
                rules: [{
                    test: /.(js)$/,
                    use: [{
                        loader: "babel-loader",
                        options: {
                            cacheDirectory: path.join(cachePath, "babel-loader"),
                            presets: ["@babel/preset-env"]
                        }
                    }],
                    exclude: [/(node_modules)/]
                }]
            },
            optimization: {
                runtimeChunk: {
                    name: "js/runtime"
                },
                splitChunks: {
                    minSize: 0,
                    chunks: "all",
                    maxInitialRequests: Infinity,
                    maxAsyncRequests: Infinity,
                    cacheGroups: {
                        default: false,
                        vendors: false,
                        commonDependecies: {
                            name: "js/common",
                            minChunks: 2,
                            enforce: true,
                            test: (module, chunks) => true
                        },
                        jsVendors: {
                            name: "js/vendors",
                            enforce: true,
                            test: (module, chunks) =>
                                chunks.every(chunk => chunk.name.includes("js/app"))
                                && module.nameForCondition
                                && (module.nameForCondition().includes("node_modules") || module.nameForCondition().includes("vendors"))
                        }
                    }
                }
            },
            plugins: [
                new webpack.ProvidePlugin({
                    $: "jquery",
                    jQuery: "jquery",
                    "window.jQuery": "jquery",
                    tether: "tether",
                    Tether: "tether",
                    "window.Tether": "tether",
                    Popper: ["popper.js", "default"]
                })
            ]
        });
    };
};

module.exports = ScriptsBundler;
