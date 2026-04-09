import { useState, useEffect } from 'react';

export function useLoadFont(fontFamily: string, fontUrl: string) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let alreadyExists = false;

    // 检查字体是否已经加载过（防止重复加载）
    // 注意：用 check 方法时，字体名字如果有空格/中文最好用引号包起来
    document.fonts.forEach((font) => {
      // ⚠️ 坑：某些浏览器返回的 font.family 可能会自带双引号，所以我们把引号都去掉再对比
      const currentFamily = font.family.replace(/['"]/g, '');
      const targetFamily = fontFamily.replace(/['"]/g, '');
      
      if (currentFamily === targetFamily && font.status === 'loaded') {
        alreadyExists = true;
      }
    });
    if (alreadyExists) {
      console.log(`[字体拦截] ${fontFamily} 已经在内存中了，直接使用`);
      setIsLoaded(true);
      return;
    }

    const customFont = new FontFace(fontFamily, `url('${fontUrl}')`);
    
    customFont.load()
      .then((loadedFont) => {
        document.fonts.add(loadedFont);
        setIsLoaded(true); // 加载成功，触发重新渲染
      })
      .catch((error) => {
        console.error(`字体 ${fontFamily} 加载失败:`, error);
        setIsLoaded(true); // 即使失败也设为 true，让 Canvas 使用回退字体渲染
      });
  }, [fontFamily, fontUrl]);

  return isLoaded;
}