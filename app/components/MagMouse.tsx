/**
 * 磁力鼠标指针
 * 只需要将目标元素设置data-type='mag'即可
 */


import { createStyleWrap } from '~/utils/sty'
import styles from './MagMouse.module.less'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

export default function main() {
  const sty = createStyleWrap(styles)
  const magRef = useRef<HTMLDivElement>(null)
  const cornorRefs = useRef<HTMLDivElement[]>([])
  const gap = 15
  const magBaseSize = 30
  const cornorBaseSize = 10
  const cornorMaxSize = 30
  const cornorStrokeWidth = 5
  const cornorColor = '#6cec45'

  useGSAP(() => {
    const xTo = gsap.quickTo(magRef.current, 'x', {
      duration: 0.2,
      ease: 'power2.out',
    })
    const yTo = gsap.quickTo(magRef.current, 'y', {
      duration: 0.2,
      ease: 'power2.out',
    })
    const wTo = gsap.quickTo(magRef.current, 'width', {
      duration: 0.3,
      ease: 'power2.out',
    })
    const hTo = gsap.quickTo(magRef.current, 'height', {
      duration: 0.3,
      ease: 'power2.out',
    })
    const wCornorTo = gsap.quickTo(cornorRefs.current, 'width', {
      duration: 0.3,
      ease: 'power2.out',
    })
    const hCornorTo = gsap.quickTo(cornorRefs.current, 'height', {
      duration: 0.3,
      ease: 'power2.out',
    })

    const handleMouseMove = (event: MouseEvent) => {
      // reset
      const { x, y } = event
      xTo(x - magBaseSize / 2)
      yTo(y - magBaseSize / 2)
      wTo(magBaseSize)
      hTo(magBaseSize)
      wCornorTo(cornorBaseSize)
      hCornorTo(cornorBaseSize)

      const tar = event.target
      if (!tar) return

      const isMagTar = (tar as HTMLElement).getAttribute('data-type') === 'mag'
      if (!isMagTar) return

      {
        const { width, height, x, y } = (
          tar as HTMLElement
        ).getBoundingClientRect()
        xTo(x - cornorStrokeWidth*1.5)
        yTo(y - cornorStrokeWidth*1.5)
        wTo(width + gap)
        hTo(height + gap)
        const cornorSize = Math.min(cornorMaxSize, Math.min(width,height)*.5)
        wCornorTo(cornorSize)
        hCornorTo(cornorSize)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [magRef, cornorRefs])

  return (
    <div
      className={sty('mag-con')}
      ref={magRef}
      style={
        {
          '--border-w': `${cornorStrokeWidth}px`,
          '--border-col': cornorColor,
        } as React.CSSProperties
      }
    >
      <div
        ref={(el) => {
          cornorRefs.current[0] = el
        }}
        className={sty('mag', 'lt')}
      ></div>
      <div
        ref={(el) => {
          cornorRefs.current[1] = el
        }}
        className={sty('mag', 'rt')}
      ></div>
      <div
        ref={(el) => {
          cornorRefs.current[2] = el
        }}
        className={sty('mag', 'lb')}
      ></div>
      <div
        ref={(el) => {
          cornorRefs.current[3] = el
        }}
        className={sty('mag', 'rb')}
      ></div>
    </div>
  )
}
