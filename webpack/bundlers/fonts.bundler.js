const path = require("path");
const merge = require("webpack-merge");

var FontsBundler = function (isProd, srcPath) {
    const REG_FONTS = /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/;

    this.extend = (webpackConfig) => {
        return merge(webpackConfig, {
            module: {
                rules: [{
                    test: REG_FONTS,
                    use: [{
                        loader: "file-loader",
                        options: {
                            name: `content/[path][name].[ext]${ isProd ? "?v=[hash]" : "" }`,
                            outputPath: value => value.replace("/fonts/", "/fonts/website/")
                        }
                    }],
                    include: [path.join(srcPath, "fonts")]
                }, {
                    test: REG_FONTS,
                    use: [{
                        loader: "file-loader",
                        options: {
                            name: `content/[path][name].[ext]${ isProd ? "?v=[hash]" : "" }`,
                            // replace part of path like '/_/some-sub-folder/'
                            outputPath: value => value.replace(/\/_\/[^\/]*\//, "/fonts/vendors/")
                        }
                    }],
                    include: [
                        path.join(srcPath, "../vendors"),
                        path.join(srcPath, "../node_modules")
                    ],
                    exclude: [/(image(s)?)/]
                }]
            }}
        );
    };
};

module.exports = FontsBundler;
