const path = require("path");
const merge = require("webpack-merge");

var ImagesBundler = function (isProd, srcPath) {
    const REG_IMAGES = /\.(gif|png|jpg|jpeg|svg)(\?[a-z0-9=&.]+)?$/;

    this.extend = (webpackConfig) => {
        return merge(webpackConfig, {
            module: {
                rules: [{
                    test: REG_IMAGES,
                    use: [{
                        loader: "file-loader",
                        options: {
                            name: `content/[path][name].[ext]${ isProd ? "?v=[hash]" : "" }`,
                            outputPath: value => value.replace("/images/", "/images/website/")
                        }
                    }],
                    include: [path.join(srcPath, "images")]
                }, {
                    test: REG_IMAGES,
                    use: [{
                        loader: "file-loader",
                        options: {
                            name: `media/[name].[ext]${ isProd ? "?v=[hash]" : "" }`
                        }
                    }],
                    include: [path.join(srcPath, "media")]
                }, {
                    test: REG_IMAGES,
                    use: [{
                        loader: "file-loader",
                        options: {
                            name: `content/[path][name].[ext]${ isProd ? "?v=[hash]" : "" }`,
                            // replace part of path like '/_/some-sub-folder/'
                            outputPath: value => value.replace(/\/_\/[^\/]*\//, "/images/vendors/")
                        }
                    }],
                    include: [
                        path.join(srcPath, "../vendors"),
                        path.join(srcPath, "../node_modules")
                    ],
                    exclude: [/(font(s)?)/]
                }]
            }}
        );
    };
};

module.exports = ImagesBundler;
