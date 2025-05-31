import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default {
  input: './src/index.ts',
  output: {
    dir: 'dist',
    format: 'es',
  },
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs(),
    typescript(),
  ],
  build: {
    rollupOptions: {
      output: {
        experimentalMinChunkSize: 100000, // Minimum chunk size in bytes
      },
    },
  },
  external: ['react', 'react-dom'],
};
