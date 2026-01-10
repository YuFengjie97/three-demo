import type { Config } from "@react-router/dev/config";
// import { getENV } from "vite.config";


// const {VITE_BASE} = getENV()

export default {
  // basename: VITE_BASE,
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
  // async prerender() {
  //   return ["/", "/three/csm"];
  // },
} satisfies Config;
