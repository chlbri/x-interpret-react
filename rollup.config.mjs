/* eslint-disable @typescript-eslint/no-var-requires */
import { terser } from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';

/** @type {import('rollup').defineConfig} */
const bundle = config => ({
  ...config,
  input: 'src/index.ts',
  external: id => !/^[./]/.test(id),
});

/** @type {import('rollup').RollupOptions} */
export default [
  bundle({
    plugins: [esbuild(), terser({})],
    output: [
      {
        file: `lib/index.js`,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: `lib/index.mjs`,
        format: 'es',
        sourcemap: true,
      },
    ],
  }),
  bundle({
    plugins: [dts()],
    output: {
      file: `lib/index.d.ts`,
      format: 'es',
    },
  }),
];
