import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/app.ts',
  output: {
    dir: 'dist',
    format: 'cjs',
  },
  plugins: [typescript()],
};
