import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

const banner = `/**
 * ${pkg.name} v${pkg.version}
 * ${pkg.description}
 * @license ${pkg.license}
 */`;

const external = ['react', 'react-dom', 'react/jsx-runtime'];

const treeshake = {
  moduleSideEffects: true,
  propertyReadSideEffects: false,
  annotations: true,
};

const plugins = [
  resolve(),
  commonjs(),
  typescript({
    tsconfig: './tsconfig.json',
    declaration: false,
    declarationMap: false,
  }),
];

const terserPlugin = terser({
  compress: {
    pure_getters: true,
    passes: 2,
    drop_console: false,
    pure_funcs: ['console.log'],
  },
  mangle: {
    properties: false,
  },
  format: {
    comments: /^\/\*\*\s*\n.*@license/,
    preserve_annotations: true,
  },
});

export default [
  // ESM build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
      banner,
    },
    external,
    plugins,
    treeshake,
  },
  // CJS build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
      banner,
    },
    external,
    plugins,
    treeshake,
  },
  // Minified ESM build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.min.js',
      format: 'esm',
      sourcemap: true,
      banner,
    },
    external,
    plugins: [...plugins, terserPlugin],
    treeshake,
  },
  // TypeScript declarations
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'esm',
    },
    external,
    plugins: [dts({
      tsconfig: './tsconfig.json',
    })],
  },
];
