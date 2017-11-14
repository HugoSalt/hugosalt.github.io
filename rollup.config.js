// rollup.config.js
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'main.js',
  dest: 'bundle.js',
  format: 'iife',
  moduleName: 'HiSayer',
  plugins: [nodeResolve({ jsnext: true, main: true })]
};
