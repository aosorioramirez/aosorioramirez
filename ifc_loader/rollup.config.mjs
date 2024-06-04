import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'ifc-viewer.js',
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