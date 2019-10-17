// UTILS
const glob = require("glob");
const path = require("path");
const merge = require("webpack-merge");

// PLUGINS
const HtmlWebpackPlugin = require("html-webpack-plugin");

var DevServerConfig = function (srcPath) {
    var pages = function (handlebars) {
        handlebars.registerHelper("pages", function (ignore, options) {
            var pages = glob
                .sync("**/*.hbs", { cwd: path.join(srcPath) })
                .filter(file => !file.includes("components"))
                .filter(file => !path.basename(file).startsWith("_"))
                .filter(file => file.split("/").length === 4)
                .map(file => path.basename(file))
                .map(file => file.replace("hbs", "html"))
                .sort();

            var list = "";

            pages.forEach((view) => {
                list += options.fn(view);
            });

            return list;
        });
    };

    var hbsOptions = {
        helpers: [pages]
    };

    this.extend = (webpackConfig) => {
        return merge(webpackConfig, {
            mode: "development",
            entry: {
                index: path.join(srcPath, "../webpack/views", "index.hbs")
            },
            devServer: {
                overlay: true,
                watchContentBase: true,
                port: 8080
            },
            module: {
                rules: [{
                    test: /index\.hbs$/,
                    use: [{
                        loader: "pcg-hbs-loader",
                        options: hbsOptions
                    }]
                }]
            },
            plugins: [
                new HtmlWebpackPlugin({
                    filename: "index.html",
                    template: path.join(srcPath, "../webpack/views", "index.hbs"),
                    inject: false
                })
            ]
        });
    };
};

module.exports = DevServerConfig;
