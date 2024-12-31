const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    lintOnSave: false,
    configureWebpack: config => {
        config.resolve = {
            ...config.resolve,
            alias: {
                ...config.resolve.alias,
                '@': path.resolve(__dirname, 'src'),
                '@huggingface/transformers': path.resolve(__dirname, 'node_modules/@huggingface/transformers'),
            },
            fallback: {
                fs: false,
                path: require.resolve('path-browserify'),
                os: false,
            },
        };
        config.plugins.push(
            new CopyPlugin({
                patterns: [
                    {from: 'node_modules/onnxruntime-web/dist/*.wasm', to: '[name][ext]'},
                    {from: './src/ai/model', to: 'model'},
                ],
            })
        );
    },
    css: {
        loaderOptions: {
            less: {
                lessOptions: {
                    javascriptEnabled: true,
                },
            },
        },
    },
};
