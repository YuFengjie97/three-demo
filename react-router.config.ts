import type { Config } from "@react-router/dev/config";
import { getENV } from "vite.config";
import routes from './app/routes'


function getAllPath(): string[]{
  const paths = routes.map(item=>item?.path ?? '/') as string[]
  console.log(paths);
  return paths
}
getAllPath()

const {VITE_BASE} = getENV()

export default {
  basename: VITE_BASE,
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: false,
  prerender: getAllPath(),
} satisfies Config;
