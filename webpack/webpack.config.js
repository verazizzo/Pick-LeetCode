const path = require('path');
const glob = require('glob');
const CopyPlugin = require('copy-webpack-plugin');
 
const extension = 'ts';
 
 
 
// Recursively find all the `.ts` files inside src folder.
const matchedFiles = glob.sync(`./src/**/*.${extension}`, {
  nodir: true
});
 
 
const entry = {}
 
matchedFiles.forEach(el => {
   //remove the first 4 chars 'src/'
   //remove the last 3 chars '.ts'
   entry[el.slice(4, -3)] = path.resolve(__dirname, "..", el)
})
 
 
module.exports = {
   mode: "production",
   entry: entry,
   output: {
      path: path.join(__dirname, "../dist"),
      filename: "[name].js",
   },
   resolve: {
      extensions: [".ts", ".js"],
   },
   module: {
      rules: [
         {
            test: /\.tsx?$/,
            loader: "ts-loader",
            exclude: /node_modules/,
         },
      ],
   },
   plugins: [
      new CopyPlugin({
         patterns: [{from: ".", to: ".", context: "public"}]
      }),
   ],
};