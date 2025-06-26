import { defineConfig, loadEnv } from 'vite';
import path from 'path';

import createVitePlugins from './vite/plugins';

import tailwindcss from 'tailwindcss';

import postcsspxtoviewport from 'postcss-px-to-viewport';

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd());
  const { VITE_APP_ENV } = env;
  return {
    base: VITE_APP_ENV === 'production' ? '/' : '/',
    plugins: createVitePlugins(env, command === 'build'),
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './'),

        '@': path.resolve(__dirname, './src')
      },

      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    publicDir: 'public',

    server: {
      port: 8080,
      host: true,
      open: false,
      proxy: {
        '/dev-api': {
          target: 'http://wan.mlfworldgroup.com:8810',
          //   target: 'http://192.168.1.189:8811',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/dev-api/, 'prod-api')
          //   rewrite: (p) => p.replace(/^\/dev-api/, 'pdmg')
        },
        '/ws': {
          target: 'ws://192.168.1.189:8810',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/ws/, '')
        }
      }
    },

    css: {
      postcss: {
        plugins: [
          tailwindcss,
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove();
                }
              }
            }
          },
          postcsspxtoviewport({
            // 要转化的单位
            unitToConvert: 'px',
            // UI设计稿的大小
            viewportWidth: 1920,
            // 转换后的精度
            unitPrecision: 6,
            // 转换后的单位
            viewportUnit: 'vw',
            // 字体转换后的单位
            fontViewportUnit: 'vw',
            // 能转换的属性，*表示所有属性，!border表示border不转
            propList: ['*'],
            // 指定不转换为视窗单位的类名，
            selectorBlackList: ['ignore-'],
            // 最小转换的值，小于等于1不转
            minPixelValue: 1,
            // 是否在媒体查询的css代码中也进行转换，默认false
            mediaQuery: false,
            // 是否转换后直接更换属性值
            replace: true,
            // 忽略某些文件夹下的文件或特定文件，例如 'node_modules' 下的文件
            exclude: [],
            // 包含那些文件或者特定文件
            include: [],
            // 是否处理横屏情况
            landscape: false
          })
        ]
      }
    }
  };
});
