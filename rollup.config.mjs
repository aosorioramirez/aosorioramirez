import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'model-viewer.js',
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