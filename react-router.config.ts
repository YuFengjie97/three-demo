import type { Config } from "@react-router/dev/config";
import fs from "node:fs";
import path from "node:path";
import { getENV } from "vite.config";
import routes from './app/routes'


function getAllPath(): string[]{
  const paths = routes.map(item=>item?.path ?? '/') as string[]
  console.log(paths);
  return paths
}
getAllPath()

const { VITE_BASE } = getENV()

export default {
  basename: VITE_BASE,
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: false,
  prerender: getAllPath(),
  // 构建结束后，把静态资源目录复制到 build/client/three-demo 下
  buildEnd: async ({ serverBuildPath }) => {
    const serverDir = serverBuildPath ? path.dirname(serverBuildPath) : null;
    // React Router 默认 buildDirectory 是 "build"
    const buildRoot = serverDir
      ? path.dirname(serverDir)                                // build/
      : path.resolve("build");                                 // 没有 serverBuildPath 时的兜底

    const clientDir = path.join(buildRoot, "client");          // build/client
    const targetRoot = path.join(clientDir, "three-demo");    // build/client/three-demo

    const folders = ["assets", "data", "font", "img", "model", "sound"];

    for (const folder of folders) {
      const src = path.join(clientDir, folder);
      const dest = path.join(targetRoot, folder);

      if (!fs.existsSync(src)) continue;

      fs.mkdirSync(dest, { recursive: true });
      fs.cpSync(src, dest, { recursive: true });
    }
  },
} satisfies Config;
