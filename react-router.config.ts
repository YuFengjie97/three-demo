import type { Config } from "@react-router/dev/config";

const base = process.env.NODE_ENV === 'production' ? '/three-demo/' : '/'



export default {
  basename: base,
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: false,
  async prerender() {
    return ["/", "/three/csm"];
  },
} satisfies Config;
