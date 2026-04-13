import path from 'path'
import type { Configuration } from 'webpack'
import TerserPlugin from 'terser-webpack-plugin'

const config: Configuration = {
  mode: 'production',
  entry: './src/lib/embed/index.ts',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'embed.js',
    library: { type: 'var' },
    clean: false,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            compilerOptions: {
              jsx: 'react-jsx',
              module: 'esnext',
              moduleResolution: 'bundler',
              noEmit: false,
            },
            transpileOnly: true,
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /widget\.css$/,
        use: [
          { loader: 'css-loader', options: { exportType: 'string' } },
          'postcss-loader',
        ],
      },
      {
        test: /\.css$/,
        exclude: /widget\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  optimization: {
    minimizer: [new TerserPlugin()],
  },
  target: ['web', 'es2017'],
}

export default config
