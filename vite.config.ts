import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import netlifyReactRouter from "@netlify/vite-plugin-react-router";
import netlify from "@netlify/vite-plugin";


export function getENV() {
  const mode = process.env.NODE_ENV as string
  const env = loadEnv(mode, process.cwd())
  // console.log(env);

  return env
}


export default defineConfig(({ mode }) => {
  // const { VITE_BASE } = getENV()

  return {
    // base: VITE_BASE,
    plugins: [
      tailwindcss(),
      reactRouter(),
      tsconfigPaths(),
      netlifyReactRouter(),
      netlify()
    ],
  }
});
