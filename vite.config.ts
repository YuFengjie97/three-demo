import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
// import glsl from 'vite-plugin-glsl'
import glslify from "vite-plugin-glslify";
import { viteStaticCopy } from 'vite-plugin-static-copy'


export function getENV() {
  const mode = process.env.NODE_ENV as string
  const env = loadEnv(mode, process.cwd())

  return env
}


export default defineConfig(({ mode }) => {
  const { VITE_BASE } = getENV()

  const isProduction = mode === 'production';

  return {
    base: VITE_BASE,
    plugins: [
      tailwindcss(),
      reactRouter(),
      tsconfigPaths(),
      // glsl(),
      glslify(),  // 可以在glsl中导入npm包
      // 将public下所有资源复制到three-demo目录下
      // viteStaticCopy({
      //   targets: [
      //     {
      //       src: 'public/*',
      //       dest: 'three-demo',
      //     },
      //   ],
      // }),
    ],
    server:{
      port: 8000
    }
    // build: {
    //   // outDir: 'build/client/three-demo',  // 不知道是不是react-router.config配置覆盖了,没用
    //   emptyOutDir: true,
    //   assetsDir: './three-demo/assets',  // 修改assets输出目录
    // },
  }
});
