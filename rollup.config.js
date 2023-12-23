import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import pkg from './package.json';

export default [
  {
    input: 'src/index.ts',
    plugins: [terser(), typescript()],
    output: [
      {
        name: 'menually',
        file: pkg.browser,
        format: 'umd',
      },
      {
        file: pkg.module,
        format: 'es',
      },
    ],
  },
  {
    input: 'dist/dts/index.d.ts',
    plugins: [dts()],
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
  },
];
