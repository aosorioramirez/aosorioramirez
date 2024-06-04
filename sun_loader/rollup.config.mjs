import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'sun-viewer.js',
  output: [
    {
      file: 'sun-bundle.js',
      format: 'cjs',
    },
  ],
  plugins: [
    resolve()
  ]
};