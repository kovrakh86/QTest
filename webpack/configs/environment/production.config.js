// UTILS
const webpack = require("webpack");
const merge = require("webpack-merge");

// PLUGINS
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

var ProductionConfig = function () {
    this.extend = (baseConfig) => {
        return merge(baseConfig, {
            mode: "production",
            optimization: {
                minimize: false
            },
            plugins: [
                new CleanWebpackPlugin({
                    dry: false,
                    cleanOnceBeforeBuildPatterns: ["*.*", "media/*", "content/*"],
                    dangerouslyAllowCleanPatternsOutsideProject: false,
                    verbose: true
                }),
                new webpack.DefinePlugin({
                    "process.env": {
                        "ENV": JSON.stringify("production")
                    }
                })
            ],
            stats: {
                errors: true,
                errorDetails: true,
                colors: true,
                warnings: false,
                excludeModules: /.*/,
                children: false
            }
        });
    };
};

module.exports = ProductionConfig;
