import resolve from '@rollup/plugin-node-resolve';

export default {
  input: '3dm-viewer.js',
  output: [
    {
      file: '3dm-bundle.js',
      format: 'cjs',
    },
  ],
  plugins: [
    resolve()
  ]
};