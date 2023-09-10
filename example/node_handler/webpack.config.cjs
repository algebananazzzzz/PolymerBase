const path = require('path');
const { DefinePlugin } = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = async () => {
    return {
        mode: 'production',
        entry: './src/deployment.js',
        output: {
            filename: 'index.js',
            path: path.resolve(__dirname, 'dist'),
            libraryTarget: 'commonjs',
        },
        target: 'node',
        plugins: [
            new DefinePlugin({
                CONFIG: JSON.stringify(appConfig)
            }),
        ],
        externalsPresets: { node: true },
        externals: [nodeExternals()],
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                        },
                    },
                },
            ],
        },
    };
};
