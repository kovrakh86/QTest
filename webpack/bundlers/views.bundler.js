const glob = require("glob");
const path = require("path");
const merge = require("webpack-merge");

const HtmlWebpackPlugin = require("html-webpack-plugin");

var ViewsBundler = function (isProd, srcPath) {
    var layouts = require("handlebars-layouts");

    var equalFn = function (handlebars) {
        handlebars.registerHelper("if_eq", function (a, b, options) {
            // noinspection EqualityComparisonWithCoercionJS
            if (a == b) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        });
    };

    var notEqualFn = function (handlebars) {
        handlebars.registerHelper("if_ne", function (a, b, options) {
            // noinspection EqualityComparisonWithCoercionJS
            if (a != b) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        });
    };

    var rawFn = function (handlebars) {
        handlebars.registerHelper("raw", function (options) {
            return options.fn();
        });
    };

    var repeatFn = function (handlebars) {
        handlebars.registerHelper("repeat", function (count, options) {
            var result = "", data;
            if (options.data) {
                data = handlebars.createFrame(options.data);
            }
            for (var i = 0; i < count; ++i) {
                if (data) {
                    data.index = i;
                }
                result += options.fn(i, { data: data });
            }
            return result;
        });
    };

    var hbsOptions = {
        partials: glob.sync("**/_*.hbs", { cwd: path.join(srcPath) }).map(file => new Object({
            id: path.basename(file).replace(".hbs", ""),
            path: path.join(srcPath, file)
        })),
        helpers: [layouts, equalFn, notEqualFn, rawFn, repeatFn]
    };

    this.extend = (webpackConfig) => {
        return merge(webpackConfig, {
            module: {
                rules: [{
                    test: /\.hbs$/,
                    use: [{
                        loader: "pcg-hbs-loader",
                        options: hbsOptions
                    }],
                    include: [path.join(srcPath, "views")]
                }]
            },
            plugins: glob
                .sync("**/*.hbs", { cwd: path.join(srcPath) })
                .filter(file => !file.includes("components")) // root components
                .filter(file => !path.basename(file).startsWith("_")) // layouts
                .filter(file => file.split("/").length === 4) // page components
                .map(file => new HtmlWebpackPlugin({
                        filename: path.basename(file).replace("hbs", "html"),
                        template: path.join(srcPath, file),
                        inject: false
                    })
                )
        });
    };
};

module.exports = ViewsBundler;
