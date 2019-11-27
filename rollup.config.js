import typescript from 'rollup-plugin-typescript2'
import sourceMap from 'rollup-plugin-sourcemaps'
import { uglify } from 'rollup-plugin-uglify'

export default {
  input: './src/main.ts',
  plugins: [
    typescript({
      exclude: 'node_modules/**',
      typescript: require('typescript')
    }),
    sourceMap()
  ],
  output: [{
    format: 'umd',
    name: 'particleLine',
    file: 'lib/particle-line.min.js',
    plugins: [
      uglify()
    ],
    sourcemap: false
  }, {
    format: 'umd',
    name: 'particleLine',
    file: 'lib/particle-line.js',
    sourcemap: false
  }]
}
