import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router'
import { asset } from '~/utils/asset'
import styles from './LinkImg.module.css'

export default function main({ to, img }: { to: string; img: string }) {
  const imgUrl = asset(`${img}`)
  const [isLoading, setIsLoading] = useState(true)

  const imgRef = useRef<HTMLImageElement>(null!)
  useEffect(() => {
    // 如果图片存在(被浏览器缓存了)，且浏览器报告它已经加载完毕 (.complete 为 true)
    if (imgRef.current && imgRef.current.complete) {
      console.log('图片来自缓存，已直接加载完成')
      setIsLoading(false)
    }
  }, [])

  return (
    <div
      className='inline-blocktransition-all duration-300
      m-2
      h-30
      min-h-40
      md:w-full
      rounded-md overflow-hidden
      hover:shadow-lg hover:shadow-emerald-100
      hover:translate-y-1
      ring
      ring-amber-50
    '
    >
      <NavLink
        className='inline-block relative w-full h-full'
        to={to}
        target='_blank'
      >
        {isLoading && (
          <div
            className={`absolute
            ${styles['preview-null']}
          `}
          ></div>
        )}
        <img
          className={`
            block w-full h-full object-cover object-center transition-opacity duration-300
            ${isLoading ? 'opacity-0' : 'opacity-100'}
            `}
          ref={imgRef}
          src={imgUrl}
          onLoad={() => {
            console.log('previewImg ok')
            setIsLoading(false)
          }}
          onError={(e) => {
            console.log('预览图加载失败Error', e)
            setIsLoading(false)
          }}
        />
      </NavLink>
    </div>
  )
}
