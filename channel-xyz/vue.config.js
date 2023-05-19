process.env.VUE_APP_VERSION = require("./package.json").version;
process.env.VUE_APP_NAME = require("./package.json").name;

module.exports = {
    configureWebpack: {
        devtool: "source-map",
    },
    devServer: {
        proxy: {
            "^/api": {
                target: process.env.VUE_APP_API_URL,
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                  '^/api': ''
                }
            },
        },
    },
};
