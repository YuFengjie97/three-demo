import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three/webgpu'


export function useMouseRay(){
  const mouse = new THREE.Vector2(0, 0);

  const { rayCaster } = useMemo(() => {
    const rayCaster = new THREE.Raycaster();
    return { rayCaster };
  }, []);

  // 鼠标事件更新mouse
  useEffect(() => {
    function handlePointmove(event: MouseEvent) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    document.addEventListener("pointermove", handlePointmove);

    return () => {
      document.removeEventListener("pointermove", handlePointmove);
    };
  }, []);

  const { camera } = useThree();
  // rayCaster根据鼠标更新
  useFrame(() => {
    rayCaster.setFromCamera(mouse, camera);
    // const intersects = rayCaster.intersectObject(skull);
    // if (intersects.length > 0) {
    //   hitCallback()
    //   // unifroms.uHitPosition.value.copy(intersects[0].point);
    // }
  });

  return {rayCaster}
}