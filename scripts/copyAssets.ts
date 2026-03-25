import { cp, access } from 'fs/promises';
import { resolve } from 'path';

// 定义路径
// __dirname 在 TS 中需要配合配置使用，或者使用 import.meta.url (推荐现代写法)
// 这里为了兼容性，假设你使用了 ts-node 或编译后运行，__dirname 是可用的。
// 如果是纯 ESM 模式，请使用: import { fileURLToPath } from 'url'; const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = process.cwd(); 


async function copyFolder(srcDir: string, destDir: string) {
  try {
    // 1. 检查源目录是否存在
    await access(srcDir);
    console.log(`✅ 源目录存在: ${srcDir}`);

    // 2. 执行复制
    // recursive: true -> 递归复制子文件夹
    // force: true -> 如果目标存在同名文件则覆盖
    await cp(srcDir, destDir, {
      recursive: true,
      force: true,
      preserveTimestamps: false,
    });

    console.log(`🚀 成功将图片从 "${srcDir}" 复制到 "${destDir}"`);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.error('❌ 错误：源目录不存在，请确认是否已执行构建命令生成 build 文件夹。');
      console.error(`   尝试查找路径: ${srcDir}`);
    } else {
      console.error('❌ 复制过程中发生未知错误:', error);
    }
    process.exit(1);
  }
}

const srcs = ['assets','data','font','img','model','sound']
const DEST_DIR = resolve(ROOT_DIR, 'build', 'client', 'thee-demo');

srcs.forEach(src => {
  const SRC_DIR = resolve(ROOT_DIR, 'build', 'client', src);
  copyFolder(SRC_DIR, DEST_DIR)
})