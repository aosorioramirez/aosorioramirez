import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'ifc-construction.js',
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