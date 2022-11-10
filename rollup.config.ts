/* eslint-disable @typescript-eslint/no-var-requires */
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';

import json from './package.json' assert { type: 'json' };

const _name = json.main.replace(/\.js$/, '');

const bundle = (config: any) => ({
  ...config,
  input: 'src/index.ts',
  external: (id: string) => !/^[./]/.test(id),
});

export default [
  bundle({
    plugins: [esbuild(), typescript()],
    output: [
      {
        file: `${_name}.js`,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: `${_name}.mjs`,
        format: 'es',
        sourcemap: true,
      },
    ],
  }),
  bundle({
    plugins: [dts()],
    output: {
      file: `${_name}.d.ts`,
      format: 'es',
    },
  }),
];
