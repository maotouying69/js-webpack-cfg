Webpack basic settings of the project
=====================================

Sources:
1. https://developpaper.com/webpack-tutorial-how-to-set-up-webpack-5-from-scratch/
2. https://www.robinwieruch.de/webpack-advanced-setup-tutorial
3. https://www.robinwieruch.de/webpack-eslint

Create project directory
------------------------

```
mkdir webpack-cfg

cd webpack-cfg
mkdir src
mkdir dist 
mkdir build-utils
```

Initialization git repository
-----------------------------

```
cd webpack-cfg
git init

git remote add origin ssh://git@gitlab.it-notes.cz:5578/js-notes/webpack.git
```

```
vi .gitignore
node_modules/*
dist/*
*~
.#*
```

```
// package.json, add versioning
"scripts": {
  "ver:major": "npm version major",
  "ver:minor": "npm version minor",
  "ver:patch": "npm version patch"
}
```

Install webpack and plugins
---------------------------

1. step
```
npm init 
npm i --save-dev webpack webpack-cli 
```

2. step 
```
npm i --save-dev html-webpack-plugin 
```

3. step 
```
npm i --save-dev clean-webpack-plugin
```

4. step 
```
npm i --save-dev babel-loader @babel/core @babel/preset-env @babel/plugin-proposal-class-properties 
```

7. step
```
npm i --save-dev sass-loader postcss-loader css-loader style-loader postcss-preset-env node-sass
```

8. step
```
npm i --save-dev webpack-dev-server
```

9. step
```
npm i --save-dev webpack-merge
```

10. step
```
npm i --save-dev webpack-bundle-analyzer
```

11. step
```
npm i --save-dev eslint-loader eslint babel-eslint
```

Source code
-----------

1. step, test configuration
```
// file: src/index.js 
console.log('Interesting!')
```

2. step, template.html 
```
// file: src/template.html 
<!doctype html>
<html lang="en">
  <head>
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>

// file: src/index.js 
const heading = document.createElement('h1')
heading.textContent = 'Interesting!'

const app = document.querySelector('#root')
app.append(heading)
```

4. step - test babel 
```
// file: index.js 
class Game {
  name = 'Violin Charades'
}
const myGame = new Game()
const p = document.createElement('p')
p.textContent = 'Interesting!'
```

5. step - iamges
```
import example from './images/example.png'
```

6. step - fonts and inlining
```
import examplesvg from './images/example.svg'
```

7. step - scss 
```
// file: src/style/main.scss
$font-size: 1rem;
$font-color: 1ch(53 105 40);

html {
  font-size: $font-size;
  color: $font-color;
}

// file: src/index.js 
import './styles/main.scss'
```

Webpack configuration
---------------------

1. step - set entry - output
```js 
// file: webpack.config.js 
const path = require('path')

module.exports = {
  entry: {
    main: path.resolve(__dirname, './src/index.js'),
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
  },
}
```

2. step - html template 
```
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      title: 'webpack Boilerplate',
      template: path.resolve(__dirname, './src/template.html'),
      filename: 'index.html',
    }),
  ],
}
```

3. step - cleaning dist directory
```
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = {
  plugins: [
    new CleanWebpackPlugin(),
  ],
}
```

4. step - babel configuration
```
module.exports = {
  module: {
    rules: [
      { // JavaScript 
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
}
```

5. step - images
```
module.exports = {
  module: {
    rules: [
      { // Images
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
      },
    ],
  },
}
```

6. step - fonts and inlining
```
module.exports = {
  module: {
    rules: [
      { // Fonts and SVGs
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/inline',
      },
    ],
  },
}
```

7. step - styles
```
module.exports = {
  module: {
    rules: [
      { // CSS, PostCSS and Sass
        test: /\.(scss|css)$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      },
    ],
  },
}
```

8. step - set creating source maps
```
module.exports = {
  devtool: 'source-map',
}
```

9. step - divide webpack config

