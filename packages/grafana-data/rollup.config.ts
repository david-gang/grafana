import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import path from 'path';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
// import sourceMaps from 'rollup-plugin-sourcemaps';
// import { terser } from 'rollup-plugin-terser';

// const buildCjsPackage = ({ env }) => {
//   return {
//     input: `compiled/index.js`,
//     output: [
//       {
//         file: `dist/index.${env}.js`,
//         name: libraryName,
//         format: 'cjs',
//         sourcemap: true,
//         exports: 'named',
//         globals: {},
//       },
//     ],
//     external: [
//       'lodash',
//       'rxjs',
//       '@grafana/schema', // Load from host
//     ],
//     plugins: [
//       resolve(),
//       json({
//         include: [path.relative('.', require.resolve('moment-timezone/data/packed/latest.json'))], // absolute path throws an error for whatever reason
//       }),
//       commonjs({
//         include: /node_modules/,
//       }),
//       resolve(),
//       sourceMaps(),
//       env === 'production' && terser(),
//     ],
//   };
// };

const name = require('./package.json').main.replace(/\.js$/, '');

const bundle = (config) => ({
  ...config,
  input: 'src/index.ts',
  external: (id) => !/^[./]/.test(id),
});

export default [
  bundle({
    plugins: [
      resolve(),
      json({
        // absolute path throws an error for whatever reason
        include: [path.relative('.', require.resolve('moment-timezone/data/packed/latest.json'))],
      }),
      esbuild(),
    ],
    output: [
      {
        file: `${name}.js`,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: `${name}.mjs`,
        format: 'es',
        sourcemap: true,
      },
    ],
  }),
  bundle({
    plugins: [dts()],
    output: {
      file: `${name}.d.ts`,
      format: 'es',
    },
  }),
];
