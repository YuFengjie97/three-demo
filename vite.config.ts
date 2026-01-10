import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";



export default defineConfig(({mode}) => {

  const base = mode === 'production' ? '/three-demo/' : '/'

  console.log(mode,   base);
  

  return {
    base,
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  }
});