- webpack.config.js  (main merge part)
- webpack.common.js  (shared part)
- webpack.dev.js (development part)
- webpack.prod.js (production part)

All webpack configs move into "build-utils"

```
// file: build-utils/webpack.config.js 
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

module.exports = ({ env }) => {
  const envConfig = require(`./webpack.${env}.js`);
  return merge(commonConfig, envConfig);
};

// file: build-utils/webpack.common.js 
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
  entry: {
    main: path.resolve(__dirname, '..', './src/index.js'),
  },
  output: {
    path: path.resolve(__dirname, '..', './dist'),
    filename: '[name].bundle.js',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'webpack Boilerplate',
      template: path.resolve(__dirname, '..', './src/template.html'),
      filename: 'index.html',
    }),
  ],
  module: {
    rules: [
      { // JavaScript
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      { // Images
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
      },
      { // Fonts and SVGs
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/inline',
      },
      { // CSS, PostCSS and Sass
        test: /\.(scss|css)$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      },
    ],
  },
}

// file: build-utils/webpack.dev.js 
const path = require('path');
const webpack = require('webpack');
const { DefinePlugin } = webpack;

module.exports = {
  mode: 'development',
  plugins: [
    new DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development'),
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devtool: 'eval-source-map',
  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, '..', './dist'),
    open: true,
    compress: true,
    hot: true,
    port: 8080,
  },
};

// file: build-utils/webpack.prod.js 
const { DefinePlugin } = require('webpack');

module.exports = {
  mode: 'production',
  plugins: [
    new DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
      }
    }),
  ],
  devtool: 'source-map',
};
```

10. step - webpack addons
```
// file: build-utils/webpack.config.js 
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

const getAddons = (addonsArgs) => {
  const addons = Array.isArray(addonsArgs)
    ? addonsArgs
    : [addonsArgs];

  return addons
    .filter(Boolean)
    .map((name) => require(`./addons/webpack.${name}.js`));
};

module.exports = ({ env, addon }) => {
  const envConfig = require(`./webpack.${env}.js`);
  return merge(commonConfig, envConfig, ...getAddons(addon));
};

// file: build-utils/addons/webpack.bundleanalyze.js 
const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: path.resolve(
        __dirname,
        '..',
        '..',
        './dist/report.html'
      ),
      openAnalyzer: false,
    }),
  ],
};
```


Babel configuration
-------------------
4. step 
```
// file: .babelrc
{
  "presets": ["@babel/preset-env"],
  "plugins": ["@babel/plugin-proposal-class-properties"]
}
```

Postcss plugin
--------------
7. step
```
// file: postcss.config.js
module.exports = {
  plugins: {
    'postcss-preset-env': {
      browsers: 'last 2 versions',
    }
  },
}
```

NPM configuration
-----------------

1. step - set webpack run script
```
// file: package.json
"scripts": {
  "start": "webpack serve --config ./webpack.config.js --mode development",
  "build": "webpack --config ./webpack.config.js --mode production",

  // versioning with git
  "ver:major": "npm version major",
  "ver:minor": "npm version minor",
  "ver:patch": "npm version patch"
}
```

9. step - dividing configuration dev and prod with shared part
```
// file: package.json 
"scripts": {
  "start": "webpack serve --config build-utils/webpack.config.js --env env=dev",
  "build": "webpack --config build-utils/webpack.config.js --env env=prod",
}
```

10. step - webpack addons
```
// file: package.json
"scripts": {
  "build:analyze": "npm run build -- --env addon=bundleanalyze",
}
```

ESLint configuration
--------------------
source: https://eslint.org/docs/rules/

11. step - eslint 
```
// file: .eslintrc
{
  "env": {
    "browser": true,
  },
  "parser": "babel-eslint",
  "extends": "eslint:recommended",
  "rules": {
    "max-len": [1, 120, 2, {ignoreComments: true}]
  }
}
```

Run test
--------
1. step - run webpack 
```
npm run build
```

```
npx http-server dist  -> /report.html
```

