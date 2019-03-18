const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');
const fs = require('fs'); // to check if the file exists
const dotenv = require('dotenv');

// Get the root path (assuming your webpack config is in the root of your project!)
const currentPath = path.join(__dirname);
// Create the fallback path (the production .env)
const basePath = currentPath + '/.env';
// We're concatenating the environment name to our filename to specify the correct env file!
const envPath = basePath + '.' + env.ENVIRONMENT;

// Check if the file exists, otherwise fall back to the production .env
const finalPath = fs.existsSync(envPath) ? envPath : basePath;

// Set the path parameter in the dotenv config
const fileEnv = dotenv.config({
    path: finalPath
}).parsed;

// reduce it to a nice object, the same as before (but with the variables from the file)
const envKeys = Object.keys(fileEnv).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
    return prev;
}, {});

module.exports = {

    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.html$/,
                use: [{
                    loader: "html-loader"
                }]
            }
        ]
    },
    // plugins: [
    //     new HtmlWebPackPlugin({
    //         template: "./src/index.html",
    //         filename: "./index.html"
    //     })

    // ]
    plugins: [
        new webpack.DefinePlugin(envKeys)
    ]


};