import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'loader-viewer.js',
  output: [
    {
      file: 'bundle.js',
      format: 'cjs',
    },
  ],
  plugins: [
    resolve()
  ]
};