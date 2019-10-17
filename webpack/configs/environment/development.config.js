// UTILS
const merge = require("webpack-merge");

var DevelopmentConfig = function() {
    this.extend = (baseConfig) => {
        return merge(baseConfig, {
            mode: "development",
            devServer: {
                overlay: true,
                proxy: { 
                    "/umbraco": {
                        target: "http://pcg.site.localhost",
                        changeOrigin: true
                    },
                    "/search": {
                        target: "http://pcg.site.localhost",
                        changeOrigin: true
                    }
                }
            }
        });
    };
};

module.exports = DevelopmentConfig;
