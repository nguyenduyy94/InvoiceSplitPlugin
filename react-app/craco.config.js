const xlsxLoader = require('webpack-xlsx-loader');

module.exports = {
    webpack: {
        configure: (webpackConfig, {env, paths}) => {
            return {
                ...webpackConfig,
                entry: {
                    main: [env === 'development' && require.resolve('react-dev-utils/webpackHotDevClient'),paths.appIndexJs].filter(Boolean),
                    content: './src/content.ts',
                },
                output: {
                    ...webpackConfig.output,
                    filename: 'static/js/[name].js',
                },
                optimization: {
                    ...webpackConfig.optimization,
                    runtimeChunk: false,
                },
                module: {
                    ...webpackConfig.module,
                    rules: [
                        ...webpackConfig.module.rules,
                        { test: /\.xlsx$/, loader: "webpack-xlsx-loader" }
                    ]
                }
            }
        },
    },
};