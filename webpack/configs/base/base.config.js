var BaseConfig = function () {
    return {
        target: "web",
        devtool: "source-map",
        resolve: {
            extensions: [".js"],
            modules: ["node_modules"]
        },
        resolveLoader: {
            modules: [
                "node_modules",
                "webpack/loaders"
            ]
        }
    };
};

module.exports = BaseConfig;
