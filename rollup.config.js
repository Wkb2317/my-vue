import commonJS from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

export default [
  {
    input: './packages/vue/src/index.ts',
    output: [
      {
        sourcemap: true,
        file: './packages/vue/dist/vue.js',
        // 导出 iife 模式包
        format: 'iife',
        // 变量名
        name: 'Vue',
      },
    ],
    // 插件
    plugins: [
      typescript({
        sourceMap: true,
      }),
      // 模块路径补全
      nodeResolve(),
      commonJS(),
    ],
  },
]
