import type { Config } from "@react-router/dev/config";
import fs from "node:fs";
import path from "node:path";
import { getENV } from "vite.config";
import routes from './app/routes'
import { rm, access } from 'fs/promises';
import { resolve } from 'path';

function getAllPath(): string[]{
  const paths = routes.map(item=>item?.path ?? '/') as string[]
  console.log(paths);
  return paths
}
getAllPath()

const { VITE_BASE } = getENV()



async function deleteFolder(dirPath: string) {
  // 使用 resolve 确保是绝对路径，避免路径歧义
  const absolutePath = resolve(dirPath);

  try {
    console.log(`正在删除文件夹: ${absolutePath} ...`);

    await rm(absolutePath, {
      recursive: true, // 递归删除内容
      force: true,     // 如果不存在也不报错
      maxRetries: 3,   // 可选：如果文件被占用，重试次数
      retryDelay: 500  // 可选：重试间隔 (ms)
    });

    console.log(`✅ 文件夹删除成功: ${absolutePath}`);
  } catch (error) {
    // 由于使用了 force: true，通常不会进到这里，除非是权限问题
    console.error(`❌ 删除文件夹失败:`, error);
    throw error; // 抛出错误让调用者知道失败了
  }
}



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
      await deleteFolder(src)
    }
  },
} satisfies Config;
