import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
// import glsl from 'vite-plugin-glsl'
import glslify from "vite-plugin-glslify";


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
      glslify(),
    ],
  }
});
