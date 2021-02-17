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

