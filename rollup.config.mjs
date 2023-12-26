import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import pkg from './package.json' assert { type: 'json' };

export default [
  {
    input: 'src/index.ts',
    plugins: [terser(), typescript()],
    output: [
      {
        name: 'accessible-widgets',
        file: pkg.browser,
        format: 'umd',
      },
      {
        file: pkg.module,
        format: 'es',
      },
      {
        file: pkg.main,
      },
    ],
  },
  {
    input: 'dist/index.d.ts',
    plugins: [dts()],
    output: [{ file: 'dist/dts/index.d.ts', format: 'es' }],
  },
];
