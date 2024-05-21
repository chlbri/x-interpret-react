import { globSync } from 'glob';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'rollup';
import tscAlias from 'rollup-plugin-tsc-alias';
import typescript from 'rollup-plugin-typescript2';
// import { exclude } from './lib';

const ignore = [
  '**/*.test.ts',
  '**/*.fixtures.ts',
  'src/config/**/*.ts',
  'src/fixtures/**/*',
  'src/tests/**/*',
  'src/config/**/*',
];

const input = Object.fromEntries(
  globSync('src/**/*.ts', {
    ignore,
  }).map(file => [
    // This remove `src/` as well as the file extension from each
    // file, so e.g. src/nested/foo.js becomes nested/foo
    path.relative(
      'src',
      file.slice(0, file.length - path.extname(file).length),
    ),
    // This expands the relative paths to absolute paths, so e.g.
    // src/nested/foo becomes /project/src/nested/foo.js
    fileURLToPath(new URL(file, import.meta.url)),
  ]),
);

export const DEFAULT_PATTERN = './src/**/*.ts';
export const name = '@bemedev/exclude-coverage';

export const buildInput = async (pattern, ...ignore) => {
  const arr = await glob(pattern, {
    ignore,
    cwd: process.cwd(),
  });
  const entries = arr.map(file => [
    // This remove `src/` as well as the file extension from each
    // file, so e.g. src/nested/foo.js becomes nested/foo
    path.relative(
      'src',
      file.slice(0, file.length - path.extname(file).length),
    ),
    // This expands the relative paths to absolute paths, so e.g.
    // src/nested/foo becomes /project/src/nested/foo.js
    fileURLToPath(new URL(file, import.meta.url)),
  ]);
  const input = Object.fromEntries(entries);

  return input;
};

export function exclude(...ignores) {
  return exclude.withPattern(DEFAULT_PATTERN, ...ignores);
}

/**
 * Plugin to add files with glob patterns to vitest
 *
 * @param pattern The pattern where searching files
 * @param ignores globs to exclude inside
 * @returns a vitest config
 */
exclude.withPattern = (pattern, ...ignores) => {
  exclude.ignores = ignores;
  return {
    name,
    options: async options => {
      const input = await buildInput(pattern, ...ignores);

      return {
        ...options,
        input,
      };
    },
  };
};

exclude.ignores = [];

export default defineConfig({
  input,
  plugins: [
    tscAlias(),
    typescript({
      tsconfigOverride: {
        exclude: [...ignore, 'src/fixtures/test.machine.typegen'],
      },
    }),
  ],
  external: [
    '@bemedev/react-sync',
    'react',
    '@bemedev/x-matches',
    'xstate',
  ],
  output: [
    {
      format: 'cjs',
      sourcemap: true,
      dir: `lib`,
      preserveModulesRoot: 'src',
      preserveModules: true,

      entryFileNames: '[name].cjs',
    },
    {
      format: 'es',
      sourcemap: true,
      dir: `lib`,
      preserveModulesRoot: 'src',
      preserveModules: true,
      entryFileNames: '[name].js',
    },
  ],
});
